import "./chatlist.css";
import { useState } from "react";
import axios from "../../../services/axios";

/**
 * Chatlist component displays the user's existing chat partners,
 * allows filtering of those existing chat partners via search,
 * and includes a modal to search for users and start new chats with them.
 */

const Chatlist = ({
  chatUsers,
  onSelectUser,
  addUserToChatlist,
  updateLastMessage,
  currentUserId,
  fetchChatList,
}) => {
  // State for in-page chat list search
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // State for modal-based user search
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  // Track currently selected user (for highlighting)
  const [activeUserId, setActiveUserId] = useState(null);

  // Handle modal search query and API call
  const handleUserSearch = async () => {
    if (modalSearchQuery.trim() === "") return;

    try {
      const res = await axios.get(`/api/users/search?name=${modalSearchQuery}`);
      setSearchResults(res.data.users);
    } catch (err) {
      console.error("Error searching users:", err);
    } finally {
      setSearchAttempted(true);
    }
  };

  // Handle user selection in sidebar list
  const handleSelectUser = (user) => {
    onSelectUser(user);
    setActiveUserId(user._id);
  };

  // Add user to chat list from search modal
  const handleAddUser = async (user) => {
    try {
      await addUserToChatlist(user);
      await fetchChatList(currentUserId);
      setSearchMode(false);
      setModalSearchQuery("");
      setSearchResults([]);
      setSearchAttempted(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Format the preview text for the last message in a chat
  const formatMessagePreview = (msg, userName) => {
    if (!msg) return "";
    const isImage = msg.imageUrl && !msg.text;
    const text = isImage ? "[Image]" : msg.text || "";

    const isMine = msg.sender?._id === currentUserId || msg.sender === currentUserId;
    const senderName = msg.sender?.name || userName;

    const prefix = isMine ? "You: " : `${senderName}: `;
    return `${prefix}${text}`;
  };

  return (
    <div className="chatlist">
      {/* Sidebar search bar */}
      <div className="search">
        <div className="searchBar">
          <img src="/search.png" alt="search" />
          <input
            type="text"
            placeholder="Search your chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Add new chat button (opens modal) */}
        <div className="add" onClick={() => setSearchMode(true)}>
          <img src="./plus.png" alt="add" />
        </div>
      </div>

      {/* List of existing chat users */}
      {Array.isArray(chatUsers) &&
        [...chatUsers]
          .filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .sort(
            (a, b) =>
              new Date(b.lastMessage?.createdAt || 0) -
              new Date(a.lastMessage?.createdAt || 0)
          )
          .map((user) => {
            const lastMessage = user.lastMessage;
            const isMine =
              lastMessage?.sender?._id === currentUserId ||
              lastMessage?.sender === currentUserId;

            const isUnread =
              lastMessage &&
              lastMessage.read === false &&
              !isMine;

            return (
              <div
                className={`item ${activeUserId === user._id ? "active" : ""}`}
                key={user._id}
                onClick={() => handleSelectUser(user)}
              >
                <div className="avatar-wrapper">
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    crossOrigin="anonymous"
                  />
                  {user.isOnline && <div className="online-marker"></div>}
                </div>
                <div className="texts">
                  <span>{user.name}</span>
                  {lastMessage && (
                    <p
                      style={{
                        fontWeight: isUnread ? "bold" : "normal",
                      }}
                    >
                      {formatMessagePreview(lastMessage, user.name)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

      {/* Modal for searching and adding a new user to chat */}
      {searchMode && (
        <div className="modal-overlay" onClick={() => setSearchMode(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Start a New Chat</h2>
              <button
                className="close-button"
                onClick={() => setSearchMode(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-form">
                <input
                  type="text"
                  placeholder="Search user by name..."
                  value={modalSearchQuery}
                  onChange={(e) => {
                    setModalSearchQuery(e.target.value);
                    setSearchAttempted(false);
                  }}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleUserSearch()
                  }
                />
                <button onClick={handleUserSearch}>Search</button>
              </div>

              {/* Search results */}
              <div className="search-results">
                {searchResults.length > 0 ? (
                  searchResults
                    .filter((user) => !chatUsers.some((chatUser) => chatUser._id === user._id))
                    .map((user) => (
                      <div className="search-result" key={user._id}>
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          crossOrigin="anonymous"
                        />
                        <span>{user.name}</span>
                        <button className="add-user-button" onClick={() => handleAddUser(user)}>
                          Add
                        </button>
                      </div>
                    ))
                ) : (
                  searchAttempted && (
                    <div className="no-results">
                      No users found matching "{modalSearchQuery}"
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export the component
export default Chatlist;









