require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const multer = require('multer');
const { verifyToken } = require('./firebase/firebaseAdmin');
const Messages = require('./models/Messages');
const { Server } = require('socket.io');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const storage = require('./firebase/firebaseAdmin');
const User = require('./models/User'); // Import the User model
const Workout = require('./models/Workout');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for image upload
const upload = multer({ storage: multer.memoryStorage() }); // Save file in memory

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, retryWrites: true, w: 'majority', ssl: true })
.then(() => {
  console.log(`✅ Connected to MongoDB database: "${mongoose.connection.db.databaseName}"`);
})
.catch(err => {
  console.error('MongoDB connection error:', err);
});

///////* User Profile section */////////

// Create initial profile (email + name only)
app.post('/api/users', verifyToken, async (req, res) => {
  try {
    const { firebaseUid, email, name } = req.body;

    // Basic validation
    if (!firebaseUid || !email || !name) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = new User({ firebaseUid, email, name });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'User already exists' });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
});

// Update the user profile
app.put('/api/users/:firebaseUid', verifyToken, async (req, res) => {
  try {
    // Convert string gym to object format if needed
    if (typeof req.body.gym === 'string') {
      req.body.gym = {
        display: req.body.gym,
        place_id: `legacy_${req.params.firebaseUid}`
      };
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Get user by Firebase UID
app.get('/api/users/:firebaseUid', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});


// Upload profile picture to Firebase and update user profile
app.post('/api/users/:firebaseUid/upload', verifyToken, upload.single('profileImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Create a reference to Firebase Storage where the image will be stored
    const storageRef = ref(storage, `profileImages/${req.params.firebaseUid}-${Date.now()}-${req.file.originalname}`);

    // Upload the image to Firebase Storage
    await uploadBytes(storageRef, req.file.buffer);

    // Get the image URL after upload
    const imageUrl = await getDownloadURL(storageRef);

    // Update the user's profile in MongoDB with the image URL
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      { profilePicture: imageUrl },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile image uploaded successfully', imageUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

///////* Public other user profile route */////////
app.get('/api/users/:userId/public', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('name age gender gym about profilePicture')
      .lean();

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/users/by-gym', verifyToken, async (req, res) => {
  try {
    const { place_id } = req.query;
    const currentUserId = req.user.uid;

    // Validate input
    if (!place_id || typeof place_id !== 'string') {
      return res.status(400).json({ 
        success: false,
        message: "Valid place_id string is required" 
      });
    }

    // Query with exact match and case sensitivity
    const users = await User.find({
      firebaseUid: { $ne: currentUserId },
      'gym.place_id': { $eq: place_id } // Explicit equality match
    })
    .select('name profilePicture age gender firebaseUid') // Include firebaseUid for messaging
    .lean();

    // Add debugging logs (remove in production)
    console.log(`Found ${users.length} users for place_id: ${place_id}`);
    if (users.length > 0) {
      console.log('Sample user gym data:', users[0].gym);
    }

    return res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Database search error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: []
    });
  }
});

///////* Messages section */////////

// Initialize Firebase storage
// This is a workaround to dynamically import the ES Module


// HTTP server
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

// Track online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  // User authentication
  socket.on('authenticate', async (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.join(`user_${userId}`);
    
    // Mark user as online
    await User.findByIdAndUpdate(userId, { lastActive: new Date() });
  });

  // Message handler
  socket.on('sendMessage', async ({ senderId, receiverId, text }) => {
    try {
      const message = new Messages({  // Changed to Messages
        sender: senderId,
        receiver: receiverId,
        text,
        read: false
      });
      await message.save();

      // Emit to receiver if online
      if (onlineUsers.has(receiverId)) {
        io.to(`user_${receiverId}`).emit('newMessage', message);
      }

      // Also send back to sender for their UI
      socket.emit('messageSent', message);
    } catch (error) {
      console.error('Message send error:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  // Image message handler
  socket.on('sendImage', async ({ senderId, receiverId, fileData }, callback) => {
    try {
      // Upload to Firebase
      const storageRef = ref(storage, `chat-images/${Date.now()}-${fileData.name}`);
      const fileBuffer = Buffer.from(fileData.data.split(',')[1], 'base64');
      await uploadBytes(storageRef, fileBuffer);
      
      // Get download URL
      const imageUrl = await getDownloadURL(storageRef);

      // Save to MongoDB
      const message = new Messages({
        sender: senderId,
        receiver: receiverId,
        imageUrl,
        read: false
      });
      await message.save();

      // Deliver to recipient
      if (onlineUsers.has(receiverId)) {
        io.to(`user_${receiverId}`).emit('newMessage', message);
      }
      callback({ success: true, imageUrl });
    } catch (error) {
      console.error('Image upload failed:', error);
      callback({ success: false, error: 'Upload failed' });
    }
  });

  // Add this inside the socket.io connection handler
socket.on('markAsRead', async ({ userId, otherUserId }) => {
  try {
    await Messages.updateMany(
      {
        sender: otherUserId,
        receiver: userId,
        read: false
      },
      { $set: { read: true } }
    );
    
    // Notify the other user that messages were read
    if (onlineUsers.has(otherUserId)) {
      io.to(`user_${otherUserId}`).emit('messagesRead', { userId });
    }
  } catch (error) {
    console.error('Error marking messages as read:', error);
  }
});

  // Disconnect handler
  socket.on('disconnect', () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
      }
    });
  });
});

// REST API Routes
app.get('/api/messages/:userId/:otherUserId', async (req, res) => {
  try {
    const messages = await Messages.find({  // Changed to Messages
      $or: [
        { sender: req.params.userId, receiver: req.params.otherUserId },
        { sender: req.params.otherUserId, receiver: req.params.userId }
      ]
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's chat list
app.get('/api/users/:userId/chats', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get all unique users this user has chatted with
    const chatPartners = await Messages.aggregate([
      {
        $match: {
          $or: [
            { sender: mongoose.Types.ObjectId(userId) },
            { receiver: mongoose.Types.ObjectId(userId) }
          ]
        }
      },
      {
        $group: {
          _id: null,
          partners: {
            $addToSet: {
              $cond: [
                { $eq: ["$sender", mongoose.Types.ObjectId(userId)] },
                "$receiver",
                "$sender"
              ]
            }
          }
        }
      }
    ]);

    if (!chatPartners.length) {
      return res.json([]);
    }

    // Get user details for each chat partner
    const partnersWithDetails = await User.aggregate([
      {
        $match: {
          _id: { $in: chatPartners[0].partners }
        }
      },
      {
        $lookup: {
          from: "messages",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        { $eq: ["$sender", "$$userId"] },
                        { $eq: ["$receiver", mongoose.Types.ObjectId(userId)] }
                      ]
                    },
                    {
                      $and: [
                        { $eq: ["$sender", mongoose.Types.ObjectId(userId)] },
                        { $eq: ["$receiver", "$$userId"] }
                      ]
                    }
                  ]
                }
              }
            },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: "lastMessage"
        }
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ["$lastMessage", 0] }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          profilePicture: 1,
          lastMessage: 1,
          isOnline: {
            $cond: {
              if: { $gt: ["$lastActive", new Date(Date.now() - 5 * 60 * 1000)] },
              then: true,
              else: false
            }
          }
        }
      },
      { $sort: { "lastMessage.createdAt": -1 } }
    ]);

    res.json(partnersWithDetails);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: error.message });
  }
});


// Get user's workouts
app.get('/api/workouts/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.user.uid) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    const workouts = await Workout.findOne({ userId });
    res.json(workouts || { splits: [], muscleGroups: [] });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create/Update workout
app.put('/api/workouts/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.user.uid) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    const { splits, muscleGroups } = req.body;

    const workout = await Workout.findOneAndUpdate(
      { userId },
      { 
        userId,
        splits,
        muscleGroups
      },
      { new: true, upsert: true }
    );
    
    res.json(workout);
  } catch (error) {
    console.error('Error updating workouts:', error);
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

