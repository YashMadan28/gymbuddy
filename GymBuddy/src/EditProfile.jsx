/*import React, { useRef, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import './Profile';
import default_image from './assets/default_image.jpg';*/
import React, { useRef, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { db, storage } from './firebase'; // Import Firestore & Storage
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import default_image from './assets/default_image.jpg';

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

/*import React, { useRef, useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { db, storage } from './firebase'; // Import Firestore & Storage
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import default_image from './assets/default_image.jpg';

const EditProfile = () => {
    const auth = getAuth();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [about, setAbout] = useState('');
    const navigate = useNavigate();

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handlePictureChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(URL.createObjectURL(selectedFile)); // Preview image
            setImageFile(selectedFile); // Save file for upload
        }
    };

    const handleSaveProfile = async () => {
        if (!auth.currentUser) {
            alert('You must be logged in to update your profile.');
            return;
        }

        const userId = auth.currentUser.uid;
        let imageUrl = file || default_image;

        try {
            // Upload Image if a new one is selected
            if (imageFile) {
                const storageRef = ref(storage, `profile_pictures/${userId}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            // Save Data to Firestore
            const userRef = doc(db, "users", userId);
            await setDoc(userRef, {
                name,
                age,
                gender,
                about,
                profilePicture: imageUrl
            });

            alert('Profile Updated!');
        } catch (error) {
            console.error("Error updating profile: ", error);
            alert("Failed to update profile.");
        }
    };

    return (
        <Box sx={{
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
                style={{ display: "none" }}
            />
            <div className="image-container">
                <img src={file || default_image} alt="Preview" className="profile-image" />
            </div>
            <Button variant="contained" color="primary" sx={{ marginTop: 2, marginBottom: 2 }} onClick={handleButtonClick}>
                Upload
            </Button>
            <Button variant="contained" color="secondary" sx={{ marginBottom: 2 }} onClick={() => navigate('/profile')}>
                Back
            </Button>
            <TextField label="Name" variant="outlined" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            <TextField label="Age" variant="outlined" fullWidth margin="normal" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter your age" />
            <TextField label="Gender" variant="outlined" fullWidth margin="normal" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Enter your gender" />
            <TextField label="About Me" variant="outlined" fullWidth margin="normal" value={about} onChange={(e) => setAbout(e.target.value)} placeholder="About Me" />
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleSaveProfile}>
                Save Changes
            </Button>
        </Box>
    );
};

export default EditProfile;*/
