import Chatlist from "./chatlist/Chatlist";
import "./list.css";
import Userinfo from "./userinfo/Userinfo";
import { useEffect } from "react";
import socket from "../../services/socket";

/**
 * List component renders the user's chat list
 * and managing socket events related to new messages.
 * 
 * Props:
 * - chatUsers: list of chat partners
 * - onSelectUser: handler for selecting a chat user
 * - addUserToChatlist: function to add a new chat partner
 * - updateLastMessage: updates last message preview in the list
 * - currentUserId: MongoDB user ID of the logged-in user
 * - fetchChatList: function to re-fetch the chat list from the backend
 */
const List = ({
  chatUsers,
  onSelectUser,
  addUserToChatlist,
  updateLastMessage,
  currentUserId,
  fetchChatList
}) => {

  // Register socket listeners for real-time message updates
  useEffect(() => {
    if (!currentUserId) return;

    // Listen for incoming messages and update the relevant chat preview
    socket.on("newMessage", (message) => {
      const otherUserId = message.sender === currentUserId ? message.receiver : message.sender;
      updateLastMessage(otherUserId, message);
    });

    // Listen for confirmation of sent messages and update UI
    socket.on("messageSent", (message) => {
      updateLastMessage(message.receiver, message);
    });

    // Clean up listeners on unmount or when currentUserId changes
    return () => {
      socket.off("newMessage");
      socket.off("messageSent");
    };
  }, [currentUserId, updateLastMessage]);

  // Render chat list UI
  return (
    <div className="list">
      <Userinfo />
      <Chatlist
        chatUsers={chatUsers}
        onSelectUser={onSelectUser}
        addUserToChatlist={addUserToChatlist}
        updateLastMessage={updateLastMessage}
        currentUserId={currentUserId}
        fetchChatList={fetchChatList}
      />
    </div>
  );
};

export default List;


