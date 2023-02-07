import { Express, Request, Response } from "express";
import { AppDataSource } from "../DB/data-source";
import { Class } from "../entity/Classes";
import { Department } from "../entity/Department";
import { Role } from "../entity/Role";
import { Semester } from "../entity/Semester";
import { Subjects } from "../entity/Subject";
import { User } from "../entity/User";
import { generateHashPassword } from "../helper/hashpassword";
import { getCurrentUser } from "../helper/jwt";
import { AddTeacherSchema, RegisterSchema } from "../schema/registerSchema";
import { SemesterSchema } from "../schema/semesterSchema";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await SemesterSchema.validateAsync(req.body);
    // const semester = new Semester();
    const repo = AppDataSource.getRepository(Semester);
    // for(let i =0; i<validate.studentId.length; i++){
        await repo.insert({
            name:validate.name,
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


export const addTeacher = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.params)
    const validate = await AddTeacherSchema.validateAsync(req.body);
    const {semester} = req.params
    const semesterId:number = parseInt(semester)

    const semesterRepo = AppDataSource.getRepository(Semester);
    const semesters:any = await semesterRepo.findOne({
      where: {
        id:semesterId
      },
    });
   
      const repo = AppDataSource.getRepository(Role)
      const roles:any = await repo.findOne({where:{
        id:3
      }});
      console.log(roles.id)
         const hashedPassword: any = await generateHashPassword(
        validate?.password
      );
      const user = new User();
      user.email = validate.name+semesters?.name+'@kathford.com';
      user.password = hashedPassword
      user.roleId = roles
      const userRepo = AppDataSource.getRepository(User);
      const saveUser:any = await userRepo.save(user);
      console.log(saveUser)

      const subjects = new Subjects();
      subjects.semesterId = semesters.id;
      subjects.subject_name = validate.subjectName;
      subjects.teacherId = saveUser.id;
      const subjectRepo = AppDataSource.getRepository(Subjects);

      const saveSubject: any = await subjectRepo.save(subjects);
  
      if(saveUser){
        res.status(202).send({ message: "successfully registred",
        saveSubject
      });
      }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};