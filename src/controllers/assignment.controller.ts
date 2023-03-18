import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Class } from "../entity/Classes";
import { Subjects } from "../entity/Subject";
import { getCurrentUser } from "../helper/jwt";
import { CreateAssignment, SubmitAssigment } from "../schema/assignmentSchema";
import { Assignment } from "../entity/Assignment";
import { uploadFile, } from "../helper/imageupload";
import { AssignmentSubmission } from "../entity/AssignmentSubmission";
import { MAILDATA } from "../Interface/NodeMailerInterface";
import { transporter } from "../helper/nodeMailer";
import { DATA, NotificationResult } from "../Interface/SubjectInterface";
import { sendNotification } from "../Notification/PushNotification";
const assigmnmentRepo = AppDataSource.getRepository(Assignment);
const subjectRepo = AppDataSource.getRepository(Subjects);
const assigmnmentSubmitRepo = AppDataSource.getRepository(AssignmentSubmission)
const classRepo = AppDataSource.getRepository(Class)

export const create = async (req: any, res: Response): Promise<void> => {
  try {
    const validate = await CreateAssignment.validateAsync(req.body);
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = await getCurrentUser(authHeader || "");
    console.log(currentUser.id)
    const subjectId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser.id,
        },
      },
    });
    console.log(subjectId)
    validate.subjectId = subjectId.id;

    if (req?.file) {
      const imageUrl =  await  uploadFile(req.file.path);
    validate.pdf = imageUrl
    }

  const result =   await assigmnmentRepo.insert(validate);

  const getAllStudent:any  = await classRepo.find({
    relations:["studentId"],
    where:{
        studentId:subjectId.id
    }
  })
    //  console.log(getAllStudent)
    const studentEmail  = getAllStudent.map((item:any,id:any)=>{
      return item.studentId.email
    })
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
    await  transporter.sendMail(mailData, function (err: any, info: any) {
        if (err) console.log(err);
        else console.log("ok");
      });
      const deviceIDs  = getAllStudent.map((item:any,id:any)=>{
        return item.studentId.deviceId
      })

      const deviceID: String[] = deviceIDs
      let data: DATA = {
        to: deviceID,
        sound: "default",
        title: 'Assignment Alert!!!',
        body: 'please check your App for '+subjectId.subject_name,
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
     const {subjectId} = req.params;    
    const assigmnment = await assigmnmentRepo.find({
        where:{
            subjectId:{
                id:parseInt(subjectId)
            }
        }
    })
    if(assigmnment){
        res.status(200).json(assigmnment)
    }
    else{
        res.status(404).json({message:"no assignmetn found"})
    }
     
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};


export const submitAssigment = async (req: any, res: Response): Promise<void> => {
    try {
      const validate = await SubmitAssigment.validateAsync(req.body);
      let authHeader = req.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        // Remove "Bearer " from the authHeader
        authHeader = authHeader.slice(7, authHeader.length);
      }
      const currentUser: any = getCurrentUser(authHeader || "");
      validate.studentId  = currentUser.id
        
      if (req?.file) {
        console.log(req.file)
        const imageUrl =  await  uploadFile(req.file.path);
      validate.submission = imageUrl
      }
  
      await assigmnmentSubmitRepo.insert(validate);
  
      res.status(202).json({ message: "created assignment", status: 202 });
    } catch (err: any) {
      res.status(422).json(err);
    }
  };

