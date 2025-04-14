const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firebaseUid: { 
    type: String, 
    unique: true,
    required: [true, 'Firebase UID is required']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  profilePicture: { 
    type: String, 
    default: "https://firebasestorage.googleapis.com/v0/b/gymbuddy-d7838.appspot.com/o/default_image.jpg?alt=media&token=f094d2d7-b0e6-4be7-905b-cb154fb4df79"
  },
  age: { 
    type: Number,
    min: [13, 'Age must be at least 13'],
    max: [120, 'Age cannot exceed 120']
  },
  gender: { 
    type: String,
    enum: {
      values: ['Male', 'Female', 'Other', 'Prefer not to say'],
    }
  },
  about: { 
    type: String,
    maxlength: [500, 'About cannot exceed 500 characters']
  },
  gym: { 
    display: String,  // e.g., "Gym Name, 123 Main St"
    place_id: String  // Google Places ID (unique to each location)
  }
});

const User = mongoose.model('ProfileData', UserSchema, 'ProfileData');

module.exports = User;