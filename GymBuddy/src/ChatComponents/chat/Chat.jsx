import { useState, useRef, useEffect } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hey! Are you hitting the gym later today?",
      time: "43 min ago",
      own: false,
    },
    {
      text: "Yeah! Thinking around 6. You?",
      time: "36 min ago",
      own: true,
    },
    {
      text: "Same! Wanna meet near the squat racks?",
      time: "30 min ago",
      own: false,
    },
    {
      text: "Perfect. I’m trying to hit a PR on deadlifts today 😤",
      time: "30 min ago",
      own: true,
    },
    {
      text: "Let’s gooo! I’ll bring my belt if you need it 💪",
      time: "27 min ago",
      own: false,
    },
    {
      text: "Haha appreciate it! Also, wanna grab a smoothie after?",
      time: "20 min ago",
      own: true,
    },
    {
      text: "100%. There’s a new place that opened by the parking lot.",
      time: "18 min ago",
      own: false,
    },
    {
      text: "Say less. Chest and triceps tomorrow?",
      time: "17 min ago",
      own: true,
    },
    {
      text: "Absolutely. Let’s destroy it 🔥",
      time: "15 min ago",
      own: false,
    },
  ]);

  const endRef = useRef(null);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleSend = () => {
    if (text.trim() === "") return;

    const newMessage = {
      text,
      time: "Just now",
      own: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setText("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <div className="avatar-wrapper">
            <img src="./avatar.png" alt="" />
            <div className="online-marker"></div>
          </div>
          <div className="texts">
            <span>Austin Smith</span>
            <p>Active Now</p>
          </div>
        </div>
      </div>

      <div className="middle">
        {messages.map((msg, index) => (
          <div className={`message ${msg.own ? "own" : ""}`} key={index}>
            {!msg.own && <img src="/avatar.png" alt="" />}
            <div className="texts">
              <p>{msg.text}</p>
              <span>{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <div className="emoji">
            <img
              src="./emoji.png"
              alt=""
              onClick={() => setOpen((prev) => !prev)}
            />
            <div className="Picker">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          </div>
        </div>

        <div className="messageBox">
          <div className="fileUploadWrapper">
            <label htmlFor="file">
              <svg viewBox="0 0 337 337" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="168.5"
                  cy="168.5"
                  r="158.5"
                  fill="none"
                  stroke="#6c6c6c"
                  strokeWidth="20"
                ></circle>
                <path
                  d="M167.759 79V259"
                  stroke="#6c6c6c"
                  strokeWidth="25"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M79 167.138H259"
                  stroke="#6c6c6c"
                  strokeWidth="25"
                  strokeLinecap="round"
                ></path>
              </svg>
              <span className="tooltip">Add an image</span>
            </label>
            <input name="file" id="file" type="file" />
          </div>

          <input
            id="messageInput"
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            required
          />

          <button id="sendButton" onClick={handleSend}>
            <svg viewBox="0 0 664 663" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
                stroke="#6c6c6c"
                strokeWidth="33.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;


