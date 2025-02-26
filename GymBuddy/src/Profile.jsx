import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const Profile = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [about, setAbout] = useState('');

    const handleNameChange = (event) => setName(event.target.value);
    const handleAgeChange = (event) => setAge(event.target.value)
    const handleAboutChange = (event) => setAbout(event.target.value)

    return (
        <Box sx = {{ maxWidth: 500, margin: 'auto', padding: 3 }}>
            <h2>Edit Profile</h2>
            <TextField
                label = "Name"
                variant = "outlined"
                fullWidth
                margin = "normal"
                value = {name}
                onChange = {handleNameChange}
            />
            <TextField
                label = "Age"
                variant = "outlined"
                fullWidth
                margin = "normal"
                value = {age}
                onChange = {handleAgeChange}
            />
            <TextField
                label = "About Me"
                variant = "outlined"
                fullWidth
                margin = "normal"
                value = {about}
                onChange = {handleAboutChange}
            />
            <Button
                variant = "contained"
                color = "primary"
                sx = {{ marginTop: 2 }}
                onClick = {() => alert('Profile Updated!')}
            >
                Save Changes
            </Button>
        </Box>
    );
};

export default Profile;