import React, { useState } from 'react';
import { profiles } from './profiles';
import { Box, Button, Typography, TextField, Dialog, DialogActions, DialogContent, IconButton, Toolbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

function Matches() {
    const navigate = useNavigate();

    // Navigate to the selected person's profile page
    const handleViewProfile = (profileData) => {
        navigate('/other_profile', { state: { profileData } });
    };
    const numberOfProfiles = profiles.length;

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
                {numberOfProfiles} Matches Found
            </Typography>

            {/* Shows list of profiles */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                maxHeight: '80vh',
                overflowY: 'auto',
            }}>
                {profiles.map((profile) => (
                    <Box key={profile.id} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 1,
                        border: '1px solid #ddd',
                        borderRadius: 2,
                        boxShadow: 2,
                        backgroundColor: 'white',
                    }}>
                        {/* Profile image */}
                        <img 
                            src={profile.image || '/path/to/default-image.jpg'}
                            alt={profile.name}
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                objectFit: 'cover'
                            }}
                        />

                        {/* Profile info and the 2 buttons */}
                        <Box sx={{ marginLeft: 2, flex: 1 }}>
                            <Box sx={{ fontWeight: 'bold', marginBottom: 1, color: 'black' }}>
                                {profile.name}
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <Button 
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleViewProfile(profile)}
                                    sx={{ marginRight: 2 }}
                                    size="small"
                                >
                                    View Profile
                                </Button>
                                <Button 
                                    variant="contained"
                                    color="primary"
                                    onClick={() => navigate("/messages")}
                                    size="small"
                                >
                                    Message
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

export default Matches;























