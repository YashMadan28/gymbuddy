import "./messages.css";
import List from "./ChatComponents/list/List";
import Chat from "./ChatComponents/chat/Chat";
import Detail from "./ChatComponents/detail/Detail";

/* The Messages page consist of three components (located in ChatComponents folder):
 1. List - Displays the list of chats on the left side.
 2. Chat - Displays the chat messages between the user and selected person in the middle.
 3. Detail - Displays the details of the selected person on the right side.
*/

const Messages = () => {
  return (
    <div className="messages-page">
      <div className="messages-body">
        <List />
        <Chat />
        <Detail />
      </div>
    </div>
  );
};

export default Messages;
