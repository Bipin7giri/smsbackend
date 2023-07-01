import { Request, Response, ErrorRequestHandler } from "express";
import { Financial } from "../entity/Financial";
import { AppDataSource } from "../PGDB/data-source";
import { Repository } from "typeorm";
import {
  AddFinancialDetails,
  FinancialSchema,
} from "../schema/financialSchema";
import Joi = require("joi");
import { getCurrentUser } from "../helper/jwt";
import * as xlsx from "xlsx";
import { User } from "../entity/User";
import { Role } from "../entity/Role";
import { roles } from "../ENUMS/RoleEnum";
import { FinancialHistory } from "../entity/FinancialHistory";
const financialRepo = AppDataSource.getRepository(Financial);
const financialHistoryRepo = AppDataSource.getRepository(FinancialHistory);

const userRepo: Repository<User> = AppDataSource.getRepository(User);
export class FinancialController {
  private finacialValidation: any;
  private addFinancialDetailsValidation: any;
  private getCurrentUser: any;
  constructor() {
    try {
      // this.financialRepo = AppDataSource.getRepository(Financial);
    } catch (error) {
      console.error("Error initializing financial repository:", error);
    }
    this.finacialValidation = FinancialSchema;
    this.addFinancialDetailsValidation = AddFinancialDetails;
  }

  // GET method
  public async get(req: Request, res: Response): Promise<Response> {
    // Logic for handling GET requests
    try {
      return res.json(
        await financialRepo.find({
          where: { deleted: false },
          relations: { studentId: true, financialHistoryId: true },
        })
      );
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        error: error.message,
      });
    }
  }
  public async getMe(req: Request, res: Response): Promise<Response> {
    // Logic for handling GET requests
    try {
      let authHeader = req.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        // Remove "Bearer " from the authHeader
        authHeader = authHeader.slice(7, authHeader.length);
      }
      const currentUser: any = getCurrentUser(authHeader || "");

      return res.json(
        await financialRepo.find({
          where: { studentId: { id: currentUser.id } },
          relations: { financialHistoryId: true },
        })
      );
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        error: error.message,
      });
    }
  }

  // POST method
  public async post(req: Request, res: Response): Promise<void> {
    try {
      // ...
      const validate = await AddFinancialDetails.validateAsync(req.body);
      console.log(validate);

      const financial: any = await financialRepo.findOne({
        where: {
          studentId: {
            id: validate.studentId,
          },
        },
      });

      if (financial) {
        validate.totalAmount = financial.totalAmount - validate.paidAmount;
        const financialId: any = await financialRepo.findOne({
          where: {
            studentId: { id: validate.studentId },
          },
        });

        await financialRepo
          .update(
            {
              studentId: {
                id: validate.studentId,
              },
            },
            {
              totalAmount: validate.totalAmount,
            }
          )
          .then(async () => {
            await financialHistoryRepo.save({
              ...validate,
              financialId: financialId.id,
            });
          });
        res.json();
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        error: error.message,
      });
    }
  }

  // DELETE method
  public async delete(req: Request, res: Response): Promise<any> {
    try {
      res.json(
        await financialRepo.update({ id: +req.params.id }, { deleted: true })
      );
    } catch (error: any) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  public async addBulkFincnailDetails(req: any, res: Response): Promise<void> {
    try {
      const studentData: User[] = await userRepo.find({
        where: {
          roleId: { name: roles.STUDENT },
        },
      });
      let financialData: any = [];
      studentData.map((item: any, id: number) => {
        financialData.push({
          ["studentId"]: item.id,
          ["totalAmount"]: 700000,
          ["clearAmount"]: 0,
        });
      });
      const output = await AppDataSource.createQueryBuilder()
        .insert()
        .into(Financial)
        .values(financialData)
        .execute();
      res.json(output);
    } catch (err: any) {
      res.json(err.message);
    }
  }
}
