import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { Role } from "../entity/Role";
import { getCurrentUser } from "../helper/jwt";
import { RoleSchema } from "../schema/roleSchema";

type CurrentUser = {
  id: number;
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const token: string = req?.headers["authorization"]?.split(" ")[1] || "";
    const currentUser: CurrentUser = getCurrentUser(token || "");
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
    throw err;
  }
};
