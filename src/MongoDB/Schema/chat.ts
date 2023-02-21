import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reciver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String },
  data:{type:Object},
  mediaUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Chat', messageSchema);
