import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { Typography, Button, Box, Toolbar } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import './editprofile.css';
import { fetchUserProfile, fetchOtherUserProfile } from './services/profile-api';

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // If userId exists in URL, we're viewing someone else's profile
  const { userId } = useParams();

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: '',
    age: '',
    gender: '',
    gym: '',
    about: '',
    profilePicture: ''
  });

  // Track loading state
  const [loading, setLoading] = useState(true);
  // Track error state
  const [error, setError] = useState(null);

  // Determine whether the user is viewing their own profile or someone else's
  const isOwnProfile = !userId;

  // Fetch profile data on mount or when userId changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // If viewing someone else's profile, fetch with userId
        const data = userId
          ? await fetchOtherUserProfile(userId)
          : await fetchUserProfile(); // Otherwise, fetch current user's profile

        // Update state with profile data
        setProfileData({
          name: data?.name || '',
          age: data?.age || '',
          gender: data?.gender || '',
          gym: data?.gym || '',
          about: data?.about || '',
          profilePicture: data?.profilePicture || '',
          ...(isOwnProfile && { email: data?.email || '' })
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setError("Profile not found or inaccessible.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  // Display loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  // Display error state
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography color="error" variant="h6" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ justifyContent: 'center', maxWidth: 500, margin: 'auto', padding: 3 }}>
      <Toolbar /> {/* App bar spacer */}
      <h2>{isOwnProfile ? "Your Profile" : `${profileData.name}'s Profile`}</h2>

      {/* Edit Profile button if viewing own profile */}
      {isOwnProfile && (
        <div className="profileView">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/profile/edit', {
              state: { profileData }
            })}
          >
            Edit Profile
          </Button>
        </div>
      )}

      {/* Profile image */}
      <div className="image-container">
        <img
          src={profileData.profilePicture}
          alt="Profile"
          className="profile-image"
        />
      </div>

      {/* Show email if it's the user's own profile */}
      {isOwnProfile && profileData.email && (
        <Typography variant="h6" sx={{ textAlign: 'center', py: 2 }}>
          {profileData.email}
        </Typography>
      )}

      {/* Display profile fields */}
      <ProfileField label="Name" value={profileData.name} />
      <ProfileField label="Age" value={profileData.age} />
      <ProfileField label="Gender" value={profileData.gender} />
      <ProfileField label="Gym" value={profileData.gym} />

      {/* About Me section */}
      <Typography variant="h6" sx={{ pt: 2, pb: 1 }}>
        About Me:
      </Typography>
      <Typography variant="body1">
        {profileData.about || 'Not specified'}
      </Typography>

      {/* Back button (to home if own profile, or back to previous page) */}
      <div className="profileView">
        <Button
          variant="contained"
          sx={{ mb: 2, mt: 3 }}
          onClick={() => navigate(isOwnProfile ? '/home' : -1)}
        >
          Back
        </Button>
      </div>
    </Box>
  );
};

// Reusable component for displaying individual profile fields
const ProfileField = ({ label, value }) => (
  <Typography variant="h6" sx={{ py: 1 }}>
    {label}:{' '}
    <span style={{ fontWeight: 'normal' }}>
      {value || 'Not specified'}
    </span>
  </Typography>
);

export default Profile;






