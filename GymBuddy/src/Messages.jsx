import "./messages.css";
import List from "./ChatComponents/list/List";
import Chat from "./ChatComponents/chat/Chat";
import Detail from "./ChatComponents/detail/Detail";
import { useEffect, useState } from "react";
import socket from "./services/socket";
import axios from "./services/axios";
import { getAuth } from "firebase/auth";
import { useLocation } from "react-router-dom";

/* The Messages page consist of three components (located in ChatComponents folder):
 1. List - Displays the list of chats on the left side.
 2. Chat - Displays the chat messages between the user and selected person in the middle.
 3. Detail - Displays the details of the selected person on the right side.

 Features 1 on 1 chat:
 - Users can send text and image messages.
 - Users can see the chat history with each partner.
 - Users can see if the last message was read.
 - Users can see the last message preview in the chat list.
 - Users can add new chat partners to their chat list.
 - Users can remove chat partners from their chat list.
 - Users can search/filter chat partners from their chat list.
 - Users can see the details of each partner via View Profile button.
*/

const Messages = () => {
  // Store list of chat users
  const [chatUsers, setChatUsers] = useState([]);

  // Track currently selected user in chat
  const [selectedUser, setSelectedUser] = useState(null);

  // Store messages per user (userId -> messages[])
  const [messages, setMessages] = useState({});

  // Store the current user's MongoDB ID
  const [currentUserId, setCurrentUserId] = useState(null);

  // Access location state (used to auto-open a chat)
  const location = useLocation();
  const recipientId = location.state?.recipientId;

  // Fetch current user ID and chat list on authentication change
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const res = await axios.get(`/api/users/${user.uid}`);
          const mongoUserId = res.data._id;
          setCurrentUserId(mongoUserId);

          // Authenticate socket connection
          socket.emit("authenticate", mongoUserId);

          // Load chat list
          fetchChatList(mongoUserId);
        } catch (err) {
          console.error("Error fetching current user:", err);
        }
      } else {
        alert("Please log in to continue.");
        window.location.href = "/home";
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch user's chat list from backend
  const fetchChatList = async (userId) => {
    try {
      const res = await axios.get(`/api/chatlist/${userId}`);
      setChatUsers(res.data);
    } catch (err) {
      console.error("Error fetching chat list:", err);
    }
  };

  // Update last message for a specific user in the chat list
  const updateLastMessage = (userId, message) => {
    setChatUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, lastMessage: message } : u))
    );
  };

  // Handle selecting a chat user to view messages
  const handleUserSelect = async (user) => {
    setSelectedUser(user);

    try {
      const res = await axios.get(`/api/messages/${currentUserId}/${user._id}`);

      // Mark messages as read
      const updated = res.data.map((msg) =>
        msg.receiver === currentUserId && !msg.read
          ? { ...msg, read: true }
          : msg
      );

      setMessages((prev) => ({
        ...prev,
        [user._id]: updated,
      }));

      socket.emit("markAsRead", {
        userId: currentUserId,
        otherUserId: user._id,
      });
    } catch (err) {
      console.error("Error fetching conversation:", err);
    }
  };

  // Handle sending a message to another user
  const handleSendMessage = async (userId, text = "", imageUrl = "") => {
    if (!text.trim() && !imageUrl.trim()) return;

    const newMessage = {
      sender: currentUserId,
      receiver: userId,
      text,
      imageUrl,
      time: "Just now",
      own: true,
      createdAt: new Date().toISOString(),
    };

    // Emit message via socket
    socket.emit("sendMessage", {
      senderId: currentUserId,
      receiverId: userId,
      text,
      imageUrl,
    });

    // Ensure user is in chat list
    try {
      await axios.post("/api/chatlist/add", {
        userId: currentUserId,
        partnerId: userId,
      });
    } catch (err) {
      console.error("Error adding user to chat list:", err);
    }

    // Add to local messages state (for real-time updates)
    setMessages((prev) => ({
      ...prev,
      [userId]: [...(prev[userId] || []), newMessage],
    }));

    updateLastMessage(userId, newMessage);
  };

  // Add a user to the chat list manually
  const addUserToChatlist = async (user) => {
    await axios.post("/api/chatlist/add", {
      userId: currentUserId,
      partnerId: user._id,
    });
  };

  // Remove a user from the chat list
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/chatlist/${currentUserId}/${userId}`);
      setChatUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Error deleting user from chat list:", err);
    }
  };

  // Listen for real-time socket events
  useEffect(() => {
    if (!currentUserId) return;

    const handleNewMessage = (message) => {
      const partnerId =
        message.sender === currentUserId ? message.receiver : message.sender;

      setMessages((prev) => {
        const chat = prev[partnerId] || [];
        const exists = chat.some((m) => m._id === message._id);
        if (exists) return prev;
        return {
          ...prev,
          [partnerId]: [...chat, message],
        };
      });

      updateLastMessage(partnerId, message);
    };

    const handleMessageSent = (message) => {
      const partnerId = message.receiver;
      updateLastMessage(partnerId, message);
      fetchChatList(currentUserId);
    };

    const handleMessagesRead = ({ fromUserId }) => {
      setChatUsers((prev) =>
        prev.map((user) => {
          if (user._id === fromUserId && user.lastMessage && !user.lastMessage.read) {
            return {
              ...user,
              lastMessage: { ...user.lastMessage, read: true },
            };
          }
          return user;
        })
      );
    };

    // Register socket event listeners
    socket.on("newMessage", handleNewMessage);
    socket.on("messageSent", handleMessageSent);
    socket.on("messagesRead", handleMessagesRead);

    // Cleanup on unmount
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageSent", handleMessageSent);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [currentUserId]);

  // Auto-select a user passed via route state (from "Matches" page)
  useEffect(() => {
    if (!recipientId || !chatUsers.length) return;
    const match = chatUsers.find((u) => u._id === recipientId);
    if (match) handleUserSelect(match);
  }, [recipientId, chatUsers]);

  return (
    <div className="messages-page">
      <div className="messages-body">
        <List
          chatUsers={chatUsers}
          onSelectUser={handleUserSelect}
          addUserToChatlist={addUserToChatlist}
          updateLastMessage={updateLastMessage}
          currentUserId={currentUserId}
          fetchChatList={fetchChatList}
        />
        <Chat
          selectedUser={selectedUser}
          messages={messages[selectedUser?._id] || []}
          onSendMessage={handleSendMessage}
          currentUserId={currentUserId}
        />
        <Detail
          selectedUser={selectedUser}
          onDeleteUser={handleDeleteUser}
        />
      </div>
    </div>
  );
};

export default Messages;
















