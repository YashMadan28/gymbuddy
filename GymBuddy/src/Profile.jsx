import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [about, setAbout] = useState('');

    const navigate = useNavigate();

    const handleNameChange = (event) => setName(event.target.value);
    const handleAgeChange = (event) => setAge(event.target.value)
    const handleGenderChange = (event) => setGender(event.target.value);
    const handleAboutChange = (event) => setAbout(event.target.value)

    return (
        <Box sx = {{ 
                justifyContent: 'center', 
                maxWidth: 500, 
                margin: 'auto', 
                padding: 3 
            }}>
            <h2>Edit Profile</h2>
            <Button variant = "contained"
            color = "secondary"
            sx = {{ marginBottom: 2}}
            onClick = {() => navigate('/')}
            >
                Back
            </Button>
            <TextField
                label = "Name"
                variant = "outlined"
                fullWidth
                margin = "normal"
                value = {name}
                onChange = {handleNameChange}
                sx = {{
                    '& .MuiInputBase-input::placeholder': {
                        color: 'white',
                        opacity: 1,
                    },
                }}
                placeholder = "Enter your name"
            />
            <TextField
                label = "Age"
                variant = "outlined"
                fullWidth
                margin = "normal"
                value = {age}
                onChange = {handleAgeChange}
                sx = {{
                    '& .MuiInputBase-input::placeholder': {
                        color: 'white',
                        opacity: 1,
                    },
                }}
                placeholder = "Enter your age"
            />
            <TextField
                label = "Gender"
                variant = "outlined"
                fullWidth
                margin = "normal"
                value = {gender}
                onChange = {handleGenderChange}
                sx = {{
                    '& .MuiInputBase-input::placeholder': {
                        color: 'white',
                        opacity: 1,
                    },
                }}
                placeholder = "Enter your gender"
            />
            <TextField
                label = "About Me"
                variant = "outlined"
                fullWidth
                margin = "normal"
                value = {about}
                onChange = {handleAboutChange}
                sx = {{
                    '& .MuiInputBase-input::placeholder': {
                        color: 'white',
                        opacity: 1,
                    },
                }}
                placeholder = "About Me"
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