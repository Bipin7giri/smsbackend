import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";

// stats for admin
export const studentAccDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await AppDataSource.query(
      "SELECT d.name,COUNT(*) FROM public.user INNER JOIN department as d ON public.user.department_id=d.id GROUP BY d.name"
    );
    res.json(users);
  } catch (err: any) {
    res.json(err.message);
  }
};
