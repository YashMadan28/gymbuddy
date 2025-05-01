import { useState, useRef, useEffect } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import axios from "../../services/axios";

/**
 * Chat component handles:
 * - Displaying chat messages between current and selected user
 * - Sending text and image messages
 * - Emoji picker and input
 * - Auto-scrolling to the latest message
 */

const Chat = ({ selectedUser, messages, onSendMessage, currentUserId }) => {
  // Emoji picker state
  const [open, setOpen] = useState(false);

  // Input message state
  const [text, setText] = useState("");

  // Ref for auto-scrolling to the latest message
  const endRef = useRef(null);

  // Auto-scroll to the bottom whenever messages update
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a text message
  const handleSend = () => {
    if (text.trim() === "" || !selectedUser) return;
    onSendMessage(selectedUser._id, text);
    setText("");
  };

  // Handle Enter key press to send message
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // Handle sending an image message
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `/api/messages/${currentUserId}/${selectedUser._id}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  // Render fallback UI if no user is selected
  if (!selectedUser) {
    return <div className="chat">Select a chat to start messaging.</div>;
  }

  return (
    <div className="chat">
      {/* Top user info bar */}
      <div className="top">
        <div className="user">
          <div className="avatar-wrapper">
            <img src={selectedUser.profilePicture} alt={selectedUser.name} />
            {selectedUser.isOnline && <div className="online-marker"></div>}
          </div>
          <div className="texts">
            <span>{selectedUser.name}</span>
            <p>{selectedUser.isOnline ? "Active Now" : "Offline"}</p>
          </div>
        </div>
      </div>

      {/* Middle section: message bubbles */}
      <div className="middle">
        {messages.map((msg, index) => (
          <div
            className={`message ${msg.sender === selectedUser._id ? "" : "own"}`}
            key={index}
          >
            {/* Show avatar for incoming messages only */}
            {msg.sender === selectedUser._id && (
              <img src={selectedUser.profilePicture} alt="" />
            )}

            <div className="texts">
              {/* Render text message if present */}
              {msg.text && <p>{msg.text}</p>}

              {/* Render image message if present */}
              {msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="sent"
                  style={{
                    maxWidth: "200px",
                    borderRadius: "10px",
                    marginTop: "5px",
                  }}
                />
              )}

              {/* Timestamp and read status */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "5px",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    color: "white",
                    marginRight: "4px",
                  }}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
                {/* Show "read" or "sent" for outgoing messages */}
                {msg.sender !== selectedUser._id && (
                  <span
                    style={{
                      fontSize: "14px",
                      color: msg.read ? "green" : "gray",
                    }}
                  >
                    {msg.read ? "read" : "sent"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Invisible anchor to auto-scroll to */}
        <div ref={endRef}></div>
      </div>

      {/* Bottom input and emoji/image controls */}
      <div className="bottom">
        <div className="icons">
          {/* Emoji toggle button */}
          <div className="emoji">
            <img
              src="./emoji.png"
              alt="emoji"
              onClick={() => setOpen((prev) => !prev)}
            />
            {open && (
              <div className="Picker">
                <EmojiPicker
                  open={open}
                  onEmojiClick={(e) => {
                    setText((prev) => prev + e.emoji);
                    setOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Message input and file upload */}
        <div className="messageBox">
          {/* File upload icon */}
          <div className="fileUploadWrapper">
            <label htmlFor="file">
              <svg
                viewBox="0 0 337 337"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="168.5"
                  cy="168.5"
                  r="158.5"
                  fill="none"
                  stroke="#6c6c6c"
                  strokeWidth="20"
                />
                <path
                  d="M167.759 79V259"
                  stroke="#6c6c6c"
                  strokeWidth="25"
                  strokeLinecap="round"
                />
                <path
                  d="M79 167.138H259"
                  stroke="#6c6c6c"
                  strokeWidth="25"
                  strokeLinecap="round"
                />
              </svg>
            </label>
            <input
              name="file"
              id="file"
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
            />
          </div>

          {/* Text input field */}
          <input
            id="messageInput"
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            required
          />

          {/* Send button */}
          <button id="sendButton" onClick={handleSend}>
            <svg
              viewBox="0 0 664 663"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                stroke="#6c6c6c"
                strokeWidth="33.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;














