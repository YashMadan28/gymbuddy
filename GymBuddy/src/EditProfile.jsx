import React, { useRef, useState } from 'react';
import { TextField, Button, Box, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import default_image from './assets/default_image.jpg';
const EditProfile = () => {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(profileData.image || null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handlePictureChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setFile(imageUrl);
      setProfileData(prev => ({ ...prev, image: imageUrl }));
    }
  };

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [gymData, setGymData] = useState({
      gymName: '',
      city: '',
      state: '',
      location: null
    });
  
    const handleSaveGym = (newData) => {
      setGymData(newData);
      // save to the backend
      };

  const handleInputChange = (field, value) => {
    setProfileData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const navigate = useNavigate();

    return (
        <Box
            sx={{
                justifyContent: 'center',
                maxWidth: 500,
                margin: 'auto',
                backgroundColor: 'White',
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
                {/* Use default image if 'file' is null */}
                <img 
                    src={profileData.image || default_image} 
                    alt="Preview" 
                    className="profile-image" 
                />
            </div>
            <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 2, marginBottom: 2 }}
                onClick={handleButtonClick}
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
                onClick={() => navigate('/profile', { state: { isOwnProfile: true, profileData } })}
            >
                Back
            </Button>

            <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
                sx={{
                    '& .MuiInputBase-input::placeholder': {
                        color: 'white',
                        opacity: 1,
                    },
                }}
            />

      <TextField
        label="Age"
        variant="outlined"
        fullWidth
        margin="normal"
        value={profileData.age}
        onChange={(e) => handleInputChange("age", e.target.value)}
        placeholder="Enter your age"
        sx={{
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.6)", 
            "&.Mui-focused": {
              color: "rgba(255, 255, 255, 0.8)" 
            },
          },
          "& .MuiOutlinedInput-root": {
            color: "rgba(255, 255, 255, 0.9)",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.7)",
              borderWidth: "1px",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(255, 255, 255, 0.9) !important",
              borderWidth: "2px",
            },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(255, 255, 255, 0.4)",
          },
        }}
      />

      <TextField
        label="Gender"
        variant="outlined"
        fullWidth
        margin="normal"
        value={profileData.gender}
        onChange={(e) => handleInputChange("gender", e.target.value)}
        placeholder="Enter your gender"
        sx={{
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.6)",
            "&.Mui-focused": {
              color: "rgba(255, 255, 255, 0.8)"
            },
          },
          "& .MuiOutlinedInput-root": {
            color: "rgba(255, 255, 255, 0.9)",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.7)",
              borderWidth: "1px",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(255, 255, 255, 0.9) !important",
              borderWidth: "2px",
            },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(255, 255, 255, 0.4)",
          },
        }}
      />

      <TextField
        label="Gym"
        variant="outlined"
        fullWidth
        margin="normal"
        value={profileData.gym}
        onClick={() => setEditDialogOpen(true)}
        sx={{
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.6)",
            "&.Mui-focused": {
              color: "rgba(255, 255, 255, 0.8)"
            },
          },
          "& .MuiOutlinedInput-root": {
            color: "rgba(255, 255, 255, 0.9)",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.7)",
              borderWidth: "1px",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(255, 255, 255, 0.9) !important",
              borderWidth: "2px",
            },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(255, 255, 255, 0.4)",
          },
        }}
      />
      <EditGymDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveGym}
        initialData={{
          gymName: gymData.gymName,
          city: gymData.city,
          state: gymData.state
        }}
      />


      <TextField
        label="About Me"
        variant="outlined"
        fullWidth
        margin="normal"
        value={profileData.about}
        onChange={(e) => handleInputChange("about", e.target.value)}
        placeholder="About Me"
        sx={{
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.6)",
            "&.Mui-focused": {
              color: "rgba(255, 255, 255, 0.8)"
            },
          },
          "& .MuiOutlinedInput-root": {
            color: "rgba(255, 255, 255, 0.9)",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.7)",
              borderWidth: "1px",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(255, 255, 255, 0.9) !important",
              borderWidth: "2px",
            },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(255, 255, 255, 0.4)",
          },
        }}
      />
    <div className="profileView">
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={() =>
          navigate("/profile", { state: { isOwnProfile: true, profileData } })
        }
      >
        Save Changes
      </Button>
    </div>
    </Box>
  );
};

export default EditProfile;