import * as express from 'express';
import * as dotenv from 'dotenv';
import { Request,Response,Express } from 'express';
import { connectDb } from './src/scriptdb';
import api from "./src/api/api";
dotenv.config();
const bodyParser = require("body-parser");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: "dr54a7gze",
  api_key: "868275163814591",
  api_secret: "U0-E-H34SF1Dl1vpyroUU361AUQ",
});
const app: Express = express();
app.use(bodyParser.json());
const port = process.env.PORT;
app.use("/api", api);
connectDb()
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
