"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
var scriptdb_1 = require("./src/scriptdb");
var api_1 = require("./src/api/api");
var connection_1 = require("./src/MongoDB/connection");
var cors = require("cors");
var http = require("http");
var socket_io_1 = require("socket.io");
var logger = require("morgan");
dotenv.config();
(0, scriptdb_1.connectDb)();
// connect mongodb
(0, connection_1.connectMongoDB)();
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
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(cors());
var server = http.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
var port = process.env.PORT;
var project = (_a = process.env) === null || _a === void 0 ? void 0 : _a.PROJECT;
app.use("/api", api_1.default);
var users = [];
io.on("connection", function (socket) {
    console.log("\u26A1: ".concat(socket.id, " user just connected!"));
    socket.on("message", function (data) {
        console.log("\u26A1: ".concat(data, " message"));
        io.emit("messageResponse", data);
    });
    socket.on("typing", function (data) {
        return socket.broadcast.emit("typingResponse", data);
    });
    socket.on("newUser", function (data) {
        users.push(data);
        io.emit("newUserResponse", users);
    });
    socket.on("disconnect", function () {
        console.log("🔥: A user disconnected");
        users = users.filter(function (user) { return user.socketID !== socket.id; });
        io.emit("newUserResponse", users);
        socket.disconnect();
    });
});
var swaggerDefinition = {
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
server.listen(port, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at http://localhost:".concat(port));
});
//# sourceMappingURL=index.js.map