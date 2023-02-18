import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Class } from "../entity/Classes";
import { Department } from "../entity/Department";
import { Subjects } from "../entity/Subject";
import { User } from "../entity/User";
import { randomString } from "../helper/generateRandomClassCode";
import { getCurrentUser } from "../helper/jwt";
import { transporter } from "../helper/nodeMailer";
import {
  SubjectAndClassShcema,
  SubjectPathSchema,
} from "../schema/subjectSchema";
import { sendNotification } from "../Notification/PushNotification";
import { DATA, NotificationResult } from "../Interface/SubjectInterface";
import { MAILDATA } from "../Interface/NodeMailerInterface";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await SubjectAndClassShcema.validateAsync(req.body);
    const repo = AppDataSource.getRepository(Subjects);
    const userRepo = AppDataSource.getRepository(User);

    const subjects = new Subjects();
    subjects.semesterId = validate.semesterId;
    subjects.subject_name = validate.subjectName;
    subjects.teacherId = validate.teacherId;
    subjects.classCode = randomString();
    const saveSubject: any = await repo.save(subjects);

    const teacherEmail: any = await userRepo.findOne({
      where: {
        id: validate.teacherId,
      },
    });
    if (teacherEmail) {
      const mailData: MAILDATA = {
        from: "giribipin04@gmail.com", // sender address
        to: teacherEmail.email, // list of receivers
        subject: "Sending Email using Node.js",
        text: "That was easy!",
        html: `<br>Hey there! </br>   <br>ClassRoom has been created and your closecode is ${saveSubject.classCode}</br>`,
      };
      transporter.sendMail(mailData, function (err: any, info: any) {
        if (err) console.log(err);
        else console.log("ok");
      });
    }

    res.status(202).json({ message: "subject created" });
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

export const pushNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const token: string = req?.headers["authorization"]?.split(" ")[1] || "";
    // const currentUser: any = getCurrentUser(token || "");
    //   after exam

    // get all device id from database of the student that are in this class
    const deviceID: String[] = [
      "ExponentPushToken[2N7VCkEvd6Wpgg-HUdWhRB]",
      "ExponentPushToken[2N7VCkEvd6Wpgg-HUdWhRB]",
      "ExponentPushToken[2N7VCkEvd6Wpgg-HUdWhRB]",
      "ExponentPushToken[2N7VCkEvd6Wpgg-HUdWhRB]",
    ];
    let data: DATA = {
      to: deviceID,
      sound: "default",
      title: "SMS",
      body: "notification form SMS system!",
      data: {
        wha: "qokq",
        flakdjlaw: "dlwaldjwalk",
      },
    };

    const result: NotificationResult = await sendNotification(data);
    console.log(result);
    res.status(202).send({ result });
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};
