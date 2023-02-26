import { Express, Request, Response } from "express";
import { AppDataSource } from "../PGDB/data-source";
import { getCurrentUser } from "../helper/jwt";
import { MAILDATA } from "../Interface/NodeMailerInterface";
import { transporter } from "../helper/nodeMailer";
import { DATA, NotificationResult } from "../Interface/SubjectInterface";
import { sendNotification } from "../Notification/PushNotification";
import { NotificationSchemaAdmin } from "../schema/notificationSchema";
import { User } from "../entity/User";
import {Notification} from "../entity/Notification";

const userRepo  =  AppDataSource.getRepository(User);
const notificationRepo = AppDataSource.getRepository(Notification)
export const create = async (req: any, res: Response): Promise<void> => {
  try {
    const validate = await NotificationSchemaAdmin.validateAsync(req.body);
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = await getCurrentUser(authHeader || "");
    console.log(currentUser.id)
    
    const allUsers:User[] = await userRepo.find({
      where:{
        deleted:false,
        blocked:false
      }
    })
    
    const userEmail:any  = allUsers.map((item:any)=>{
      return item.email
  })
    const userNotification = allUsers
        .filter((item: any) => item.deviceId !== null)
        .map((item: any) => item.deviceId);

    console.log(userNotification)
    const mailData: MAILDATA = {
        from: "giribipin04@gmail.com", // sender address
        to: userEmail, // list of receivers
        subject: validate.title,
        text: "Assignment!!!",
        html: `<br>${validate.body} </br>`,
      };
   const email =   await  transporter.sendMail(mailData, function (err: any, info: any) {
         if (err) console.log(err);
         else console.log("ok");
       });

      const deviceID:any = userNotification
      let data: DATA = {
        to: deviceID,
        sound: "default",
        title: validate.title,
        body: validate.body,
      };
    const datas =    await  notificationRepo.save(validate)
      console.log(datas)
      const notification: NotificationResult = await sendNotification(data);
    res.status(202).json({ message:"notification send", status: 202 });

  } catch (err: any) {
    res.status(422).json(err.message);
  }
};


export const get = async (req: any, res: Response): Promise<void> => {
    try {
        const data:Notification[] =    await  notificationRepo.find();
        const notification: NotificationResult = await sendNotification(data);
        res.status(202).json({ data, status: 202 });
    } catch (err: any) {
        res.status(422).json(err.message);
    }
};




