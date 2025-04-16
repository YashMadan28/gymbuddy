import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Toolbar, Avatar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUsersByGym } from './services/profile-api';

function Matches() {
    const navigate = useNavigate();
    const location = useLocation();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get the location data passed from FindGymBuddy
    const { location: gymLocation } = location.state || {};

    useEffect(() => {
        if (!gymLocation?.place_id) {
            navigate('/FindGymBuddy');
            return;
        }

        const loadMatches = async () => {
            try {
                setLoading(true);
                const response = await fetchUsersByGym({ 
                    place_id: gymLocation.place_id 
                });
                
                if (response.success) {
                    setProfiles(response.data || []);
                } else {
                    setError(response.message || 'Failed to load matches');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadMatches();
    }, [gymLocation, navigate]);

    const handleViewProfile = (profile) => {
        navigate('/other_profile', { 
            state: { 
                profileData: profile,
                userId: profile.firebaseUid 
            } 
        });
    };

    if (!gymLocation) {
        return null; // Will redirect anyway
    }

    return (
        <Box sx={{ padding: 3, maxWidth: 800, margin: 'auto' }}>
            <Toolbar />
            <Button 
                variant="contained" 
                color="secondary" 
                onClick={() => navigate('/FindGymBuddy')}
                sx={{ marginBottom: 3 }}
            >
                Back
            </Button>
            
            <Typography 
                variant="h5" 
                sx={{
                    fontWeight: 'bold', 
                    color: 'white',
                    marginBottom: 3,
                    marginTop: 4,
                }}
            >
                {loading ? 'Loading...' : `${profiles.length} Matches Found`}
            </Typography>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Box>
            )}

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    Error: {error}
                </Typography>
            )}

            {!loading && !error && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                }}>
                    {profiles.map((profile) => (
                        <Box key={profile.firebaseUid} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 2,
                            border: '1px solid #ddd',
                            borderRadius: 2,
                            boxShadow: 2,
                            backgroundColor: 'white',
                        }}>
                            <Avatar 
                                src={profile.profilePicture}
                                alt={profile.name}
                                sx={{ 
                                    width: 80, 
                                    height: 80,
                                    mr: 2 
                                }}
                            />

                            <Box sx={{ flex: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                    {profile.name}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Age: {profile.age || 'Not specified'}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Gender: {profile.gender || 'Not specified'}
                                </Typography>

                                <Box>
                                    <Button 
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleViewProfile(profile)}
                                        sx={{ mr: 2 }}
                                        size="small"
                                    >
                                        View Profile
                                    </Button>
                                    <Button 
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => navigate("/messages", { 
                                            state: { recipientId: profile.firebaseUid }
                                        })}
                                        size="small"
                                    >
                                        Message
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    ))}

                    {profiles.length === 0 && (
                        <Typography sx={{ color: 'white', textAlign: 'center' }}>
                            No matches found at this gym. Be the first to check in!
                        </Typography>
                    )}
                </Box>
            )}
        </Box>
    );
}

export default Matches;























