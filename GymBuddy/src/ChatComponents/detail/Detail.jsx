import React from "react";
import "./detail.css";
import { useNavigate } from "react-router-dom";
import { profiles } from '../../../src/profiles';

const Detail = () => {
  const navigate = useNavigate();

  const profile = profiles.find(p => p.name === "Austin Smith");

  const handleViewProfile = () => {
    if (profile) {
      navigate('/other_profile', { state: { profileData: profile } });
    } else {
      console.error("Profile not found");
    }
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={profile?.image || "./avatar.png"} alt={profile?.name || "User"} />
        <h2>{profile?.name || "User"}</h2>
        <p>Active Now</p>
      </div>
      <div className="button-container">
        <button className="viewprofile-button" onClick={handleViewProfile}>
          View Profile
        </button>
      </div>
    </div>
  );
};

export default Detail;

