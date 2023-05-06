import * as express from "express";
import * as dotenv from "dotenv";
import { Request, Response, Express } from "express";
import { connectDb } from "./src/scriptdb";
import api from "./src/api/api";
import { connectMongoDB } from "./src/MongoDB/connection";
import * as cors from "cors";
import * as http from "http";
import { Server } from "socket.io";
import { JoinRoom, StartChart } from "./src/controllers/chat/chat.controller";
import RoomModel from "./src/MongoDB/Schema/Room";
var logger = require("morgan");
dotenv.config();
connectDb();

// connect mongodb

connectMongoDB();
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
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT;
const project = process.env?.PROJECT;
app.use("/api", api);
let users: any = [];

io.on("connection", (socket: any) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("message", (data: any) => {
    console.log(`⚡: ${data} message`);
    io.emit("messageResponse", data);
  });

  socket.on("typing", (data: any) =>
    socket.broadcast.emit("typingResponse", data)
  );

  socket.on("newUser", (data: any) => {
    users.push(data);
    io.emit("newUserResponse", users);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    users = users.filter((user: any) => user.socketID !== socket.id);
    io.emit("newUserResponse", users);
    socket.disconnect();
  });
});
const swaggerDefinition = {
  info: {
    title: "School Management System",
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

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
