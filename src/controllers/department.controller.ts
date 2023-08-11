import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Department } from "../entity/Department";
import { getCurrentUser } from "../helper/jwt";
import { DepartmentSchema } from "../validationSchema/departmentSchema";
import { AddTeacherSchema } from "../validationSchema/registerSchema";
import { Semester } from "../entity/Semester";
import { Role } from "../entity/Role";
import { generateHashPassword } from "../helper/hashpassword";
import { User } from "../entity/User";
import * as xlsx from "xlsx";
import { Like } from "typeorm";
import { sendNotification } from "../Notification/PushNotification";
import { NotificationSchemaAdmin } from "../validationSchema/notificationSchema";
import { MAILDATA } from "../Interface/NodeMailerInterface";
import { transporter } from "../helper/nodeMailer";
import { DATA, NotificationResult } from "../Interface/SubjectInterface";
import { departmentRepo, notificationRepo, userRepo } from "../Repository";
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await DepartmentSchema.validateAsync(req.body);

    const hod: any = await userRepo.save({
      email: validate.email,
      password: await generateHashPassword(validate.password),
      isEmailVerified: true,
    });
    const department = new Department();
    const repo = AppDataSource.getRepository(Department);
    department.name = validate.name;
    department.teachers = validate.teachers;
    department.hod = hod?.id;

    const saveDepartment: any = await repo.save(department);
    const updateUserDepartment = await userRepo.update(hod.id, {
      departmentId: saveDepartment?.id,
    });
    if (saveDepartment) {
      res.status(202).json({ saveDepartment });
    }
  } catch (err: any) {
    res.status(422).json(err);
  }
};

export const get = async (req: any, res: Response): Promise<void> => {
  try {
    const currentUser: any = req.user
    const repo = AppDataSource.getRepository(Department);
    const department = await repo.find({
      relations: ["hod"],
      where: {
        hod: {
          id: currentUser.id,
        },
        deleted: false,
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
    const repo = AppDataSource.getRepository(Department);
    const department = await repo.count({
      where: {
        deleted: false,
      },
    });
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
    const hashedPassword: any = await generateHashPassword(validate?.password);
    const user = new User();
    user.email = validate.name + departments?.name + "@kathford.com";
    user.password = hashedPassword;
    user.roleId = roles;
    const userRepo = AppDataSource.getRepository(User);
    const saveUser: any = await userRepo.save(user);

    if (saveUser) {
      res.status(202).send({ message: "successfully registered", saveUser });
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const updateDepartment = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const currentUser: any = req.user
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

export const getStudent = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const currentUser: any = req.user

    const searchData: any = req.query?.search || null;
    const searchQuery: any = `%${searchData}%`;

    if (
      searchData === "null" ||
      searchData === null ||
      searchData === undefined ||
      searchData === "undefined"
    ) {
      const students = await departmentRepo.findOne({
        relations: ["userId"],
        order: {
          updatedAt: "DESC",
        },
        where: {
          hod: {
            id: currentUser.id,
          },
        },
      });
      res.json(students);
    } else {
      const students = await departmentRepo.findOne({
        relations: ["userId"],
        order: {
          updatedAt: "DESC",
        },
        where: {
          hod: {
            id: currentUser.id,
          },
          userId: {
            email: Like(searchQuery),
          },
        },
      });
      res.json(students);
    }
  } catch (err) { }
};

export const getAllDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const repo = AppDataSource.getRepository(Department);
    const department = await repo.find({
      relations: ["semesterId", "hod"],
      where: {
        deleted: false,
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
export const addBulkStudent = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const currentUser: any = req.user
    const departmentId = await departmentRepo.findOne({
      where: {
        hod: {
          id: currentUser.id,
        },
      },
    });
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any = xlsx.utils.sheet_to_json(worksheet);

    for (let index = 0; index < data.length; index++) {
      data[index].password = await generateHashPassword(
        data[index].password.toString()
      );
      data[index].departmentId = departmentId?.id;
      data[index].isEmailVerified = true;
    }
    const output = await AppDataSource.createQueryBuilder()
      .insert()
      .into(User)
      .values(data)
      .execute();
    res.json(output);
  } catch (err: any) {
    res.json(err.message);
  }
};

export const createNotification = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const validate = await NotificationSchemaAdmin.validateAsync(req.body);
    const currentUser: any = req.user

    const findDepartmentId: any = await departmentRepo.findOne({
      where: {
        userId: {
          id: currentUser.id,
        },
      },
    });
    const allUsers: User[] = await userRepo.find({
      where: {
        deleted: false,
        blocked: false,
        departmentId: findDepartmentId?.id,
      },
    });

    const userEmail: any = allUsers.map((item: any) => {
      return item.email;
    });
    const userNotification = allUsers
      .filter((item: any) => item.deviceId !== null)
      .map((item: any) => item.deviceId);

    const mailData: MAILDATA = {
      from: "giribipin04@gmail.com", // sender address
      to: userEmail, // list of receivers
      subject: validate.title,
      text: "Alert!!!",
      html: `<br>${validate.body} </br>`,
    };
    const email = await transporter.sendMail(
      mailData,
      function (err: any, info: any) {
        if (err) console.log(err);
        else console.log("ok");
      }
    );

    const deviceID: any = userNotification;
    let data: DATA = {
      to: deviceID,
      sound: "default",
      title: validate.title,
      body: validate.body,
    };
    const datas = await notificationRepo.save({
      departmentId: findDepartmentId.id,
      ...validate,
    });
    const notification: any = await sendNotification(data);
    res
      .status(202)
      .json({ data: notification, message: "notification send", status: 202 });
  } catch (err: any) {
    res.status(422).json(err.message);
  }
};
export const getNotification = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const currentUser: any = req.user
    const getDepartmentId: any = await departmentRepo.findOne({
      where: {
        userId: {
          id: currentUser.id,
        },
      },
    });
    const getNotifications = await notificationRepo.find({
      where: {
        departmentId: getDepartmentId?.id,
      },
    });
    res.json(getNotifications);
  } catch (err: any) {
    res.json(err.message);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { departmentId } = req?.params;
    const result = await departmentRepo.update(departmentId, {
      deleted: true,
    });
    res.status(200).json({
      message: "Deleted Department",
    });
  } catch (err: any) {
    res.json(err.message);
  }
};
