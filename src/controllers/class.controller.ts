import { Express, Request, Response } from "express";
import { AppDataSource } from "../DB/data-source";
import { Class } from "../entity/Classes";
import { Subjects } from "../entity/Subject";
import { getCurrentUser } from "../helper/jwt";
import { ClassPatchSchema, ClassSchema } from "../schema/classSchema";

import { generateHashPassword } from "../helper/hashpassword";
import { User } from "../entity/User";
const { Client } = require("pg");
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await ClassSchema.validateAsync(req.body);
    const repo = AppDataSource.getRepository(Class);
    for (let i = 0; i < validate.studentId.length; i++) {
      await repo.insert({
        semesterId: validate.semesterId,
        subjectId: validate.subjectId,
        studentId: validate.studentId[i],
      });
    }
    res.status(202).json({ message: "created semester" });
  } catch (err: any) {
    res.status(422).json(err);
  }
};

export const addStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validate = await ClassPatchSchema.validateAsync(req.body);
    const repo = AppDataSource.getRepository(Class);
    const subjectRepo = AppDataSource.getRepository(Subjects);

    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = getCurrentUser(authHeader || "");
    console.log(currentUser);
    const subjects: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser.id,
        },
      },
      relations: ["semesterId"],
    });
    console.log(subjects);

    if (validate.studentId) {
      for (let i = 0; i < validate.studentId.length; i++) {
        await repo.insert({
          semesterId: subjects?.semesterId?.id,
          subjectId: subjects?.id,
          studentId: validate.studentId[i],
        });
      }
    } else {
      await repo.insert({
        semesterId: validate.semesterId,
        subjectId: validate.subjectId,
      });
    }

    res.status(202).json({ message: "created semester" });
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
    const repo = AppDataSource.getRepository(Class);
    const subject = await repo.find({
      where: {
        subjectId: {
          teacherId: currentUser.id,
        },
      },
      relations: ["studentId"],
    });
    if (subject) {
      res.json(subject);
    } else {
      res.status(404).send("No subject found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const removeStudent = async (
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
    const repo = AppDataSource.getRepository(Subjects);
    const subject = await repo.find({
      where: {
        teacherId: {
          id: currentUser.id,
        },
      },
      relations: ["classId", "classId.studentId"],
    });
    console.table(subject);
    // user?.password = null;
    if (subject) {
      res.json(subject);
    } else {
      res.status(404).send("No subject found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};
