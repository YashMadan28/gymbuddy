const mongoose = require('mongoose');

const MessagesSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ProfileData',
    required: true,
    index: true
  },
  receiver: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ProfileData', 
    required: true,
    index: true
  },
  text: String,
  imageUrl: String,
  read: { type: Boolean, default: false }
}, { timestamps: true });

// Index for efficient querying of conversations
MessagesSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

const Messages = mongoose.model('Messages', MessagesSchema);

module.exports = Messages;
