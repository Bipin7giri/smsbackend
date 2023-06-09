import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Class } from "../entity/Classes";
import { Subjects } from "../entity/Subject";
import { getCurrentUser } from "../helper/jwt";
import {
  AssignmentReports,
  CreateAssignment,
  RateSubmitedAssignment,
  SubmitAssignment,
} from "../schema/assignmentSchema";
import { Assignment } from "../entity/Assignment";
import { uploadFile } from "../helper/imageupload";
import { AssignmentSubmission } from "../entity/AssignmentSubmission";
import { MAILDATA } from "../Interface/NodeMailerInterface";
import { transporter } from "../helper/nodeMailer";
import { File } from "megajs";
const fs = require("fs");
const mega = require("mega");
const assigmnmentRepo = AppDataSource.getRepository(Assignment);
const subjectRepo = AppDataSource.getRepository(Subjects);
const assigmnmentSubmitRepo = AppDataSource.getRepository(AssignmentSubmission);
const classRepo = AppDataSource.getRepository(Class);

export const createAssignment = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
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
    let imageUrl = "";
    if (req?.file) {
      imageUrl = await uploadFile(req.file.path);
    }

    const result = await assigmnmentRepo.insert({
      deadLine: validate?.deadLine,
      pdf: imageUrl,
      word: validate?.word,
      subjectId: subjectId?.id,
      title: validate.title,
    });

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
    console.log(assignmentId);

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
      // ...validate,
      assigmnmentId: assignmentId,
      studentId: validate.studentId,
      submission: validate.submission,
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
    const { assignmentId } = req.params;
    console.log(assignmentId);
    const getAssignemtSumbitedList = await assigmnmentSubmitRepo.find({
      where: {
        assigmnmentId: {
          id: +assignmentId,
        },
      },
      relations: {
        studentId: true,
      },
    });
    console.log(getAssignemtSumbitedList);
    res.json(getAssignemtSumbitedList);
  } catch (err: any) {
    res.json(err.message);
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

export const getAssigmnmentReport = async (req: Request, res: Response) => {
  try {
    const validate = await AssignmentReports.validateAsync(req.body);
    const getAssignemtSumbitedList = await assigmnmentSubmitRepo.find({
      where: {
        studentId: {
          id: validate.studentId,
        },
        assigmnmentId: {
          subjectId: {
            id: validate.subjectId,
          },
        },
      },
    });
    const rating: Number[] = getAssignemtSumbitedList.map((item: any) => {
      return parseFloat(item.rating);
    });
    let total = 0;
    let totalRating: any = 0;
    for (let i = 0; i < rating.length; i++) {
      totalRating = totalRating + rating[i];
      total = total + 5;
    }
    const percentage = (totalRating / total) * 100;
    res.json({ performance: percentage });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getAssigmnmentReportForTeacher = async (
  req: Request,
  res: Response
) => {
  try {
    // const validate = await AssignmentReports.validateAsync(req.body);

    const studentId: any = req.params.studentId;
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = await getCurrentUser(authHeader || "");

    const subjectId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser?.id,
        },
      },
    });
    const getAssignemtSumbitedList = await assigmnmentSubmitRepo.find({
      where: {
        studentId: {
          id: studentId,
        },
        assigmnmentId: {
          subjectId: {
            id: subjectId.subjectId,
          },
        },
      },
    });
    const rating: Number[] = getAssignemtSumbitedList.map((item: any) => {
      return parseFloat(item.rating);
    });
    let total = 0;
    let totalRating: any = 0;
    for (let i = 0; i < rating.length; i++) {
      totalRating = totalRating + rating[i];
      total = total + 5;
    }
    const percentage = (totalRating / total) * 100;
    res.json({ performance: percentage });
  } catch (err: any) {
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getAssignmentListTeacher = async (req: Request, res: Response) => {
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
          teacherId: {
            id: currentUser.id,
          },
        },
      },
      order: {
        createdAt: "DESC",
      },
    });
    res.json(subjects);
  } catch (err: any) {
    res.status(422).json({ message: err.message });
  }
};
