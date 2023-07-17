import { Express, Request, Response } from "express";
import { MAILDATA } from "../Interface/NodeMailerInterface";
import { transporter } from "../helper/nodeMailer";
import { DATA, NotificationResult } from "../Interface/SubjectInterface";
import { sendNotification } from "../Notification/PushNotification";
import { CreateNotes } from "../validationSchema/notesSchema";
import { uploadFile } from "../helper/imageupload";
import { classRepo, noteRepo, subjectRepo } from "../Repository";
export const create = async (req: any, res: Response): Promise<void> => {
  try {
    const validate = await CreateNotes.validateAsync(req.body);
    const currentUser: any =req.user
    const subjectId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser.id,
        },
      },
    });
    validate.subjectId = subjectId.id;
    if (req?.file) {
      const imageUrl = await uploadFile(req.file.path);
      validate.pdf = imageUrl;
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

export const getAllNotes = async (req: any, res: Response) => {
  try {
    const currentUser: any =req.user

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
    res.json(notes);
  } catch (err: any) {
    res.json(err.message);
  }
};
