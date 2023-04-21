import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Class } from "../entity/Classes";
import { Subjects } from "../entity/Subject";
import { getCurrentUser } from "../helper/jwt";
import {
  CreateAssignment,
  RateSubmitedAssignment,
  SubmitAssignment,
} from "../schema/assignmentSchema";
import { Assignment } from "../entity/Assignment";
import { uploadFile } from "../helper/imageupload";
import { AssignmentSubmission } from "../entity/AssignmentSubmission";
import { MAILDATA } from "../Interface/NodeMailerInterface";
import { transporter } from "../helper/nodeMailer";
import { DATA, NotificationResult } from "../Interface/SubjectInterface";
import { sendNotification } from "../Notification/PushNotification";
import { Storage } from "megajs";
import { File } from "megajs";
import { update } from "./subject.controller";
const fs = require("fs");
const mega = require("mega");
const assigmnmentRepo = AppDataSource.getRepository(Assignment);
const subjectRepo = AppDataSource.getRepository(Subjects);
const assigmnmentSubmitRepo = AppDataSource.getRepository(AssignmentSubmission);
const classRepo = AppDataSource.getRepository(Class);

export const create = async (req: any, res: Response): Promise<void> => {
  try {
    console.log(req.body);
    const validate = await CreateAssignment.validateAsync(req.body);
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = await getCurrentUser(authHeader || "");
    const subjectId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser.id,
        },
      },
    });
    validate.subjectId = subjectId.id;
    console.log(req.file);
    if (req?.file) {
      const imageUrl = await uploadFile(req.file.path);
      validate.pdf = imageUrl;
    }

    const result = await assigmnmentRepo.insert(validate);

    const getAllStudent: any = await classRepo.find({
      relations: ["studentId"],
      where: {
        studentId: subjectId.id,
      },
    });
    //  console.log(getAllStudent)
    const studentEmail = getAllStudent.map((item: any, id: any) => {
      return item.studentId.email;
    });
    // console.log((studentEmail))
    // if(studentEmail.length>0){
    const mailData: MAILDATA = {
      from: "giribipin04@gmail.com", // sender address
      to: studentEmail, // list of receivers
      subject: "Assignment alert",
      text: "Assignment!!!",
      html: `<br>Please check your assignment details of ${subjectId.subject_name}</br>`,
    };
    // console.log(mailData)
    await transporter.sendMail(mailData, function (err: any, info: any) {
      if (err) console.log(err);
      else console.log("ok");
    });
    const deviceIDs = getAllStudent.map((item: any, id: any) => {
      return item.studentId.deviceId;
    });

    const deviceID: String[] = deviceIDs;
    let data: DATA = {
      to: deviceID,
      sound: "default",
      title: "Assignment Alert!!!",
      body: "please check your App for " + subjectId.subject_name,
      data: {
        wha: "qokq",
        flakdjlaw: "dlwaldjwalk",
      },
    };

    const results: NotificationResult = await sendNotification(data);
    // console.log(results)
    // }
    res.status(202).json({ message: "created assignment", status: 202 });
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
    const { subjectId } = req.params;
    const assigmnment = await assigmnmentRepo.find({
      where: {
        subjectId: {
          id: parseInt(subjectId),
        },
      },
    });
    if (assigmnment) {
      res.status(200).json(assigmnment);
    } else {
      res.status(404).json({ message: "no assignmetn found" });
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const submitAssigment = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const validate = await SubmitAssignment.validateAsync(req.body);
    const { assignmentId } = req.params;
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = getCurrentUser(authHeader || "");
    validate.studentId = currentUser.id;
    validate.assigmnmentId = +assignmentId;
    if (req?.file) {
      console.log(req.file);
      const imageUrl = await uploadFile(req.file.path);
      validate.submission = imageUrl;
    }

    console.log(validate);
    const data = await assigmnmentSubmitRepo.save({
      ...validate,
      assignmentId: +assignmentId,
    });

    res.status(202).json({ message: data, status: 202 });
  } catch (err: any) {
    res.status(422).json(err);
  }
};

export const getPdf = async (req: Request, res: Response) => {
  try {
    const { fileName } = req?.params;
    const file: any = File.fromURL("https://mega.nz/fm/QzoQCb6J");
    await file.loadAttributes();
    const data = await file.download();
    res.download(data);
  } catch (err: any) {
    throw err;
    res.json(err);
  }
};

export const getSubmitedAssignemnt = async (req: Request, res: Response) => {
  try {
    const { subjectId } = req.params;
    const getAssignemtSumbitedList = await assigmnmentSubmitRepo.find({
      where: {
        assigmnmentId: {
          subjectId: {
            id: +subjectId,
          },
        },
      },
      relations: {
        studentId: true,
        assigmnmentId: true,
      },
    });
    console.log(getAssignemtSumbitedList);
    res.json(getAssignemtSumbitedList);
  } catch (err) {
    res.json(err);
  }
};

export const rateSubmitedAssignment = async (req: Request, res: Response) => {
  try {
    const validate = await RateSubmitedAssignment.validateAsync(req.body);
    await assigmnmentSubmitRepo.update(
      { id: validate.submitedAssignmentId },
      {
        rating: validate.rating,
      }
    );
    res.status(204).json({ message: "Rating added" });
  } catch (err: any) {
    res.json(err);
  }
};

export const getAllAssignment = async (req: Request, res: Response) => {
  try {
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = await getCurrentUser(authHeader || "");
    const subjects = await assigmnmentRepo.find({
      where: {
        deleted: false,
        subjectId: {
          classId: {
            studentId: {
              id: currentUser.id,
            },
          },
        },
      },
      order: {
        createdAt: "DESC",
      },
      relations: {
        subjectId: true,
      },
    });
    res.json(subjects);
  } catch (err: any) {
    res.json(err.message);
  }
};
