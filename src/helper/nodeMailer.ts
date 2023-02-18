let nodemailer = require("nodemailer");
import * as dotenv from "dotenv";
import { MAIL } from "../Interface/NodeMailerInterface";

dotenv.config();

export const transporter: MAIL = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "giribipin04@gmail.com",
    pass: process.env?.GMAILPASSWORD,
  },
});
