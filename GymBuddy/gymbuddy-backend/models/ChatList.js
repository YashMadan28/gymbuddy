const mongoose = require("mongoose");

require("./User");
require("./Messages");

const ChatListSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "ProfileData",
    required: true 
  },
  chatPartners: [
    {
      partnerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "ProfileData",
        required: true 
      },
      lastMessage: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Messages", 
        default: null 
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("ChatList", ChatListSchema);


