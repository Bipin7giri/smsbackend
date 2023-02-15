import { Express, Request, Response } from "express";
import { AppDataSource } from "../DB/data-source";
import { Class } from "../entity/Classes";
import { Department } from "../entity/Department";
import { Subjects } from "../entity/Subject";
import { getCurrentUser } from "../helper/jwt";
import {
  SubjectAndClassShcema,
  SubjectPathSchema,
} from "../schema/subjectSchema";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await SubjectAndClassShcema.validateAsync(req.body);
    const repo = AppDataSource.getRepository(Subjects);
    const subjects = new Subjects();
    subjects.semesterId = validate.semesterId;
    subjects.subject_name = validate.subjectName;
    subjects.teacherId = validate.teacherId;
    const saveSubject: any = await repo.save(subjects);
    const classRepo = AppDataSource.getRepository(Class);
    for (let i = 0; i < validate.studentId.length; i++) {
      await classRepo.insert({
        semesterId: validate.semesterId,
        subjectId: saveSubject.id,
        studentId: validate.studentId[i],
      });
    }
    res.status(202).json({ message: "class created" });
  } catch (err: any) {
    res.status(422).json(err);
  }
};

export const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const token: string = req?.headers["authorization"]?.split(" ")[1] || "";
    const currentUser: any = getCurrentUser(token || "");
    console.log(currentUser);
    const repo = AppDataSource.getRepository(Department);
    const subjects = await repo.find({
      where: {
        ["hod"]: currentUser.id,
        semesterId: {
          subjects: {
            deleted: false,
          },
        },
      },
      relations: ["semesterId", "semesterId.subjects"],
    });
    console.log(subjects);
    // user?.password = null;
    if (subjects) {
      res.json(subjects);
    } else {
      res.status(404).send("No subjects found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const token: string = req?.headers["authorization"]?.split(" ")[1] || "";
    const currentUser: any = getCurrentUser(token || "");
    const { subjectId } = req.params;
    const validate = await SubjectPathSchema.validateAsync(req.body);
    const repo = AppDataSource.getRepository(Subjects);
    console.table(validate);
    const updateSubject = await repo.update(subjectId, validate);
    if (updateSubject) {
      res.json(updateSubject);
    } else {
      res.status(404).send("No subjects found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const deleteById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token: string = req?.headers["authorization"]?.split(" ")[1] || "";
    const currentUser: any = getCurrentUser(token || "");
    const { subjectId } = req.params;
    const repo = AppDataSource.getRepository(Subjects);
    const deleteSubject = await repo.update(subjectId, {
      deleted: true,
      deletedBy: currentUser.email,
      deletedAt: new Date(),
    });
    if (deleteSubject) {
      res.json({ message: "deleted successfully" });
    } else {
      res.status(404).send("No subjects found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};
