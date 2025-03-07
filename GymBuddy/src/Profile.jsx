//import React, { useRef, useState } from 'react';
import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import default_image from './assets/default_image.jpg';
import './EditProfile.css';

const Profile = ({ profileData }) => {

    const navigate = useNavigate();

    return (
        <Box sx = {{ 
                justifyContent: 'center', 
                maxWidth: 500, 
                margin: 'auto',
                marginTop: '0px',
                backgroundColor: 'white', 
                padding: 3
            }}>
            <h2>Your Profile</h2>
            <Button variant = "contained"
            color = "primary"
            sx = {{ marginBottom: 2}}
            onClick = {() => navigate('/profile/edit')}
            >
             Edit Profile
            </Button>
            <br/>
            <div className = "image-container">
                <img
                    src = {profileData.image || default_image}
                    alt = "Profile"
                    className = "profile-image"
                />
            </div>
            <Typography 
                variant="h6"
                sx = {{
                    paddingTop: '10px',
                    paddingBottom: '10px'
                }}>Name: {profileData.name}</Typography>
            <Typography 
                variant="h6"
                sx = {{
                    paddingTop: '10px',
                    paddingBottom: '10px'
                }}>Age: {profileData.age}</Typography>
            <Typography 
                variant="h6"
                sx = {{
                    paddingTop: '10px',
                    paddingBottom: '10px'
                }}>Gender: {profileData.gender}</Typography>
            <Typography 
            variant="body1"
            className = "about-text"
            sx = {{
                maxWidth: '100%',
                wordWrap: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                paddingTop: '10px',
                paddingBottom: '10px'
            }}>About Me:<br /> {profileData.about}</Typography>
            <br/>
            <br/>
            <Button variant = "contained"
            color = "secondary"
            sx = {{ marginBottom: 2}}
            onClick = {() => navigate('/')}
            >
                Back
            </Button>
        </Box>
    );
};

export default Profile;