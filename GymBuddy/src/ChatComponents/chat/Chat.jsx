import { useState, useRef, useEffect } from "react";
import "./chat.css"
import EmojiPicker from "emoji-picker-react";

const Chat = () => {

const [open, setOpen] = useState(false);
const [text, setText] = useState("");

const handleEmoji = (e) => {
    setText(prev=> prev + e.emoji);
    setOpen(false);
}

const endRef = useRef(null);

useEffect(()=>{
    endRef.current?.scrollIntoView({behavior: "smooth"});
}, {});

    return (
        <div className='chat'>
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
                        <p>dfasdfdasfasddsfsitsdakl;fasd
                            asl;djasdk;fjasd;fjasd;fjsda;fasdf
                            klsadjfkl;adfjsdak;lfjsa;dfsdajsdakfjsadl;fj
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message">
                    <img src="/avatar.png" alt="" />
                    <div className="texts">
                        <p>dfasdfdasfasddsfsitsdakl;fasd
                            asl;djasdk;fjasd;fjasd;fjsda;fasdf
                            klsadjfkl;adfjsdak;lfjsa;dfsdajsdakfjsadl;fj
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message">
                    <img src="/avatar.png" alt="" />
                    <div className="texts">
                        <p>dfasdfdasfasddsfsitsdakl;fasd
                            asl;djasdk;fjasd;fjasd;fjsda;fasdf
                            klsadjfkl;adfjsdak;lfjsa;dfsdajsdakfjsadl;fj
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <p>dfasdfdasfasddsfsitsdakl;fasd
                            asl;djasdk;fjasd;fjasd;fjsda;fasdf
                            klsadjfkl;adfjsdak;lfjsa;dfsdajsdakfjsadl;fj
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div className="message own">
                    <div className="texts">
                        <p>dfasdfdasfasddsfsitsdakl;fasd
                            asl;djasdk;fjasd;fjasd;fjsda;fasdf
                            klsadjfkl;adfjsdak;lfjsa;dfsdajsdakfjsadl;fj
                        </p>
                        <span>1 min ago</span>
                    </div>
                </div>
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                    <input type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={e=>setText(e.target.value)}/>
                    <div className="icons">
                    <div className="emoji">
                        <img
                         src="./emoji.png"
                         alt=""
                         onClick={()=>setOpen((prev) => !prev)}
                        />
                    <div className="Picker">
                        <EmojiPicker open={open} onEmojiClick={handleEmoji}/>
                    </div>
                    </div>
                </div>
                    <button className="sendButton">Send</button>
                </div>
        </div>
    )
}

export default Chat;