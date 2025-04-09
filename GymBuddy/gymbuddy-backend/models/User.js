const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true },
  email: { type: String, required: true, unique: true},
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  about: { type: String },
  gym: { type: String },
});

const User = mongoose.model('ProfileData', UserSchema, 'ProfileData');

module.exports = User;