import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response, Express } from "express";
import { connectDb } from "./src/scriptdb";
import api from "./src/api/api";
import { connectMongoDB } from "./src/MongoDB/connection";
import * as cors from "cors";
dotenv.config();
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");
// const ri = require('./src/routers')
cloudinary.config({
  cloud_name: "dr54a7gze",
  api_key: "868275163814591",
  api_secret: "U0-E-H34SF1Dl1vpyroUU361AUQ",
});

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app: Express = express();
app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT;
const project = process.env?.PROJECT;
app.use("/api", api);
connectDb();

// connect mongodb

connectMongoDB();

const swaggerDefinition = {
  info: {
    title: "School Management System CICD madherchut",
    version: "1.0.0",
    description: "Endpoints to test the user registration routes",
  },
  schemes: project === "DEV" ? ["http"] : ["https"],
  host: project === "DEV" ? "localhost:5000" : "sms-twox.onrender.com",
  components: {
    schemas: {},
  },
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

const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ["./src/routers/*.ts"],
};

const specs = swaggerJsdoc(options);
app.use("/", swaggerUi.serve, swaggerUi.setup(specs));

// app.get("/", (req: Request, res: Response) => {
//   res.send("School management system");
// });

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
