import { Express, Request, Response } from "express";
import { AppDataSource } from "../DB/data-source";
import { Class } from "../entity/Classes";
import { Subjects } from "../entity/Subject";
import { SubjectAndClassShcema } from "../schema/subjectSchema";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await SubjectAndClassShcema.validateAsync(req.body);
   const repo = AppDataSource.getRepository(Subjects);
   const subjects = new Subjects();
   subjects.semesterId = validate.semesterId
   subjects.subject_name= validate.subjectName
   subjects.teacherId = validate.teacherId
   const saveSubject:any = await repo.save(subjects); 
   const classRepo = AppDataSource.getRepository(Class)
   for(let i =0; i<validate.studentId.length; i++){
    await classRepo.insert({
        semesterId:validate.semesterId,
        subjectId:saveSubject.id,
        studentId:validate.studentId[i],
    })
}
   res.status(202).json({ message:'class created'});
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
