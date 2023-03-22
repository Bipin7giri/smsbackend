const mongoose = require("mongoose");
import { Express, Request, Response } from "express";
import { User } from "../../entity/User";
import { AppDataSource } from "../../PGDB/data-source";
const userRepo = AppDataSource.getRepository(User);

import MessageModel from "../../MongoDB/Schema/MessageModel";

export const addMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (err: any) {
    res.json({ message: err.message });
  }
};

export const getMessage = async (req: Request, res: Response) => {
  try {
    const { chatId } = req?.params;
    const result = await MessageModel.find({
      chatId,
    });
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};
