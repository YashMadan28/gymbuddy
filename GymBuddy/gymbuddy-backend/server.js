// Load environment variables from .env file
require('dotenv').config();

// Core and Middleware imports
const express = require('express');
const cors = require('cors');
const http = require('http');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { Server } = require('socket.io');

// Custom Firebase Admin auth + storage
const { verifyToken, bucket } = require('./firebase/firebaseAdmin');

// MongdoDB Models imports
const mongoose = require('mongoose');
const Messages = require('./models/Messages');
const ChatList = require('./models/ChatList');
const User = require('./models/User');
const Workout = require('./models/Workout');

/* Express app setup */
const app = express();
// Create HTTP server for Socket.IO integration
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// Socket.io setup //
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

/* Middleware setup */
// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
// Enable JSON request parsing
app.use(express.json());

// Store uploaded files in memory
const upload = multer({
  storage: multer.memoryStorage()
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  w: 'majority',
  ssl: true
}).then(() => {
  console.log(`✅ Connected to MongoDB: "${mongoose.connection.db.databaseName}"`);
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// ──────── API ROUTES ──────── //

// ---------- USER ROUTES ---------- //

// Get users by gym name
app.get('/api/users/by-gym', verifyToken, async (req, res) => {
  try {
    const gym_display = req.query.gym_display?.trim();

    if (!gym_display) {
      return res.status(400).json({
        success: false,
        message: "Valid gym_display string is required"
      });
    }

    const users = await User.aggregate([
      { $addFields: { gym_display_lower: { $toLower: "$gym.display" } } },
      {
        $match: {
          gym_display_lower: gym_display.toLowerCase(),
          firebaseUid: { $ne: req.user.uid }
        }
      },
      {
        $project: {
          name: 1,
          profilePicture: 1,
          age: 1,
          gender: 1,
          firebaseUid: 1,
          "gym.display": 1
        }
      }
    ]);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Search users by name
app.get('/api/users/search', verifyToken, async (req, res) => {
  try {
    const nameQuery = req.query.name?.trim();

    if (!nameQuery) {
      return res.status(400).json({
        users: []
      });
    }

    const users = await User.find({
      name: { $regex: new RegExp(nameQuery, 'i') },
      firebaseUid: { $ne: req.user.uid }
    }).select('_id name profilePicture');

    res.json({ users });
  } catch (error) {
    res.status(500).json({
      message: 'Search failed',
      users: []
    });
  }
});

// Create a new user profile
app.post('/api/users', verifyToken, async (req, res) => {
  try {
    const { firebaseUid, email, name } = req.body;

    if (!firebaseUid || !email || !name) {
      return res.status(400).json({
        message: 'Missing required fields'
      });
    }

    const user = new User({ firebaseUid, email, name });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'User already exists' });
    } else {
      res.status(500).json({
        message: 'Server error',
        error: error.message
      });
    }
  }
});

// Update user profile (excluding image)
app.put('/api/users/:firebaseUid', verifyToken, async (req, res) => {
  try {
    if (typeof req.body.gym === 'string') {
      req.body.gym = { display: req.body.gym };
    }

    const user = await User.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Upload user profile image
app.post('/api/users/:firebaseUid/upload', verifyToken, upload.single('profileImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'No file uploaded'
    });
  }

  try {
    const { firebaseUid } = req.params;

    const filename = `profileImages/${firebaseUid}-${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(filename);

    const metadata = {
      contentType: req.file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4()
      }
    };

    await file.save(req.file.buffer, { metadata });

    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${metadata.metadata.firebaseStorageDownloadTokens}`;

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { profilePicture: imageUrl },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      message: 'Profile image uploaded successfully',
      imageUrl
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error uploading profile image',
      error: error.message
    });
  }
});

// Get full user object by firebaseUid
app.get('/api/users/:firebaseUid', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// Get public profile for another user
app.get('/api/users/:userId/public', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name age gender gym about profilePicture').lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------- MESSAGES ROUTES ---------- //

// Upload image in a message and notify both users via socket
app.post('/api/messages/:senderId/:receiverId/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const { senderId, receiverId } = req.params;

    const filename = `chat-images/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(filename);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: { firebaseStorageDownloadTokens: uuidv4() }
      }
    });

    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(filename)}?alt=media&token=${file.metadata.metadata.firebaseStorageDownloadTokens}`;

    const message = await Messages.create({
      sender: senderId,
      receiver: receiverId,
      imageUrl,
      read: false
    });

    [senderId, receiverId].forEach(id => {
      if (onlineUsers.has(id)) {
        io.to(`user_${id}`).emit('newMessage', message);
      }
    });

    res.status(201).json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all messages between two users
app.get('/api/messages/:userId/:otherUserId', async (req, res) => {
  try {
    const messages = await Messages.find({
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

// ---------- CHATLIST ROUTES ---------- //

// Get chat partners and last message for a user
app.get('/api/chatlist/:userId', async (req, res) => {
  try {
    const list = await ChatList.findOne({ userId: req.params.userId })
      .populate({
        path: 'chatPartners.partnerId',
        select: 'name profilePicture lastActive'
      })
      .populate({
        path: 'chatPartners.lastMessage',
        populate: [
          { path: 'sender', select: 'name' },
          { path: 'receiver', select: 'name' }
        ]
      });

    if (!list) {
      return res.json([]);
    }

    const chatUsers = list.chatPartners.map(p => {
      if (!p.partnerId) return null;

      return {
        _id: p.partnerId._id,
        name: p.partnerId.name,
        profilePicture: p.partnerId.profilePicture,
        isOnline: new Date(p.partnerId.lastActive) > new Date(Date.now() - 5 * 60 * 1000),
        lastMessage: p.lastMessage || null
      };
    }).filter(Boolean);

    res.json(chatUsers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching chatlist" });
  }
});

// Add a chat partner to a user's chat list
app.post('/api/chatlist/add', async (req, res) => {
  const { userId, partnerId } = req.body;

  if (!userId || !partnerId) {
    return res.status(400).json({ message: "userId and partnerId are required" });
  }

  try {
    let chatList = await ChatList.findOne({ userId });

    if (!chatList) {
      chatList = await ChatList.create({
        userId,
        chatPartners: [{ partnerId }]
      });
    } else {
      const exists = chatList.chatPartners.some(
        p => p.partnerId.toString() === partnerId
      );

      if (!exists) {
        chatList.chatPartners.push({ partnerId });
        await chatList.save();
      }
    }

    res.json(chatList);
  } catch (err) {
    res.status(500).json({ message: "Could not add chat partner" });
  }
});

// Remove a chat partner from a user's chat list
app.delete('/api/chatlist/:userId/:partnerId', async (req, res) => {
  try {
    const chatList = await ChatList.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { chatPartners: { partnerId: req.params.partnerId } } },
      { new: true }
    );

    res.json(chatList);
  } catch (err) {
    res.status(500).json({ message: "Could not remove chat partner" });
  }
});

// ---------- WORKOUT ROUTES ---------- //

// Get workouts for authenticated user
app.get('/api/workouts/:userId', verifyToken, async (req, res) => {
  try {
    if (req.params.userId !== req.user.uid) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const workouts = await Workout.findOne({ userId: req.params.userId });

    res.json(workouts || { exercises: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create or update workouts
app.put('/api/workouts/:userId', verifyToken, async (req, res) => {
  try {
    if (req.params.userId !== req.user.uid) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const workout = await Workout.findOneAndUpdate(
      { userId: req.params.userId },
      {
        userId: req.params.userId,
        exercises: req.body.exercises
      },
      {
        new: true,
        upsert: true
      }
    );

    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ──────── SOCKET.IO EVENTS ──────── //

const onlineUsers = new Map();

io.on('connection', (socket) => {
  // Authenticate and join user to a room
  socket.on('authenticate', async (userId) => {
    if (!userId) return;

    onlineUsers.set(userId, socket.id);
    socket.join(`user_${userId}`);

    await User.findByIdAndUpdate(userId, {
      lastActive: new Date()
    });
  });

  // Internal helpers
  async function ensureChatPartner(userId, partnerId) {
    let chatList = await ChatList.findOne({ userId });

    if (!chatList) {
      await ChatList.create({
        userId,
        chatPartners: [{ partnerId }]
      });
    } else {
      const exists = chatList.chatPartners.some(
        p => p.partnerId.toString() === partnerId
      );

      if (!exists) {
        chatList.chatPartners.push({ partnerId });
        await chatList.save();
      }
    }
  }

  async function updateLastMessage(userId, partnerId, messageId) {
    await ChatList.updateOne(
      { userId, "chatPartners.partnerId": partnerId },
      { $set: { "chatPartners.$.lastMessage": messageId } }
    );
  }

  // Send a message
  socket.on('sendMessage', async ({ senderId, receiverId, text, imageUrl }) => {
    try {
      const message = await Messages.create({
        sender: senderId,
        receiver: receiverId,
        text,
        imageUrl,
        read: false
      });

      await ensureChatPartner(senderId, receiverId);
      await ensureChatPartner(receiverId, senderId);

      await updateLastMessage(senderId, receiverId, message._id);
      await updateLastMessage(receiverId, senderId, message._id);

      if (onlineUsers.has(receiverId)) {
        io.to(`user_${receiverId}`).emit('newMessage', message);
      }

      socket.emit('messageSent', message);
    } catch (error) {
      socket.emit('error', 'Failed to send message');
    }
  });

  // Mark messages as read
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

      if (onlineUsers.has(userId)) {
        io.to(`user_${userId}`).emit('messagesRead', {
          fromUserId: otherUserId
        });
      }
    } catch (error) {}
  });

  // Clean up on disconnect
  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// ──────── START SERVER ──────── //
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});