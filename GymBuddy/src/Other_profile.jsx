import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Toolbar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import default_image from './assets/default_image.jpg';
import './editprofile.css';

const OtherProfile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userEmail, setUserEmail] = useState('');
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const profileFromState = location.state?.profileData;
        if (profileFromState) {
            setProfileData(profileFromState);
            setUserEmail(profileFromState.email || '');
        }
    }, [location.state]);

    if (!profileData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>Loading profile...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ justifyContent: 'center', maxWidth: 500, margin: 'auto', backgroundColor: 'default', padding: 3 }}>
            <Toolbar />
            <h2>{profileData.name}'s Profile</h2>

            <div className="image-container">
                <img src={profileData?.image || default_image} alt="Profile" className="profile-image" />
            </div>

            <Typography
                variant="h6"
                sx={{
                    textAlign: 'center',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    color: 'rgba(255, 255, 255, 0.7)'
                }}
            >
                {userEmail}
            </Typography>

            <Typography variant="h6" sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                Name: <span style={{ fontWeight: 'normal', color: 'text.primary' }}>
                    {profileData?.name}
                </span>
            </Typography>
            <Typography variant="h6" sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                Age: <span style={{ fontWeight: 'normal', color: 'text.primary' }}>
                    {profileData?.age}
                </span>
            </Typography>
            <Typography variant="h6" sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                Gender: <span style={{ fontWeight: 'normal', color: 'text.primary' }}>
                    {profileData?.gender}
                </span>
            </Typography>
            <Typography variant="h6" sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                Gym: <span style={{ fontWeight: 'normal', color: 'text.primary' }}>
                    {profileData?.gym}
                </span>
            </Typography>
            <Typography variant="h6" sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                About Me:<br />
                <Typography variant="body1" className="about-text" sx={{ fontWeight: 'normal' }}>
                    {profileData?.about}
                </Typography>
            </Typography>

            <br />
            <br />
            <div className="profileView">
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: 2 }}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
            </div>
        </Box>
    );
};

export default OtherProfile;

