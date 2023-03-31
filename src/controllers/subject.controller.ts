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
import { NotificationSchemaTeacher } from "../schema/notificationSchema";
const jwt = require("jsonwebtoken");
require("dotenv").config();

const requestPromise = require("request-promise");
const payload = {
  iss: process.env.ZOOM_API_KEY,
  exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, process.env.ZOOM_API_SECRET_KEY);
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
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = getCurrentUser(authHeader || "");
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

export const getByID = async (req: Request, res: Response): Promise<void> => {
  try {
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = getCurrentUser(authHeader || "");
    const repo = AppDataSource.getRepository(Subjects);
    const subjectId: any = req.params.subjectId;
    const subjects = await repo.findOne({
      where: {
        id: subjectId,
      },
      relations: ["classId", "classId.studentId", "teacherId"],
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

export const getByIDStudent = async (req: Request, res: Response) => {
  try {
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = getCurrentUser(authHeader || "");
    const repo = AppDataSource.getRepository(Subjects);
    const subjectId: any = req.params.subjectId;
    const subjects = await repo.findOne({
      where: {
        id: subjectId,
        // classId: {
        //   studentId: {
        //     id: Not(currentUser.id),
        //   },
        // },
      },
      relations: ["classId", "classId.studentId", "teacherId"],
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

  // classId: {
  //   studentId: {
  //     id: Not(currentUser.id),
  //   },
  // },
};
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = getCurrentUser(authHeader || "");
    const subjectId: any = req.params.subjectId;
    const validate = await SubjectPathSchema.validateAsync(req.body);
    const repo = AppDataSource.getRepository(Subjects);
    console.table(validate);
    const test = await repo.find(subjectId);
    console.log(test);
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

export const deleteById = async (
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
    const validate = await NotificationSchemaTeacher.validateAsync(req.body);
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = getCurrentUser(authHeader || "");
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
    console.log(getAllStudent);
    const deviceIDs: string[] = getAllStudent.map((item: any, id: any) => {
      return item.studentId.deviceId;
    });
    console.log(deviceIDs);

    // const token: string = req?.headers["authorization"]?.split(" ")[1] || "";
    // const currentUser: any = getCurrentUser(token || "");
    //   after exam

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
    console.log(result);
    res.status(202).send({ result });
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const createMeeting = async (req: Request, res: Response) => {
  let email = "bipingiri27@gmail.com"; // your zoom developer email account
  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    body: {
      topic: "Zoom Meeting Using Node JS",
      type: 1,
      settings: {
        host_video: "true",
        participant_video: "true",
      },
    },
    auth: {
      bearer: token,
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
    json: true, //Parse the JSON string in the response
  };

  requestPromise(options)
    .then(function (response: any) {
      console.log("response is: ", response);
      res.json(response);
    })
    .catch(function (err: any) {
      // API call failed...
      console.log("API call failed, reason ", err);
      res.json(err);
    });
};
