"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var dotenv = require("dotenv");
var scriptdb_1 = require("./src/scriptdb");
var api_1 = require("./src/api/api");
dotenv.config();
var bodyParser = require("body-parser");
var cloudinary = require("cloudinary");
cloudinary.config({
    cloud_name: "dr54a7gze",
    api_key: "868275163814591",
    api_secret: "U0-E-H34SF1Dl1vpyroUU361AUQ",
});
var app = express();
app.use(bodyParser.json());
var port = process.env.PORT;
app.use("/api", api_1.default);
(0, scriptdb_1.connectDb)();
app.get('/', function (req, res) {
    res.send('Express + TypeScript Server');
});
app.listen(port, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at http://localhost:".concat(port));
});
//# sourceMappingURL=index.js.map