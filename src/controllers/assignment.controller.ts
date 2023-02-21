import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Class } from "../entity/Classes";
import { Subjects } from "../entity/Subject";
import { getCurrentUser } from "../helper/jwt";
import {
  ClassPatchSchema,
  ClassSchema,
  JoinClassRoom,
} from "../schema/classSchema";
import { CreateAssignment, SubmitAssigment } from "../schema/assignmentSchema";
import { Assignment } from "../entity/Assignment";
import { uploadFile, } from "../helper/imageupload";
import { AssignmentSubmission } from "../entity/AssignmentSubmission";
import { MAILDATA } from "../Interface/NodeMailerInterface";
import { transporter } from "../helper/nodeMailer";
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
    const currentUser: any = getCurrentUser(authHeader || "");
    const subjectId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser.id,
        },
      },
    });

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
     console.log(getAllStudent)
    const studentEmail  = getAllStudent.map((item:any,id:any)=>{
      return item.studentId.email
    })
    console.log((studentEmail))
  // if(studentEmail.length>0){
    const mailData: MAILDATA = {
        from: "giribipin04@gmail.com", // sender address
        to: studentEmail, // list of receivers
        subject: "Assignment alert",
        text: "Assignment!!!",
        html: `<br>Please check your assignment details of ${subjectId.name}</br>`,
      };
    console.log(mailData)
    await  transporter.sendMail(mailData, function (err: any, info: any) {
        if (err) console.log(err);
        else console.log("ok");
      });
  // }
    res.status(202).json({ message: "created assignment", status: 202 });
  } catch (err: any) {
    res.status(422).json(err);
  }
};

// export const addStudent = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const validate = await ClassPatchSchema.validateAsync(req.body);
//     const repo = AppDataSource.getRepository(Class);
//     const subjectRepo = AppDataSource.getRepository(Subjects);

//     let authHeader = req.headers["authorization"];
//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       // Remove "Bearer " from the authHeader
//       authHeader = authHeader.slice(7, authHeader.length);
//     }
//     const currentUser: any = getCurrentUser(authHeader || "");
//     console.log(currentUser);
//     const subjects: any = await subjectRepo.findOne({
//       where: {
//         teacherId: {
//           id: currentUser.id,
//         },
//       },
//       relations: ["semesterId"],
//     });
//     console.log(subjects);

//     if (validate.studentId) {
//       for (let i = 0; i < validate.studentId.length; i++) {
//         await repo.insert({
//           semesterId: subjects?.semesterId?.id,
//           subjectId: subjects?.id,
//           studentId: validate.studentId[i],
//         });
//       }
//     } else {
//       await repo.insert({
//         semesterId: validate.semesterId,
//         subjectId: validate.subjectId,
//       });
//     }

//     res.status(202).json({ message: "created semester" });
//   } catch (err: any) {
//     res.status(422).json(err);
//   }
// };

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






// export const removeStudent = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     let authHeader = req.headers["authorization"];
//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       // Remove "Bearer " from the authHeader
//       authHeader = authHeader.slice(7, authHeader.length);
//     }
//     const currentUser: any = getCurrentUser(authHeader || "");
//     const repo = AppDataSource.getRepository(Subjects);
//     const subject = await repo.find({
//       where: {
//         teacherId: {
//           id: currentUser.id,
//         },
//       },
//       relations: ["classId", "classId.studentId"],
//     });
//     console.table(subject);
//     // user?.password = null;
//     if (subject) {
//       res.json(subject);
//     } else {
//       res.status(404).send("No subject found");
//     }
//   } catch (err: any) {
//     res.status(404).send({ error: true, message: err.message });
//   }
// };

// export const joinClassRoom = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const validate = await JoinClassRoom.validateAsync(req.body);
//     const repo = AppDataSource.getRepository(Class);
//     const subjectRepo = AppDataSource.getRepository(Subjects);

//     let authHeader = req.headers["authorization"];
//     if (authHeader && authHeader.startsWith("Bearer ")) {
//       // Remove "Bearer " from the authHeader
//       authHeader = authHeader.slice(7, authHeader.length);
//     }
//     const currentUser: any = getCurrentUser(authHeader || "");
//     console.log(currentUser);
//     const subjects: any = await subjectRepo.findOne({
//       where: {
//         classCode: validate.classCode,
//       },
//       relations: ["semesterId"],
//     });
//     console.log(subjects);

//     await repo
//       .insert({
//         subjectId: subjects.id,
//         semesterId: subjects.semesterId.id,
//         studentId: currentUser.id,
//       })
//       .then(() => {
//         res.status(202).json({ message: "class room joined" });
//       });
//   } catch (err: any) {
//     res.status(422).json(err);
//   }
// };
