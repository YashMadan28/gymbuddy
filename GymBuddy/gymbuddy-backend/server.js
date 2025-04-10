const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User'); // Import the User model

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, retryWrites: true, w: 'majority', ssl: true, })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the GymBuddy API');
});

const { verifyToken } = require('./firebase/firebaseAdmin'); // Import Firebase token verification middleware

// Create a new user
app.post('/api/users', verifyToken, async (req, res) => {
  const { firebaseUid, name, age, gender, gym, about } = req.body;

  try {
    const user = new User({ firebaseUid, name, age, gender, gym, about });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

// Get user data by Firebase UID
app.get('/api/users/:firebaseUid', verifyToken, async (req, res) => {
  const { firebaseUid } = req.params;

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// Update user data
app.put('/api/users/:firebaseUid', verifyToken, async (req, res) => {
  const { firebaseUid } = req.params;
  const updates = req.body;

  try {
    const user = await User.findOneAndUpdate({ firebaseUid }, updates, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

// Add a message
app.post('/api/users/:firebaseUid/messages', verifyToken, async (req, res) => {
  const { firebaseUid } = req.params;
  const { senderId, receiverId, content } = req.body;

  try {
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.messages.push({ senderId, receiverId, content });
    await user.save();

    res.status(201).json(user.messages);
  } catch (error) {
    res.status(500).json({ message: 'Error adding message', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});