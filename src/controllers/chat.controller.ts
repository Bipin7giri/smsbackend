const mongoose = require("mongoose");
import { Express, Request, Response } from "express";
import { User } from "../entity/User";
import { getCurrentUser } from "../helper/jwt";
import { DATA, NotificationResult } from "../Interface/SubjectInterface";
import { sendNotification } from "../Notification/PushNotification";
import { AppDataSource } from "../PGDB/data-source";
import { ChatSchema } from "../schema/chatSchema";
const userRepo = AppDataSource.getRepository(User);
const userModel = require("../MongoDB/Schema/UserSchema");
const chatModel = require("../MongoDB/Schema/chat");

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await ChatSchema.validateAsync(req.body);
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = await getCurrentUser(authHeader || "");
    console.log(currentUser);
    const sender = await userModel.findOne({
      username: currentUser.email,
    });
    console.log(sender)

    const reciver = await userModel.findOne({
      username: validate.reciver,
    });
    console.log(reciver)

    //  const deviceID: String[] = deviceIDs
    let data: DATA = {
      to: reciver.deviceId,
      sound: "default",
      title: `Message from ${sender.username}`,
      body: validate.text,
      data: validate?.body,
    };

    const results: NotificationResult = await sendNotification(data);

    const payload = await chatModel.create({
      sender: sender._id,
      reciver: reciver._id,
      // data: validate.body,
    });

    res.send(results);
  } catch (err: any) {
    res.json({ message: err.message });
  }

  //  const sender = await userRepo.findOne({
  //     where:{
  //         id:
  //     }
  //  })
};


export const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const validate = await ChatSchema.validateAsync(req.body);
    let authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // Remove "Bearer " from the authHeader
      authHeader = authHeader.slice(7, authHeader.length);
    }
    const currentUser: any = await getCurrentUser(authHeader || "");
    console.log(currentUser);
   
    const users = await userModel.findMany({
      username:{ $ne:currentUser.email },
    });

    res.send(users);
  } catch (err: any) {
    res.json({ message: err.message });
  }

  //  const sender = await userRepo.findOne({
  //     where:{
  //         id:
  //     }
  //  })
};
