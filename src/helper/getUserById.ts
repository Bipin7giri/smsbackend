import { AppDataSource } from "../PGDB/data-source";
import {User} from "../entity/User";
const repo = AppDataSource.getRepository(User);
export const getUserById = async (id:number)=>{
    return await repo.findOne({
        where:{
            id:id
        }
    })
}