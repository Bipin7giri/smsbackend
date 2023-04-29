"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var chat_controller_1 = require("./src/controllers/chat/chat.controller");
var Room_1 = require("./src/MongoDB/Schema/Room");
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
app.use(bodyParser.json());
app.use(cors());
var server = http.createServer(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
var port = process.env.PORT;
var project = (_a = process.env) === null || _a === void 0 ? void 0 : _a.PROJECT;
app.use("/api", api_1.default);
io.on("connection", function (socket) { return __awaiter(void 0, void 0, void 0, function () {
    var receiver, sender, roomId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("user connected: ".concat(socket.id));
                receiver = "";
                sender = "";
                socket.on("join_room", function (_a) {
                    var receiver = _a.receiver, room = _a.room, sender = _a.sender;
                    socket.join(room);
                    receiver = receiver;
                    sender = sender;
                    (0, chat_controller_1.JoinRoom)(receiver, room, sender);
                    console.log("user with id : ".concat(socket.id, " wants to chat with ").concat(receiver, " joined room :").concat(room));
                });
                return [4 /*yield*/, Room_1.default.find({
                        $and: [{ sender: sender }, { receiver: receiver }],
                    })];
            case 1:
                roomId = _a.sent();
                io.emit("get_chat_id", roomId);
                socket.on("send_message", function (message) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        console.log(message.roomId);
                        console.log(message.roomId + "is your room id");
                        socket.to(message === null || message === void 0 ? void 0 : message.roomId).emit("receive_message", message);
                        console.log(message);
                        return [2 /*return*/];
                    });
                }); });
                socket.on("disconnect", function () {
                    console.log("user disconnected", socket.id);
                });
                return [2 /*return*/];
        }
    });
}); });
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
app.get("/", function (req, res) {
    res.send("School management system");
});
server.listen(port, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at http://localhost:".concat(port));
});
//# sourceMappingURL=index.js.map