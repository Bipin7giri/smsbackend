import * as dotenv from 'dotenv';
import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/User"
import{Role} from '../entity/Role'
import { Department } from '../entity/Department';
import { Semester } from '../entity/Semester';
dotenv.config();
console.log(process.env.DATABASE_URL)
export const AppDataSource = new DataSource({
    "type": "postgres",
    url:process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [Role, User,Department,Semester],
    migrations: [],
    subscribers: [],
})
