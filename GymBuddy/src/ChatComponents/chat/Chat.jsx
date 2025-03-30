import { useState, useRef, useEffect } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, {});

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <div className="avatar-wrapper">
            <img src="./avatar.png" alt="" />
            <div className="online-marker"></div>
          </div>
          <div className="texts">
            <span>Adam Smith</span>
            <p>Active Now</p>
          </div>
        </div>
      </div>
      <div className="middle">
        <div className="message">
          <img src="/avatar.png" alt="" />
          <div className="texts">
            <p>
              dfasdfdasfasddsfsitsdakl;fasd asl;djasdk;fjasd;fjasd;fjsda;fasdf
              klsadjfkl;adfjsdak;lfjsa;dfsdajsdakfjsadl;fj
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="/avatar.png" alt="" />
          <div className="texts">
            <p>
              dfasdfdasfasddsfsitsdakl;fasd asl;djasdk;fjasd;fjasd;fjsda;fasdf
              klsadjfkl;adfjsdak;lfjsa;dfsdajsdakfjsadl;fj
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="/avatar.png" alt="" />
          <div className="texts">
            <p>
              dfasdfdasfasddsfsitsdakl;fasd asl;djasdk;fjasd;fjasd;fjsda;fasdf
              klsadjfkl;adfjsdak;lfjsa;dfsdajsdakfjsadl;fj
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <p>
              dfasdfdasfasddsfsitsdakl;fasd asl;djasdk;fjasd;fjasd;fjsda;fasdf
              klsadjfkl;adfjsdak;lfjsa;dfsdajsdakfjsadl;fj
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <p>
              dfasdfdasfasddsfsitsdakl;fasd asl;djasdk;fjasd;fjasd;fjsda;fasdf
              klsadjfkl;adfjsdak;lfjsa;dfsdajsdakfjsadl;fj
            </p>
            <span>1 min ago</span>
          </div>
        </div>
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
<div class="messageBox">
  <div class="fileUploadWrapper">
    <label for="file">
      <svg viewBox="0 0 337 337" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="168.5"
          cy="168.5"
          r="158.5"
          fill="none"
          stroke="#6c6c6c"
          stroke-width="20"
        ></circle>
        <path
          d="M167.759 79V259"
          stroke="#6c6c6c"
          stroke-width="25"
          stroke-linecap="round"
        ></path>
        <path
          d="M79 167.138H259"
          stroke="#6c6c6c"
          stroke-width="25"
          stroke-linecap="round"
        ></path>
      </svg>
      <span class="tooltip">Add an image</span>
    </label>
    <input name="file" id="file" type="file" />
  </div>
  <input id="messageInput" type="text" placeholder="Type a message..." value={text}
        onChange={(e)=>setText(e.target.value)} required="" />
  <button id="sendButton">
    <svg viewBox="0 0 664 663" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
        fill="none"
      ></path>
      <path
        d="M646.293 331.888L17.7538 17.6187L155.245 331.888M646.293 331.888L17.753 646.157L155.245 331.888M646.293 331.888L318.735 330.228L155.245 331.888"
        stroke="#6c6c6c"
        stroke-width="33.67"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></path>
    </svg>
  </button>
</div>
      </div>
    </div>
  );
};

export default Chat;
