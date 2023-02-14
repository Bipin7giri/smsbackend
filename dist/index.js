"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
var scriptdb_1 = require("./src/scriptdb");
var api_1 = require("./src/api/api");
dotenv.config();
var bodyParser = require("body-parser");
var cloudinary = require("cloudinary");
// const ri = require('./src/routers')
cloudinary.config({
    cloud_name: "dr54a7gze",
    api_key: "868275163814591",
    api_secret: "U0-E-H34SF1Dl1vpyroUU361AUQ",
});
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var app = express();
app.use(bodyParser.json());
var port = process.env.PORT;
var project = (_a = process.env) === null || _a === void 0 ? void 0 : _a.PROJECT;
app.use("/api", api_1.default);
(0, scriptdb_1.connectDb)();
// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "LogRocket Express API with Swagger",
//       version: "0.1.0",
//       description:
//         "This is a simple CRUD API application made with Express and documented with Swagger",
//     },
//     servers: [
//       {
//         url: "http://localhost:" + port,
//       },
//     ],
//   },
//   securityDefinitions: {
//     AuthToken: {
//       type: "apiKey",
//       name: "auth-token",
//       in: "header",
//       description: "The token for authentication",
//     },
//   },
//   security: [
//     {
//       AuthToken: [],
//     },
//   ],
//   apis: ["./src/routers/*.ts"],
// };
var swaggerDefinition = {
    info: {
        title: "School Management System",
        version: "1.0.0",
        description: "Endpoints to test the user registration routes",
    },
    schemes: ["https"],
    host: project === "DEV" ? "localhost:5000" : "sms-twox.onrender.com",
    basePath: "/api",
    securityDefinitions: {
        bearerAuth: {
            type: "apiKey",
            name: "authorization",
            scheme: "bearer",
            in: "header",
        },
    },
    security: [{ bearerAuth: [] }],
};
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ["./src/routers/*.ts"],
};
var specs = swaggerJsdoc(options);
app.use("/", swaggerUi.serve, swaggerUi.setup(specs));
// app.get("/", (req: Request, res: Response) => {
//   res.send("School management system");
// });
app.listen(port, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at http://localhost:".concat(port));
});
//# sourceMappingURL=index.js.map