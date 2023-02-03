"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
var dotenv = require("dotenv");
require("reflect-metadata");
var typeorm_1 = require("typeorm");
var User_1 = require("../entity/User");
var Role_1 = require("../entity/Role");
dotenv.config();
console.log(process.env.DATABASE_URL);
exports.AppDataSource = new typeorm_1.DataSource({
    "type": "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [Role_1.Role, User_1.User],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map