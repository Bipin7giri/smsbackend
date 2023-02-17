import mongoose from "mongoose";
const uri = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.2d9ffmd.mongodb.net/sms`;
const dotenv = require("dotenv");
dotenv.config();
export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log("connected to mongodb");
  } catch (error) {
    console.error(error);
  }
};
