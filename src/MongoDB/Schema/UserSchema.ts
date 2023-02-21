import mongoose from "mongoose";
const opts = {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  };
// Schema for a user
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    displayName: { type: String },
    deviceId:{type:String},
    avatarUrl: { type: String,
        default: function() {
            return `https://api.dicebear.com/5.x/adventurer/svg?seed=Zoey`;
          }
    },
 
    // opts,
  });
  
  module.exports = mongoose.model('User', userSchema);
//   // Schema for a conversation
//   const conversationSchema = new mongoose.Schema({
//     participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//     messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
//   });
  
//   // Schema for a message
//   const messageSchema = new mongoose.Schema({
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
//     text: { type: String },
//     mediaUrl: { type: String },
//     timestamp: { type: Date, default: Date.now }
//   });
  