import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Department } from "../entity/Department";
import { getCurrentUser } from "../helper/jwt";
import { DepartmentSchema } from "../schema/departmentSchema";
import { AddTeacherSchema } from "../schema/registerSchema";
import { Semester } from "../entity/Semester";
import { Role } from "../entity/Role";
import { generateHashPassword } from "../helper/hashpassword";
import { User } from "../entity/User";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await DepartmentSchema.validateAsync(req.body);
    const department = new Department();
    const repo = AppDataSource.getRepository(Department);
    department.name = validate.name;
    department.teachers = validate.teachers;
    department.hod = validate.hod;
    const saveDepartment: Department = await repo.save(department);
    if (saveDepartment) {
      res.status(202).json({ saveDepartment });
    }
  } catch (err: any) {
    res.status(422).json(err);
  }
};

export const get = async (req: Request, res: Response): Promise<void> => {
  try {
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = getCurrentUser(authHeader || "");
    const repo = AppDataSource.getRepository(Department);
    const department = await repo.find({
      relations: ["hod"],
      where: {
        hod: {
          id: currentUser.id,
        },
      },
    });
    if (department) {
      res.json(department);
    } else {
      res.status(404).send("No department found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const countDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = getCurrentUser(authHeader || "");
    const repo = AppDataSource.getRepository(Department);
    const department = await repo.count({
      where: {
        deleted: false,
      },
    });
    console.log(department);
    if (department) {
      res.json({
        department: department,
      });
    } else {
      res.status(404).send("No department found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const addTeacher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(req.params);
    const validate = await AddTeacherSchema.validateAsync(req.body);
    const { department } = req.params;
    const departmentId: number = parseInt(department);

    const semesterRepo = AppDataSource.getRepository(Semester);
    const departments: any = await semesterRepo.findOne({
      where: {
        id: departmentId,
      },
    });

    const repo = AppDataSource.getRepository(Role);
    const roles: any = await repo.findOne({
      where: {
        name: "hod",
      },
    });
    console.log(roles.id);
    const hashedPassword: any = await generateHashPassword(validate?.password);
    const user = new User();
    user.email = validate.name + departments?.name + "@kathford.com";
    user.password = hashedPassword;
    user.roleId = roles;
    const userRepo = AppDataSource.getRepository(User);
    const saveUser: any = await userRepo.save(user);
    console.log(saveUser);

    if (saveUser) {
      res.status(202).send({ message: "successfully registered", saveUser });
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const updateDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // after exam
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = getCurrentUser(authHeader || "");
    const repo = AppDataSource.getRepository(Department);
    const department = await repo.find({
      relations: ["hod"],
      where: {
        hod: {
          id: currentUser.id,
        },
      },
    });
    if (department) {
      res.json(department);
    } else {
      res.status(404).send("No department found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const getAllDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = getCurrentUser(authHeader || "");
    const repo = AppDataSource.getRepository(Department);
    const department = await repo.find({
      relations: ["semesterId"],
    });
    if (department) {
      res.json(department);
    } else {
      res.status(404).send("No department found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};
