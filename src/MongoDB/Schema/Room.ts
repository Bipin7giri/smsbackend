import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    sender: String,
    roomId: String,
    receiver: String,
  },

  {
    timestamps: true,
  }
);

const RoomModel = mongoose.model("room", RoomSchema);
export default RoomModel;
