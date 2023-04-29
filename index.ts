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
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT;
const project = process.env?.PROJECT;
app.use("/api", api);
io.on("connection", async (socket) => {
  console.log(`user connected: ${socket.id}`);

  let receiver = "";
  let sender = "";
  socket.on("join_room", ({ receiver, room, sender }) => {
    socket.join(room);
    receiver = receiver;
    sender = sender;
    JoinRoom(receiver, room, sender);

    console.log(
      `user with id : ${socket.id} wants to chat with ${receiver} joined room :${room}`
    );
  });
  const roomId: any = await RoomModel.find({
    $and: [{ sender: sender }, { receiver: receiver }],
  });

  io.emit("get_chat_id", roomId);
  socket.on("send_message", async (message) => {
    console.log(message.roomId);
    console.log(message.roomId + "is your room id");
    socket.to(message?.roomId).emit("receive_message", message);
    console.log(message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
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

app.get("/", (req: Request, res: Response) => {
  res.send("School management system");
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
