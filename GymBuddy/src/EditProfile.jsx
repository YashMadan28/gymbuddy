import React, { useRef, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import default_image from './assets/default_image.jpg';
const EditProfile = () => {
    const fileInputRef = useRef(null);

    const [file, setFile] = useState(null);

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Triggers the file input click
    };

    const handlePictureChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setProfileData((prevData) => ({
                ...prevData,
                image: selectedFile,
            }));
        }
    };

    const handleInputChange = (field, value) => {
        setProfileData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const navigate = useNavigate();

    return (
        <Box sx = {{ 
                justifyContent: 'center', 
                maxWidth: 500, 
                margin: 'auto',
                marginTop: '0px',
                backgroundColor: 'white', 
                padding: 3,
                alignItems: 'center',
                boxSizing: 'border-box'
            }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePictureChange}
                    style={{ display: "none" }} // Hides the input
                />
                <div className="image-container">
                  
                    <img 
                        src={file || default_image} 
                        alt="Preview" 
                        className="profile-image" 
                    />
                </div>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2,
                    marginBottom: 2
                 }}
                onClick={handleButtonClick} // Triggers file input
            >
                Upload
            </Button>
            <br/>
            <br/>
            <br/>
            <Button variant = "contained"
            color = "secondary"
            sx = {{ marginBottom: 2}}
            onClick = {() => navigate('/profile')}
            >
                Back
            </Button>
            <TextField
                label = "Name"
                variant = "outlined"
                fullWidth
                margin = "normal"
                value = {profileData.name}
                onChange = {(e) => handleInputChange('name', e.target.value)}
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
                value = {profileData.age}
                onChange = {(e) => handleInputChange('age', e.target.value)}
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
                value = {profileData.gender}
                onChange = {(e) => handleInputChange('gender', e.target.value)}
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
                value = {profileData.about}
                onChange = {(e) => handleInputChange('about', e.target.value)}
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
                onClick = {() => navigate('/profile')}
            >
                Save Changes
            </Button>
        </Box>
    );
};

export default EditProfile;
