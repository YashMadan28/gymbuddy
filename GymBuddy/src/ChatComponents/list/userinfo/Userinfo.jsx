import React, { useState, useEffect } from 'react';
import { fetchUserProfile } from '../../../services/profile-api';

import "./userinfo.css";

const Userinfo = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setProfile(userProfile);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    getUserProfile();
  }, []);

  if (!profile) return null;

  return (
    <div className="userinfo">
      <div className="user">
        <div className="avatar-wrapper">
          <img src={profile.profilePicture} alt={profile.name} />
          <div className="online-marker"></div>
        </div>
        <div className="name-position">
          <h2>{profile.name}</h2>
        </div>
      </div>
    </div>
  );
};

export default Userinfo;


