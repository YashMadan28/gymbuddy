const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true }, // Link to Firebase Auth
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  gym: { type: String },
  about: { type: String },
  stats: {
    weight: { type: Number },
    targetWeight: { type: Number },
    height: { type: Number },
    age: { type: Number },
    gender: { type: String },
    calorieGoal: { type: Number },
    fitnessGoal: { type: String },
  },
  messages: [
    {
      senderId: { type: String },
      receiverId: { type: String },
      content: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model('User', UserSchema);
module.exports = User;