import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Role } from "../entity/Role";
import { Semester } from "../entity/Semester";
import { Subjects } from "../entity/Subject";
import { User } from "../entity/User";
import { generateHashPassword } from "../helper/hashpassword";
import { getCurrentUser } from "../helper/jwt";
import { AddTeacherSchema, RegisterSchema } from "../validationSchema/registerSchema";
import {SemesterPatchSchema, SemesterSchema} from "../validationSchema/semesterSchema";
import * as xlsx from "xlsx";
import {Department} from "../entity/Department";
import {getUserById} from "../helper/getUserById";
import { semseterRepo, userRepo } from "../Repository";
export const create = async (req: any, res: Response): Promise<void> => {
  try {
    const validate = await SemesterSchema.validateAsync(req.body);
    const currentUser: any =req?.user
    const repo = AppDataSource.getRepository(Semester);
    const deaprtmentRepo = AppDataSource.getRepository(Department);

    const departmentId:any = await  deaprtmentRepo.findOne({
      where:{
        hod:{
          id:currentUser.id
        }
      }
    })
   const semester =  await repo.save({
      name: validate.name,
      departmentId: departmentId.id,
    });
    res.status(202).send(semester);
  } catch (err: any) {
    res.status(422).json(err);
  }
};

export const get = async (req: any, res: Response): Promise<void> => {
  try {
    const currentUser: any =req.user
    const repo = AppDataSource.getRepository(Semester);
    const semester = await repo.find({
      relations: ["subjects", "subjects.teacherId"],
      where: {
        departmentId: {
          hod: {
            id: currentUser.id,
          },
        },
        deleted:false
      },
    });
    // user?.password = null;
    console.table(semester);
    if (semester) {
      res.json(semester);
    } else {
      res.status(404).send("No semester found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const getSemesterStudent = async (req: any, res: Response): Promise<void> => {
  try {
    const currentUser: any =req.user

    const repo = AppDataSource.getRepository(Semester);
    const semester = await repo.find({
      relations: [ "departmentId", "subjects", "subjects.teacherId"],
      where: {
        classes: {
          studentId: {
            id: currentUser.id,
          },
        },
      },
    });
    // user?.password = null;
    console.table(semester);
    if (semester) {
      res.json(semester);
    } else {
      res.status(404).send("No semester found");
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};


export const addTeacher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validate = await AddTeacherSchema.validateAsync(req.body);
    const { semester } = req.params;
    const semesterId: number = parseInt(semester);

    const semesterRepo = AppDataSource.getRepository(Semester);
    const semesters: any = await semesterRepo.findOne({
      where: {
        id: semesterId,
      },
    });

    const repo = AppDataSource.getRepository(Role);
    const roles: any = await repo.findOne({
      where: {
        id: 3,
      },
    });
    const hashedPassword: any = await generateHashPassword(validate?.password);
    const user = new User();
    user.email = validate.name + semesters?.name + "@kathford.com";
    user.password = hashedPassword;
    user.roleId = roles;
    const userRepo = AppDataSource.getRepository(User);
    const saveUser: any = await userRepo.save(user);
    const subjects = new Subjects();
    subjects.semesterId = semesters.id;
    subjects.subject_name = validate.subjectName;
    subjects.teacherId = saveUser.id;
    const subjectRepo = AppDataSource.getRepository(Subjects);

    const saveSubject: any = await subjectRepo.save(subjects);

    if (saveUser) {
      res.status(202).send({ message: "successfully registered", saveSubject });
    }
  } catch (err: any) {
    res.status(404).send({ error: true, message: err.message });
  }
};

export const addBulkStudent = async (
  req: any,
  res: Response
): Promise<void> => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any = xlsx.utils.sheet_to_json(worksheet);

    for (let index = 0; index < data.length; index++) {
      data[index].password = await generateHashPassword(
        data[index].password.toString()
      );
    }





    const output = await AppDataSource.createQueryBuilder()
      .insert()
      .into(User)
      .values(data)
      .execute();
    res.json(output);
  } catch (err: any) {
    res.json(err.message);
  }
};

export const updateSemester = async (req:Request,res:Response): Promise<void> =>{
  try{
    const validate = await SemesterPatchSchema.validateAsync(req.body);
    const id:any = req?.params?.id;
    const updateSemester = await semseterRepo.update(id,{
      name:validate.name
    })
    console.table(updateSemester)
    res.json({message:"Updated Semester"})
  }catch (err:any){
   res.send(err.message)
  }
}

export const removeSemester = async (req:any,res:Response): Promise<void> =>{
  try{
    const id:any = req.params.id;
    const currentUser: any =req.user

    // res.send(currentUser)
const userDetails =  await userRepo.findOne({
  where:{
    id:currentUser.id
  }
})
  const result =   await semseterRepo.update(id,{
      deleted:true,
      deletedAt:new Date(),
      deletedBy:userDetails?.email
    })
    res.json({
      result,
      message:"Successfully Removed"
    })
  }
  catch (err:any){
throw err
  }
}