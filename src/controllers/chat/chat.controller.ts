const mongoose = require("mongoose");
import { Express, Request, Response } from "express";
import { User } from "../../entity/User";
import { AppDataSource } from "../../PGDB/data-source";
const userRepo = AppDataSource.getRepository(User);
import ChatModel from "../../MongoDB/Schema/chat";

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
