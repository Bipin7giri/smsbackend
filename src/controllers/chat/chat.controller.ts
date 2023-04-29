const mongoose = require("mongoose");
import { Express, Request, Response } from "express";
import { User } from "../../entity/User";
import { AppDataSource } from "../../PGDB/data-source";
const userRepo = AppDataSource.getRepository(User);
import ChatModel from "../../MongoDB/Schema/chat";
import RoomModel from "../../MongoDB/Schema/Room";
import { getCurrentUser } from "../../helper/jwt";
import { type } from "os";
import { StringSchema } from "joi";

export const create = async (req: Request, res: Response): Promise<void> => {
  const newChat = new ChatModel({
    members: [req.body.senderId, req.body.reciverId],
  });
  try {
    const resutlt = await newChat.save();
    res.status(200).json(resutlt);
  } catch (err: any) {
    res.json({ message: err.message });
  }
};

export const userChats = async (req: Request, res: Response) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req?.params?.userId] },
    });
    res.status(200).json(chat);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
export const findChat = async (req: Request, res: Response) => {
  try {
    const chat = await ChatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

type Room = {
  sender?: string | null;
  receiver: string;
  roomId: string;
};
export const JoinRoom = async (
  receiver: string,
  room: string,
  sender?: string
) => {
  try {
    // const currentUser: any = await getCurrentUser(receiver || "");

    console.log(receiver, room, sender);
    const result = await RoomModel.findOne({
      $and: [{ sender: "bipingiri27@gmail.com" }, { receiver: receiver }],
    });
    if (result) {
      // const filter = {
      //   sender: "bipingiri27@gmail.com",
      //   receiver: receiver,
      // };

      // const update = {
      //   $set: {
      //     roomId: room,
      //   },
      // };

      // const result = await RoomModel.updateOne(filter, update);
      return;
    } else {
      const result = await RoomModel.create({
        receiver: receiver,
        sender: "bipingiri27@gmail.com",
        roomId: room,
      });
    }
  } catch (err: any) {
    throw err;
  }
};

export const StartChart = async (
  receiver: string,
  // room?: string,
  sender?: string
) => {
  try {
    // const currentUser: any = await getCurrentUser(receiver || "");

    console.log(receiver, sender);

    const result = await RoomModel.findOne({
      $and: [{ sender: sender }, { receiver: receiver }],
    });
    // console.log(result);

    return result;
  } catch (err: any) {
    throw err;
  }
};

export const getAllUserForChat = async (req: Request, res: Response) => {
  try {
    const users = await userRepo.find({
      where: {
        blocked: false,
      },
      select: ["email", "firstName"],
    });
    res.json(users);
  } catch (err: any) {
    throw err;
  }
};
