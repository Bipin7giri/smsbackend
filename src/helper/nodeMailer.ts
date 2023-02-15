let nodemailer = require("nodemailer");
import * as dotenv from "dotenv";

dotenv.config();
export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "giribipin04@gmail.com",
    pass: process.env?.GMAILPASSWORD,
  },
});
