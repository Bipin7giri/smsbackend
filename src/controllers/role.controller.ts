import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Role } from "../entity/Role";
import { getCurrentUser } from "../helper/jwt";
import { RoleSchema } from "../validationSchema/roleSchema";
import { repo } from "../Repository";
type CurrentUser = {
  id: number;
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await RoleSchema.validateAsync(req.body);
    const role = new Role();
    const repo = AppDataSource.getRepository(Role);
    role.name = validate.name;
    role.roles = validate.roles;
    const saveRole = await repo.save(role);
    if (saveRole) {
      res.status(202).json({ saveRole });
    }
  } catch (err: any) {
    res.status(422).json(err);
  }
};
export const remove = async (req:Request,res:Response) : Promise<void>=>{
  try {
    const {roleId}  =req.params;
    await repo.update(+roleId,{
      deleted:true,
      deletedAt: new Date(),
    })
  }catch (err:any){
    res.json(err.message)
  }
}


export const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const repo = AppDataSource.getRepository(Role);
    const allRole = await repo.find();
    if (allRole) {
      res.status(202).json({ allRole });
    }
  } catch (err: any) {
    res.status(422).json(err);
  }
};
