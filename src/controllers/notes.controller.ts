import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Class } from "../entity/Classes";
import { Subjects } from "../entity/Subject";
import { getCurrentUser } from "../helper/jwt";
import { MAILDATA } from "../Interface/NodeMailerInterface";
import { transporter } from "../helper/nodeMailer";
import { DATA, NotificationResult } from "../Interface/SubjectInterface";
import { sendNotification } from "../Notification/PushNotification";
import { CreateNotes } from "../schema/notesSchema";
import { Notes } from "../entity/Notes";
import { uploadFile } from "../helper/imageupload";
import { copyFileSync } from "fs";
const noteRepo = AppDataSource.getRepository(Notes);
const subjectRepo = AppDataSource.getRepository(Subjects);
const classRepo = AppDataSource.getRepository(Class);
const Mega = require("mega");
export const create = async (req: any, res: Response): Promise<void> => {
  try {
    console.log(req.file);
    const validate = await CreateNotes.validateAsync(req.body);
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = await getCurrentUser(authHeader || "");
    console.log(currentUser.id);
    const subjectId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser.id,
        },
      },
    });
    console.log(subjectId);
    validate.subjectId = subjectId.id;

    console.log(req.file);
    if (req?.file) {
      const imageUrl = await uploadFile(req.file.path);
      validate.pdf = imageUrl;
      console.log(req.file);
    }
    const result = await noteRepo.insert(validate);

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
      subject: "Note alert",
      text: "Note!!!",
      html: `<br>Please check your Note details of ${subjectId.subject_name}</br>`,
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
      title: "Note Alert!!!",
      body: "please check your App for " + subjectId.subject_name,
      data: {
        wha: "qokq",
        flakdjlaw: "dlwaldjwalk",
      },
    };

    const results: NotificationResult = await sendNotification(data);
    // console.log(results)
    // }
    res.status(202).json({ message: "notes posted", status: 202 });
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
    const assignment = await noteRepo.find({
      where: {
        subjectId: {
          id: parseInt(subjectId),
        },
      },
    });
    if (assignment) {
      res.status(200).json(assignment);
    } else {
      res.status(404).json({ message: "no assignment found" });
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = await getCurrentUser(authHeader || "");
    const notes = await noteRepo.find({
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
    console.log(notes);
    res.json(notes);
  } catch (err: any) {
    res.json(err.message);
  }
};
