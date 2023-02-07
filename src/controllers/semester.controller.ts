import { Express, Request, Response } from "express";
import { AppDataSource } from "../DB/data-source";
import { Department } from "../entity/Department";
import { Semester } from "../entity/Semester";
import { getCurrentUser } from "../helper/jwt";
import { SemesterSchema } from "../schema/semesterSchema";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await SemesterSchema.validateAsync(req.body);
    // const semester = new Semester();
    const repo = AppDataSource.getRepository(Semester);
    // for(let i =0; i<validate.studentId.length; i++){
        await repo.insert({
            name:validate.name,
            // studentId:validate.studentId[i],
            departmentId:validate.departmentId
        })
    // }
      res.status(202).json({ message:'created semester' });
  } catch (err: any) {
    res.status(422).json(err);

  }
};

export const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const token:string = req?.headers["authorization"]?.split(" ")[1]||"";
    const currentUser:any = getCurrentUser(token || "");
    const repo = AppDataSource.getRepository(Department);
    const semester  = await repo.find({
      relations: ['semesterId','hod','semesterId.subjects.classId.studentId','semesterId.subjects.classId.studentId'],
      where: {
          hod: {
              id:currentUser.id
          },
      },
  });
    // user?.password = null;
    console.table(semester)
    if (semester) {
      res.json(semester);
    } else {
      res.status(404).send("No semester found");
    }
  } catch (err:any) {
    res.status(404).send({ error: true, message: err.message });;
  }
};
