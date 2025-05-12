const http = require('http');
const { Server } = require('socket.io');
const { app, onlineUsers } = require("./app");
// MongdoDB Models imports
const mongoose = require('mongoose');
const Messages = require('./models/Messages');
const ChatList = require('./models/ChatList');
const User = require('./models/User');
const Workout = require('./models/Workout');

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

global.io = io;

// ──────── SOCKET.IO EVENTS ──────── //

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