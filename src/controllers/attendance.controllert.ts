import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Subjects } from "../entity/Subject";
import { getCurrentUser } from "../helper/jwt";
import { Absent } from "../entity/Absent";
import { Present } from "../entity/Present";
import { Reports } from "../entity/Reports";
import { AttendanceSchema } from "../schema/attendanceSchema";
const absentRepo = AppDataSource.getRepository(Absent);
const presentRepo = AppDataSource.getRepository(Present);
const reportsRepo = AppDataSource.getRepository(Reports);
const subjectRepo = AppDataSource.getRepository(Subjects);
const manager = AppDataSource.manager;
export const create = async (req: any, res: Response): Promise<void> => {
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
    console.log(classId);
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
        totalAbsent: 1,
      });

      res.status(202).json({ result, status: 202 });
    }

    console.log(currentUser.id);
  } catch (err: any) {
    res.status(422).json(err.messagea);
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

    let startDate = "";
    const result = await manager.query(
      "SELECT * FROM reports WHERE date(created_at) BETWEEN $1 AND $2",
      ["2023-02-01", "2023-03-30"]
    );
    res.json(result);

    console.log(result);

    console.log(currentUser.id);
  } catch (err: any) {
    res.status(422).json(err);
  }
};
