import * as dotenv from 'dotenv';
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/User"
import{Role} from '../entity/Role'
import { Department } from '../entity/Department';
import { Semester } from '../entity/Semester';
import { Class } from '../entity/Classes';
import { Subjects } from '../entity/Subject';
dotenv.config();
console.log(process.env.DATABASE_URL)
export const AppDataSource = new DataSource({
    "type": "postgres",
    url:process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [Role, User,Department,Semester,Class,Subjects],
    migrations: [],
    subscribers: [],
})
