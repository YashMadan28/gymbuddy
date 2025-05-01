import "./detail.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Detail component shows profile details of the selected chat user.
 * Includes options to view profile or delete them from the chat list.
 */

const Detail = ({ selectedUser, onDeleteUser }) => {

  // State for showing the delete confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // Render fallback UI if no user is selected
  if (!selectedUser) return <div className="detail">No user selected</div>;

  // Handle deleting the user from chat list
  const handleDelete = () => {
    onDeleteUser(selectedUser._id);
    setShowConfirm(false);
  };

  // Navigate to the selected user's public profile
  const handleViewProfile = () => {
    navigate(`/profile/${selectedUser._id}`);
  };

  return (
    <div className="detail">
      {/* User profile summary */}
      <div className="user">
        <img
          src={selectedUser.profilePicture}
          alt={selectedUser.name}
        />
        <h2>{selectedUser.name}</h2>
        <p>{selectedUser.isOnline ? "Active Now" : "Offline"}</p>
      </div>

      {/* Action buttons */}
      <div className="button-container">
        <button className="viewprofile-button" onClick={handleViewProfile}>
          View Profile
        </button>
        <button
          className="deleteuser-button"
          onClick={() => setShowConfirm(true)}
        >
          Delete User
        </button>
      </div>

      {/* Confirmation modal for deleting user */}
      {showConfirm && (
        <div className="confirm-overlay" onClick={() => setShowConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure you want to delete this user from your chat list?</h3>
            <p className="note">
              <strong>Note:</strong> This will not delete the message history between you and this user.
            </p>
            <div className="confirm-buttons">
              <button className="cancel-button" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-delete-button" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;









