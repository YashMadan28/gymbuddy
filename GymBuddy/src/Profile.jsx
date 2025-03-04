import React, { useRef, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import default_image from './assets/default_image.jpg';


const Profile = () => {

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