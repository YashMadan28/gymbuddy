/*import React, { useRef, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import './Profile';
import default_image from './assets/default_image.jpg';*/
/*import React, { useRef, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import default_image from './assets/default_image.jpg';
import { db } from "../firebase"; // Ensure firebase.js is correctly configured
import { doc, setDoc } from "firebase/firestore";

const EditProfile = () => {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [about, setAbout] = useState('');

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Triggers the file input click
    };

    const handlePictureChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(URL.createObjectURL(selectedFile)); // Preview image
        }
    };

    const navigate = useNavigate();

    const handleNameChange = (event) => setName(event.target.value);
    const handleAgeChange = (event) => setAge(event.target.value);
    const handleGenderChange = (event) => setGender(event.target.value);
    const handleAboutChange = (event) => setAbout(event.target.value);

    return (
        <Box sx = {{ 
                justifyContent: 'center', 
                maxWidth: 500, 
                margin: 'auto',
                marginTop: '0px',
                backgroundColor: 'white', 
                padding: 3
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

export default EditProfile;
*/
import React, { useRef, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import default_image from './assets/default_image.jpg';
import { db } from "./firebase"; // Ensure firebase.js is correctly configured
import { doc, setDoc } from "firebase/firestore"; // Import required Firestore functions
import { useAuth } from '../context/AuthContext'; // If you have an authentication context to track users

const EditProfile = () => {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [about, setAbout] = useState('');
    
    const { currentUser } = useAuth(); // Assuming you have auth context to get current user ID

    const handleButtonClick = () => {
        fileInputRef.current.click(); // Triggers the file input click
    };

    const handlePictureChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(URL.createObjectURL(selectedFile)); // Preview image
        }
    };

    const navigate = useNavigate();

    const handleNameChange = (event) => setName(event.target.value);
    const handleAgeChange = (event) => setAge(event.target.value);
    const handleGenderChange = (event) => setGender(event.target.value);
    const handleAboutChange = (event) => setAbout(event.target.value);

    const handleSaveProfile = async () => {
        if (!currentUser) {
            console.error("No user is logged in.");
            return;
        }

        // Create a reference to the user's profile document in Firestore
        const userProfileRef = doc(db, "users", currentUser.uid);

        try {
            // Set the document in Firestore
            await setDoc(userProfileRef, {
                name,
                age,
                gender,
                about,
                profilePicture: file || default_image, // Optionally handle file upload to storage
            });
            alert('Profile Updated!');
            navigate('/profile'); // Navigate back to profile page after save
        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to update profile.");
        }
    };

    return (
        <Box sx={{ justifyContent: 'center', maxWidth: 500, margin: 'auto', marginTop: '0px', backgroundColor: 'white', padding: 3 }}>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handlePictureChange}
                style={{ display: "none" }} // Hides the input
            />
            <div className="image-container">
                <img src={file || default_image} alt="Preview" className="profile-image" />
            </div>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2, marginBottom: 2 }}
                onClick={handleButtonClick} // Triggers file input
            >
                Upload
            </Button>
            <br />
            <br />
            <br />
            <Button
                variant="contained"
                color="secondary"
                sx={{ marginBottom: 2 }}
                onClick={() => navigate('/profile')}
            >
                Back
            </Button>
            <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={name}
                onChange={handleNameChange}
                placeholder="Enter your name"
            />
            <TextField
                label="Age"
                variant="outlined"
                fullWidth
                margin="normal"
                value={age}
                onChange={handleAgeChange}
                placeholder="Enter your age"
            />
            <TextField
                label="Gender"
                variant="outlined"
                fullWidth
                margin="normal"
                value={gender}
                onChange={handleGenderChange}
                placeholder="Enter your gender"
            />
            <TextField
                label="About Me"
                variant="outlined"
                fullWidth
                margin="normal"
                value={about}
                onChange={handleAboutChange}
                placeholder="About Me"
            />
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2 }}
                onClick={handleSaveProfile} // Calls the save function
            >
                Save Changes
            </Button>
        </Box>
    );
};

export default EditProfile;
