import { Express, Request, Response } from "express";
import { AppDataSource } from "../DB/data-source";
import { Class } from "../entity/Classes";
import { Department } from "../entity/Department";
import { Semester } from "../entity/Semester";
import { getCurrentUser } from "../helper/jwt";
import { ClassSchema } from "../schema/classSchema";
import { SemesterSchema } from "../schema/semesterSchema";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await ClassSchema.validateAsync(req.body);
    // const semester = new Semester();
    const repo = AppDataSource.getRepository(Class);
    for(let i =0; i<validate.studentId.length; i++){
        await repo.insert({
            semesterId:validate.semesterId,
            subjectId:validate.subjectId,
            studentId:validate.studentId[i],
        })
    }
      res.status(202).json({ message:'created semester' });
  } catch (err: any) {
    res.status(422).json(err);

  }
};

// export const get = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const token:string = req?.headers["authorization"]?.split(" ")[1]||"";
//     const currentUser:any = getCurrentUser(token || "");
//     const repo = AppDataSource.getRepository(Department);
//     const department  = await repo.find({

//       relations: ['semesterId','semesterId.studentId'],
//       where: {
//           hod: {
//               id:currentUser.id
//           },
//       },

//   });
//     // user?.password = null;
//     if (department) {
//       res.json(department);
//     } else {
//       res.status(404).send("No department found");
//     }
//   } catch (err:any) {
//     res.status(404).send({ error: true, message: err.message });;
//   }
// };
