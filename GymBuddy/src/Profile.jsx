import React from 'react';
import { Typography, Button, Box, Toolbar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import default_image from './assets/default_image.jpg';
import './EditProfile.css';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();

    /* Get the profile data (profile data is defined in app.jsx) passed from either the Profile
     button in the App Bar, Back or Save Changes button in EditProfile,
     or from the Matches page */
    const { profileData, isOwnProfile} = location.state || {};  

    return (
        <Box sx={{ justifyContent: 'center', maxWidth: 500, margin: 'auto', backgroundColor: 'default', padding: 3 }}>
            <Toolbar /> 
            {/* Conditionally render the name based on if user is viewing their own profile or another persons */}
            <h2>{isOwnProfile? "Your Profile" : `${profileData?.name}'s Profile`}</h2>

            {isOwnProfile&& (
                <div className = "profileView" >
                    <Button variant="contained" color="primary" onClick={() => navigate('/profile/edit')}>
                        Edit Profile
                    </Button>
                </div>
            )}

            <div className="image-container">
                <img src={profileData?.image || default_image} alt="Profile" className="profile-image" />
            </div>

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
                About Me:<br/> <Typography variant="body1" className="about-text" sx={{ fontWeight: 'normal' }}>
                                {profileData?.about}
                                </Typography>
            </Typography>
            <br />
            <br />
            <div className = "profileView">
                <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ marginBottom: 2 }}
                    /* If user is viewing their own profile and clicks on Back button, takes them to home page.
                        Otherwise, if user was viewing someone else's profile and clicks on Back button,
                        takes them back to the Matches page */
                    onClick={() => navigate(isOwnProfile? '/' : '/matches')}
                >
                    Back
                </Button>
            </div>
        </Box>
    );
};

export default Profile;


