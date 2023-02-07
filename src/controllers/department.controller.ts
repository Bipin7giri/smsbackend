import { Express, Request, Response } from "express";
import { AppDataSource } from "../DB/data-source";
import { Department } from "../entity/Department";
import { Role } from "../entity/Role";
import { User } from "../entity/User";
import { generateHashPassword } from "../helper/hashpassword";
import { getCurrentUser } from "../helper/jwt";
import { DepartmentSchema } from "../schema/departmentSchema";
import { RegisterSchema } from "../schema/registerSchema";

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
    throw err;
  }
};

export const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const token: string = req?.headers["authorization"]?.split(" ")[1] || "";
    const currentUser: any = getCurrentUser(token || "");
    const repo = AppDataSource.getRepository(Department);
    const department = await repo.find({
      relations: ["hod"],
      where: {
        hod: {
          id: currentUser.id,
        },
      },
    });
    // user?.password = null;
    if (department) {
      res.json(department);
    } else {
      res.status(404).send("No department found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};


