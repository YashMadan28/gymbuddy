import React, { useRef, useState, useEffect } from "react";
import { auth } from './firebase';
import { TextField, Button, Box, Toolbar, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import default_image from "./assets/default_image.jpg";
import EditGymPopup from './EditGymPopup';
import { updateUserProfile, fetchUserProfile } from './services/profile-api';
import axios from './services/axios';
import "./editprofile.css";

const EditProfile = () => {
  // Navigation and routing
  const navigate = useNavigate();
  const location = useLocation();

  // Refs and UI state
  const fileInputRef = useRef(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Editable profile state
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    age: '',
    gender: '',
    gym: '',
    about: '',
    profilePicture: default_image,
  });

  // Gender select dropdown options
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
  ];

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const data = location.state?.profileData || await fetchUserProfile();
        setEditedProfile({
          name: data?.name || '',
          age: data?.age || '',
          gender: data?.gender || '',
          gym: data?.gym?.display || data?.gym || '',
          about: data?.about || '',
          profilePicture: data?.profilePicture || default_image,
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        navigate('/profile');
      }
    };

    loadProfileData();
  }, [location.state, navigate]);

  // Save profile data to backend
  const handleSaveChanges = async () => {
    setFormSubmitted(true);

    try {
      setLoading(true);
      setError(null);

      if (!auth.currentUser) {
        throw new Error('No authenticated user found');
      }

      // Validation
      if (!editedProfile.name?.trim()) {
        setError('Name is required');
        return;
      }

      if (isNaN(editedProfile.age) || editedProfile.age < 13 || editedProfile.age > 120) {
        setError('Age must be between 13 and 120');
        return;
      }

      let profilePictureURL = editedProfile.profilePicture;

      // Upload image if new file was selected
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append("profileImage", selectedImageFile);

        const uploadRes = await axios.post(`/api/users/${auth.currentUser.uid}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        profilePictureURL = uploadRes.data.imageUrl;
      }

      // Prepare updated profile payload
      const updatedData = {
        name: editedProfile.name,
        age: parseInt(editedProfile.age),
        gender: editedProfile.gender,
        gym: {
          display: editedProfile.gym?.trim()
        },
        about: editedProfile.about,
        profilePicture: profilePictureURL
      };

      // Send update request
      await updateUserProfile(auth.currentUser.uid, updatedData);

      // Navigate to profile view with updated data
      navigate("/profile", { state: { profileData: updatedData }, replace: true });

    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle profile picture file selection
  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const previewURL = URL.createObjectURL(file);
      setEditedProfile(prev => ({ ...prev, profilePicture: previewURL }));
    }
  };

  // Save selected gym from popup
  const handleSaveGym = (selectedGym) => {
    setEditedProfile(prev => ({
      ...prev,
      gym: `${selectedGym.gymName}, ${selectedGym.address}`,
    }));
    setEditDialogOpen(false);
  };

  // Update individual form fields
  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  // Navigate back without saving
  const handleBackClick = () => {
    navigate("/profile", { replace: true });
  };

  // Reusable styles for form fields
  const fieldStyle = {
    marginTop: 2,
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.6)",
      "&.Mui-focused": { color: "rgba(255, 255, 255, 0.8)" }
    },
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.5)" },
      "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.7)", borderWidth: "1px" },
      "&.Mui-focused fieldset": { borderColor: "rgba(255, 255, 255, 0.9)", borderWidth: "2px" }
    },
    "& .MuiInputBase-input::placeholder": { color: "rgba(255, 255, 255, 0.4)" },
    "& .MuiFormHelperText-root": { color: "white !important" }
  };

  return (
    <Box sx={{ justifyContent: "center", maxWidth: 500, margin: "auto", padding: 3, color: "white" }}>
      <Toolbar />

      {/* Profile picture preview */}
      <div className="image-container">
        <img
          src={editedProfile.profilePicture}
          className="profile-image"
          alt="Profile"
          onError={(e) => { e.target.src = default_image; }}
        />
      </div>

      {/* Profile picture upload button */}
      <div className="upload-button-container">
        <div className="input-div" onClick={handleButtonClick}>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handlePictureChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="icon">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
        </div>
      </div>

      {/* Back button */}
      <div className="profileView">
        <Button variant="contained" color="secondary" sx={fieldStyle} onClick={handleBackClick}>
          Back
        </Button>
      </div>

      {/* Name input */}
      <TextField
        label="Name"
        variant="outlined"
        fullWidth
        sx={fieldStyle}
        value={editedProfile.name}
        onChange={(e) => handleInputChange("name", e.target.value)}
        error={formSubmitted && !editedProfile.name?.trim()}
        helperText={formSubmitted && !editedProfile.name?.trim() ? "Name is required" : ""}
      />

      {/* Age input */}
      <TextField
        label="Age"
        variant="outlined"
        fullWidth
        sx={fieldStyle}
        value={editedProfile.age}
        onChange={(e) => handleInputChange("age", e.target.value)}
        error={formSubmitted && (isNaN(editedProfile.age) || editedProfile.age < 13 || editedProfile.age > 120)}
        helperText={formSubmitted && (isNaN(editedProfile.age) || editedProfile.age < 13 || editedProfile.age > 120) ? "Age must be between 13 and 120" : ""}
      />

      {/* Gender select input */}
      <FormControl fullWidth sx={fieldStyle}>
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          value={editedProfile.gender || ''}
          onChange={(e) => handleInputChange("gender", e.target.value)}
          label="Gender"
          sx={{ color: "white", textAlign: 'left' }}
        >
          {genderOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Gym field (when clicked, will open gym search popup) */}
      <TextField
        label="Gym"
        variant="outlined"
        fullWidth
        sx={fieldStyle}
        value={editedProfile.gym}
        onClick={() => setEditDialogOpen(true)}
        inputProps={{ readOnly: true }}
      />

      {/* Gym search popup */}
      <EditGymPopup
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSaveGym}
        initialData={{
          gymName: editedProfile.gym.split(',')[0] || '',
          city: '',
          state: ''
        }}
      />

      {/* About Me textbox */}
      <TextField
        label="About Me"
        variant="outlined"
        fullWidth
        sx={fieldStyle}
        value={editedProfile.about}
        onChange={(e) => handleInputChange("about", e.target.value)}
        multiline
        rows={4}
      />

      {/* Save button */}
      <div className="profileView">
        <Button
          variant="contained"
          color="primary"
          sx={{ ...fieldStyle, marginBottom: 2, color: "white" }}
          onClick={handleSaveChanges}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Error message display */}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

export default EditProfile;
