const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User'); // Import the User model
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;



// Middleware
app.use(cors());
app.use(express.json());


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, retryWrites: true, w: 'majority', ssl: true, })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const { verifyToken } = require('./firebase/firebaseAdmin'); // Import Firebase token verification middleware

// Create a new user
/*app.post('/api/users', verifyToken, async (req, res) => {
  const { firebaseUid, name, age, gender, gym, about } = req.body;

  try {
    const user = new User({ firebaseUid, name, age, gender, gym, about });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});*/

// Update user data or create if doesn't exist
app.put('/api/users/:firebaseUid', verifyToken, async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const updates = req.body;

    let user = await User.findOne({ 
      $or: [
        {firebaseUid },
        { email: updates.email }
      ]
    });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({ firebaseUid, ...updates, email: updates.email });
      console.log('Creating new user:', user); // Debugging line
      await user.save();
    } else {
      // Update existing user
      user = await User.findOneAndUpdate(
        { $or: [{ firebaseUid }, { email: updates.email }] },
        {...updates, firebaseUid},
        { new: true }
    );
    }
    
    console.log('Updated/Created user:', user); // Debugging line
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

app.get('/api/users/:email', verifyToken, async (req, res) => {
  try {
    const { email } = req.params;
    console.log('Searching for email:', email); // Debugging line

    const user = await User.findOne({ email });
    console.log('Found user:', user); // Debugging line

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});