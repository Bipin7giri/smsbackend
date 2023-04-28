import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Subjects } from "../entity/Subject";
import { getCurrentUser } from "../helper/jwt";
import { Absent } from "../entity/Absent";
import { Present } from "../entity/Present";
import { Reports } from "../entity/Reports";
import { AttedanceByDate, AttendanceSchema } from "../schema/attendanceSchema";
import { Class } from "../entity/Classes";
import { EntityManager, Repository } from "typeorm";
const absentRepo: Repository<Absent> = AppDataSource.getRepository(Absent);
const presentRepo: Repository<Present> = AppDataSource.getRepository(Present);
const reportsRepo: Repository<Reports> = AppDataSource.getRepository(Reports);
const subjectRepo: Repository<Subjects> = AppDataSource.getRepository(Subjects);
const classRepo: Repository<Class> = AppDataSource.getRepository(Class);
const manager: EntityManager = AppDataSource.manager;
export const create = async (req: any, res: Response): Promise<any> => {
  try {
    const validate = await AttendanceSchema.validateAsync(req.body);
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = await getCurrentUser(authHeader || "");
    console.log(currentUser);
    const classId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser.id,
        },
      },
      relations: ["semesterId"],
    });
    const today: Date = new Date();
    const year: number = today.getFullYear();
    const month: string = String(today.getMonth() + 1).padStart(2, "0");
    const day: string = String(today.getDate()).padStart(2, "0");
    const formattedDate: any = `${year}-${month}-${day}`;
    console.log(formattedDate); // outputs "2023-04-21"
    const totalNumberOfStudent = await classRepo.find({
      where: {
        subjectId: {
          id: classId.id,
        },
      },
    });
    const result = await manager.query(
      `SELECT * FROM reports WHERE date(created_at) = '${formattedDate}'`
    );
    console.log(totalNumberOfStudent.length);
    console.log(result.length);
    if (totalNumberOfStudent.length <= result.length) {
      return res.json({ message: "Already Attedndace added" });
    }
    if (validate.isPresent === true) {
      const result: any = await presentRepo.save({
        studentId: validate.studentId,
        subjectId: classId?.id,
      });
      await reportsRepo.save({
        semesterId: classId.semesterId.id,
        presentId: result.id,
        subjectId: classId.id,
        studentId: validate.studentId,
      });
      res.status(202).json({ result, status: 202 });
    } else {
      const result: any = await absentRepo.save({
        studentId: validate.studentId,
        subjectId: classId?.id,
      });
      await reportsRepo.save({
        semesterId: classId.semesterId.id,
        absentId: result.id,
        subjectId: classId.id,
        studentId: validate.studentId,
        // totalAbsent: 1,
      });
      res.status(202).json({ result, status: 202 });
    }
    console.log(currentUser.id);
  } catch (err: any) {
    res.status(422).json(err.message);
  }
};

export const getAttendanceReportByStudentId = async (
  req: Request,
  res: Response
) => {
  try {
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
          id: currentUser.id,
        },
      },
    });

    const getAttendanceReports: Reports[] = await reportsRepo.find({
      where: {
        studentId: {
          id: studentId,
        },
        subjectId: { id: subjectId?.id },
      },
      relations: {
        absentId: true,
        presentId: true,
      },
    });
    const totalDays: number = Object.keys(getAttendanceReports).length;
    let countPresentDays: number = 0;
    let countAbsentDays: number = 0;
    for (let i = 0; i < getAttendanceReports.length; i++) {
      if (getAttendanceReports[i].presentId) {
        countPresentDays = countPresentDays + 1;
      } else {
        countAbsentDays = countAbsentDays + 1;
      }
    }
    const presentPercentage: number = (countPresentDays / totalDays) * 100;
    const absentPercentage: number = 100 - presentPercentage;
    res.json({
      present: presentPercentage.toFixed(),
      absent: absentPercentage.toFixed(),
    });
  } catch (err) {
    throw err;
  }
};

export const get = async (req: any, res: Response): Promise<void> => {
  try {
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
    const result = await manager.query(
      `SELECT sms.public.user.email, reports.present_id, reports.absent_id,reports.created_at 
FROM reports
INNER JOIN sms.public.user ON sms.public.user.id = reports.student_id
WHERE subject_id = ${subjectId.id} ORDER BY reports.created_at DESC`
    );

    const emailData: any = {};

    result.forEach((entry: { email: any }) => {
      const email = entry.email;
      if (!emailData[email]) {
        emailData[email] = [];
      }
      emailData[email].push(entry);
    });

    res.json(emailData);
  } catch (err: any) {
    res.status(422).json(err);
  }
};

export const getByDate = async (req: any, res: Response): Promise<void> => {
  try {
    const validate = await AttedanceByDate.validateAsync(req.body);
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const date = req.params.date;
    const currentUser: any = await getCurrentUser(authHeader || "");

    const subjectId: any = await subjectRepo.findOne({
      where: {
        teacherId: {
          id: currentUser.id,
        },
      },
    });
    console.log(date);

    // const result = await
    // const resul
    let startDate: string = "Wed Apr 26 2023 00:00:00 GMT+0545 (Nepal Time)";

    const formattedStartDate: any = new Date(validate.date)
      .toISOString()
      .substr(0, 10);

    console.log(formattedStartDate);

    const result = await manager.query(
      `SELECT sms.public.user.email, reports.present_id, reports.absent_id,reports.created_at 
FROM reports
INNER JOIN sms.public.user ON sms.public.user.id = reports.student_id
WHERE DATE(reports.created_at) = '${formattedStartDate}' AND subject_id = ${subjectId.id}`
    );
    res.json(result);
  } catch (err: any) {
    res.status(422).json(err);
  }
};
