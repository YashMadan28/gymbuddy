import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Toolbar,
  Avatar,
  Paper
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUsersByGym } from './services/profile-api';
import { motion } from 'framer-motion';
import axios from './services/axios';
import { getAuth } from 'firebase/auth';

function Matches() {

  const navigate = useNavigate();
  const location = useLocation();

  // State for storing matched user profiles and current user ID
  const [profiles, setProfiles] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract selected gym location from route state
  const { location: gymLocation } = location.state || {};

  // Fetch user and matched profiles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          navigate('/login');
          return;
        }

        const token = await firebaseUser.getIdToken();

        // Get MongoDB user ID
        const res = await axios.get(`/api/users/${firebaseUser.uid}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setCurrentUserId(res.data._id);

        // Fetch users who go to the same gym
        const response = await fetchUsersByGym({
          gym_display: gymLocation.fullGymString
        });

        if (response.success) {
          setProfiles(response.data || []);
        } else {
          setError(response.message || 'Failed to load matches');
        }
      } catch (err) {
        console.error('Error in Matches:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Redirect if no gym selected
    if (!gymLocation?.fullGymString) {
      navigate('/FindGymBuddy');
      return;
    }

    fetchData();
  }, [gymLocation, navigate]);

  // Navigate to selected user's profile
  const handleViewProfile = (profile) => {
    navigate(`/profile/${profile._id}`);
  };

  // Start a chat with the selected user
  const handleMessage = async (profile) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUserId) throw new Error('User not authenticated');

      const token = await currentUser.getIdToken();

      // Add chat partner to chat list
      await axios.post(
        '/api/chatlist/add',
        {
          userId: currentUserId,
          partnerId: profile._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Navigate to messages screen with recipient pre-selected
      navigate('/messages', {
        state: { recipientId: profile._id }
      });
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  // If no gym location, return nothing
  if (!gymLocation) return null;

  return (
    <Box sx={{ padding: '24px 16px 16px', maxWidth: 1100, margin: 'auto' }}>
      <Toolbar />

      {/* Header text */}
      <Typography
        variant="h5"
        align="center"
        sx={{
          fontWeight: 'bold',
          color: '#fff',
          mb: 3,
        }}
      >
        {loading ? 'Loading Matches...' : `${profiles.length} User${profiles.length !== 1 ? 's' : ''} Found`}
      </Typography>

      {/* Loading spinner */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error message */}
      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          Error: {error}
        </Typography>
      )}

      {/* User list when not loading and no error */}
      {!loading && !error && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          {profiles.map((profile, index) => (
            <motion.div
              key={profile._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              {/* User profile card */}
              <Paper
                elevation={3}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                  borderRadius: 4,
                  backgroundColor: '#1e1e1e',
                  color: 'white',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 0 16px rgba(255,255,255,0.25)'
                  }
                }}
              >
                <Avatar
                  src={profile.profilePicture}
                  alt={profile.name}
                  sx={{
                    width: 120,
                    height: 120,
                    mr: 4,
                    border: '2px solid white',
                    boxShadow: 3
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                    {profile.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ccc' }}>
                    Age: {profile.age || 'Not specified'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#ccc' }}>
                    Gender: {profile.gender || 'Not specified'}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: profile.isOnline ? '#4caf50' : '#999',
                      fontWeight: 600,
                      mt: 1,
                      mb: 2
                    }}
                  >
                    {profile.isOnline ? 'Active now' : 'Offline'}
                  </Typography>

                  {/* View Profile and Message buttons */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewProfile(profile)}
                      size="medium"
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => handleMessage(profile)}
                      size="medium"
                      sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}
                    >
                      Message
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          ))}

          {/* Message when no users are matched */}
          {profiles.length === 0 && (
            <Typography
              sx={{
                color: '#ccc',
                textAlign: 'center',
                mt: 5,
                fontStyle: 'italic'
              }}
            >
              No users found at this gym. Be the first to check in!
            </Typography>
          )}
        </Box>
      )}

      {/* Back button */}
      {!loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <div className="profileView">
            <Button
              variant="contained"
              sx={{ mb: 2, mt: 3 }}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>
        </Box>
      )}
    </Box>
  );
}

export default Matches;

































