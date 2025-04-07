import React, { useRef, useState } from "react";
import { TextField, Button, Box, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import default_image from "./assets/default_image.jpg";
import "./editprofile.css";
import EditGymDialog from './EditGymPopup';

const EditProfile = ({ profileData, setProfileData }) => {
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
        justifyContent: "center",
        maxWidth: 500,
        margin: "auto",
        padding: 3,
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <Toolbar />

      <div className="image-container">
        <img
          src={file || default_image}
          className="profile-image"
        />
      </div>
      
      <div className="upload-button-container">
        <div className="input-div" onClick={handleButtonClick}>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handlePictureChange}
          style={{ display: 'none' }}
          accept="image/*"
        />
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="1.5em"
  height="1.5em"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  className="icon"
>
  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
  <circle cx="12" cy="13" r="4"></circle>
</svg>
        </div>
      </div>
      <br />
      <br />
      <br />
      <div className="profileView">
      <Button
        variant="contained"
        color="secondary"
        sx={{ marginBottom: 2 }}
        onClick={() =>
          navigate("/profile", { state: { isOwnProfile: true, profileData } })
        }
      >
        Back
      </Button>
        </div>
<TextField
  label="Name"
  variant="outlined"
  fullWidth
  margin="normal"
  value={profileData.name}
  onChange={(e) => handleInputChange("name", e.target.value)}
  placeholder="Enter your name"
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
