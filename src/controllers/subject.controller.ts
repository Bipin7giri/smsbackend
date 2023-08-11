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
} from "../validationSchema/subjectSchema";
import { sendNotification } from "../Notification/PushNotification";
import { DATA, NotificationResult } from "../Interface/SubjectInterface";
import { MAILDATA } from "../Interface/NodeMailerInterface";
import {
  NotificationSchemaAdmin,
  NotificationSchemaTeacher,
} from "../validationSchema/notificationSchema";
import { createMeetingApi } from "../services/zoommeeting";
import {
  classRepo,
  departmentRepo,
  meetingRepo,
  notificationRepo,
  subjectRepo,
  userRepo,
} from "../Repository";
import { Notification } from "../entity/Notification";
import { type } from "os";
import { Subject } from "typeorm/persistence/Subject";
import { In } from "typeorm";
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

export const get = async (req: any, res: Response): Promise<void> => {
  try {
    const currentUser: any = req.user;
    const repo = AppDataSource.getRepository(Department);
    const subjects: any = await repo.find({
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
    if (subjects) {
      res.json(subjects);
    } else {
      res.status(404).send("No subjects found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const getByID = async (req: any, res: Response): Promise<void> => {
  try {
    const currentUser: any = req.user;
    const repo = AppDataSource.getRepository(Subjects);
    const subjectId: any = req.params.subjectId;
    const subjects = await repo.findOne({
      where: {
        id: subjectId,
      },
      relations: ["classId", "classId.studentId", "teacherId"],
    });
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

// get all the subject that is assgin by teacher
export const getAssignSubject = async (req: any, res: Response) => {
  try {
    const currentUser: any = req.user;
    const repo = AppDataSource.getRepository(Subjects);
    const subjects = await repo.find({
      where: {
        classId: {
          studentId: {
            id: currentUser.id,
          },
          deleted: false,
        },
      },
      relations: {
        assignment: true,
        noteId: true,
      },
    });
    if (subjects) {
      res.json(subjects);
    } else {
      res.status(404).send("No subjects found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};
export const update = async (req: any, res: Response): Promise<void> => {
  try {
    const currentUser: any = req.user;
    const subjectId: any = req.params.subjectId;
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
    res.status(404).send({ error: true, message: err });
    // throw  err
  }
};

export const deleteById = async (req: any, res: Response): Promise<void> => {
  try {
    const currentUser: any = req.user;
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
  req: any,
  res: Response
): Promise<void> => {
  try {
    const validate = await NotificationSchemaTeacher.validateAsync(req.body);
    const currentUser: any = req.user;

    const classRepo = AppDataSource.getRepository(Class);

    const getAllStudent: any = await classRepo.find({
      relations: ["studentId"],
      where: {
        subjectId: {
          teacherId: {
            id: currentUser.id,
          },
        },
      },
    });
    const deviceIDs: string[] = getAllStudent.map((item: any, id: any) => {
      return item.studentId.deviceId;
    });

    // get all device id from database of the student that are in this class
    const deviceID: String[] = deviceIDs;
    let data: DATA = {
      to: deviceID,
      sound: "default",
      title: validate.title,
      body: validate.body,
      data: {
        wha: "qokq",
        flakdjlaw: "dlwaldjwalk",
      },
    };

    const result: NotificationResult = await sendNotification(data);
    res.status(202).send({ result });
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const createMeeting = async (req: Request, res: Response) => {
  try {
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = getCurrentUser(authHeader || "");
    const meetingUrl: any = await createMeetingApi(req.body);
    const subjectId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser.id,
        },
        deleted: false,
      },
    });
    const saveDb = await meetingRepo.save({
      title: req.body.title,
      joinUrl: meetingUrl.join_url,
      startUrl: meetingUrl.start_url,
      password: meetingUrl.password,
      subjectId: subjectId.id,
    });

    const getAllStudent: any = await classRepo.find({
      relations: ["studentId"],
      where: {
        studentId: subjectId.id,
      },
    });
    const studentEmail = getAllStudent.map((item: any, id: any) => {
      return item.studentId.email;
    });

    const mailData: MAILDATA = {
      to: studentEmail, // list of receivers
      subject: "[SMS] JOIN MEETING",
      html: `<div>
            <p>Hello,</p>
            <p style="color: green;">Please join the meeting link: ${meetingUrl.join_url}</p>
            <p>and here is meeting code: ${meetingUrl.password}</p>
             </div>`,
      from: "giribipin04@gmail.com",
      text: "Online classroom link",
    };
    // console.log(mailData)
    await transporter.sendMail(mailData, function (err: any, info: any) {
      if (err) console.log(err);
      else console.log("ok");
    });
    res.json(saveDb);
  } catch (err: any) {
    res.json(err);
  }
};

export const joinMeeting = async (req: Request, res: Response) => {
  try {
    const subjectId: any = req.params.subjectId;
    const meetingUrl = await meetingRepo.find({
      where: {
        subjectId: {
          id: subjectId,
        },
      },
      order: {
        updatedAt: "DESC",
      },
    });
    res.json(meetingUrl[0]);
  } catch (err: any) {
    res.json(err);
  }
};

export const getAllMeetingList = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.params;
    const meetingUrl = await meetingRepo.find({
      where: {
        subjectId: {
          id: +subjectId,
        },
      },
      order: {
        updatedAt: "DESC",
      },
    });
    res.json(meetingUrl);
  } catch (err: any) {
    res.sendStatus(500).json({
      message: err.message,
    });
  }
};

export const getAllMeetingListTeacher = async (req: any, res: Response) => {
  try {
    const currentUser: any = req.user;
    const subjectId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser.id,
        },
        deleted: false,
      },
    });
    const meetingUrl = await meetingRepo.find({
      where: {
        subjectId: {
          id: +subjectId.id,
        },
      },
      order: {
        updatedAt: "DESC",
      },
    });
    res.json(meetingUrl);
  } catch (err: any) {
    res.sendStatus(500).json({
      message: err.message,
    });
  }
};
export const createNotification = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const validate = await NotificationSchemaAdmin.validateAsync(req.body);
    const currentUser: any = req.user;

    const subjectId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser.id,
        },
      },
    });
    const allUsers: User[] = await userRepo.find({
      where: {
        deleted: false,
        blocked: false,
        departmentId: {
          semesterId: {
            subjects: {
              id: subjectId.id,
            },
          },
        },
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
      subjectId: subjectId.id,
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
export const getClassNotificationForStudent = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const currentUser: any = req.user;
    const subjects: any = await subjectRepo.find({
      where: {
        classId: {
          studentId: currentUser?.id,
        },
      },
    });
    const subjectsId = subjects.map((item: Subjects, id: number) => {
      return item.id;
    });
    const notifications: Notification[] = await notificationRepo.find({
      relations:{
        subjectId:true
      },
      select:{body:true,title:true,subjectId:{subject_name:true}},
      where: {
        subjectId: {
          id: In(subjectsId),
        },
      },
    });
    res
      .status(202)
      .json({ data: notifications, status: 202 });
  } catch (err: any) {
    throw err;
    res.status(422).json(err.message);
  }
};
