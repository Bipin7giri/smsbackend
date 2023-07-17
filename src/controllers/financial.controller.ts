import { Request, Response, ErrorRequestHandler } from "express";
import { Financial } from "../entity/Financial";
import { AppDataSource } from "../PGDB/data-source";
import {
  AddFinancialDetails,
} from "../validationSchema/financialSchema";
import { User } from "../entity/User";
import { roles } from "../ENUMS/RoleEnum";
import { financialHistoryRepo, financialRepo, userRepo } from "../Repository";
export class FinancialController {
  constructor() {}

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
      return res.status(500).json({
        error: error.message,
      });
    }
  }
  public async getMe(req: any, res: Response): Promise<Response> {
    // Logic for handling GET requests
    try {
      const currentUser: any =req.user
      return res.json(
        await financialRepo.find({
          where: { studentId: { id: currentUser.id } },
          relations: { financialHistoryId: true },
        })
      );
    } catch (error: any) {
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
