import React, { useRef, useState, useEffect } from "react";
import { auth } from './firebase';
import { TextField, Button, Box, Toolbar, Typography, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import default_image from "./assets/default_image.jpg";
import EditGymPopup from './EditGymPopup';
import { updateUserProfile, fetchUserProfile } from './services/profile-api';
import "./editprofile.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditProfile = () => {
  // Navigation and state management hooks
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const storage = getStorage();
  const fileInputRef = useRef(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Profile data state with default values
  const [editedProfile, setEditedProfile] = useState({
    name: '',
    age: '',
    gender: '',
    gym: '',
    about: '',
    profilePicture: default_image,
    gymPlaceId: ''
  });

  // Gender options for dropdown
  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' }
  ];

  // Load profile data on component mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Get profile data from navigation state or API
        const data = location.state?.profileData || await fetchUserProfile();
        setEditedProfile({
          name: data?.name || '',
          age: data?.age || '',
          gender: data?.gender || '',
          gym: data?.gym?.display || data?.gym || '',
          about: data?.about || '',
          profilePicture: data?.profilePicture || default_image,
          gymPlaceId: data?.gym?.place_id || ''
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        navigate('/profile');
      }
    };

    loadProfileData();
  }, [location.state, navigate]);

  // Handle saving profile changes
  const handleSaveChanges = async () => {
    setFormSubmitted(true);

    try {
      setLoading(true);
      setError(null);

      // Validate user authentication
      if (!auth.currentUser) {
        throw new Error('No authenticated user found');
      }

      // Validate required fields
      if (!editedProfile.name?.trim()) {
        setError('Name is required');
        return;
      }
      if (isNaN(editedProfile.age) || editedProfile.age < 13 || editedProfile.age > 120) {
        setError('Age must be between 13 and 120');
        return;
      }

      // Handle image upload if new image selected
      let profilePictureURL = editedProfile.profilePicture;
      if (selectedImageFile) {
        const imageRef = ref(storage, `profile_images/${auth.currentUser.uid}/${selectedImageFile.name}`);
        await uploadBytes(imageRef, selectedImageFile);
        profilePictureURL = await getDownloadURL(imageRef);
      }

      // Prepare updated profile data
      const updatedData = {
        name: editedProfile.name,
        age: parseInt(editedProfile.age),
        gender: editedProfile.gender,
        gym: {
          display: editedProfile.gym,
          place_id: editedProfile.gymPlaceId
        },
        about: editedProfile.about,
        profilePicture: profilePictureURL
      };

      // Update profile and navigate back
      await updateUserProfile(auth.currentUser.uid, updatedData);
      navigate("/profile", { state: { profileData: updatedData }, replace: true });
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.message || 'Failed to save changes');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile picture upload
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const previewURL = URL.createObjectURL(file);
      setEditedProfile(prev => ({ 
        ...prev, 
        profilePicture: previewURL 
      }));
    }
  };

  // Handle gym selection from popup
  const handleSaveGym = (selectedGym) => {
    setEditedProfile(prev => ({
      ...prev,
      gym: `${selectedGym.gymName}, ${selectedGym.address}`,
      gymPlaceId: selectedGym.place_id
    }));
    setEditDialogOpen(false);
  };

  // Generic input change handler
  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Navigation back to profile
  const handleBackClick = () => {
    navigate("/profile", { replace: true });
  };

  // Styling for form fields
  const fieldStyle = {
    marginTop: 2,
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.6)",
      "&.Mui-focused": {
        color: "rgba(255, 255, 255, 0.8)"
      },
    },
    "& .MuiOutlinedInput-root": {
      color: "white",
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
    "& .MuiFormHelperText-root": {
      color: "white !important",
    },
  };

  return (
    <Box sx={{ justifyContent: "center", maxWidth: 500, margin: "auto", padding: 3, color: "white" }}>
      <Toolbar />

      {/* Profile picture section */}
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

      {/* Profile form fields */}
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

      {/* Gender dropdown */}
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

      {/* Gym field with popup */}
      <TextField
        label="Gym"
        variant="outlined"
        fullWidth
        sx={fieldStyle}
        value={editedProfile.gym}
        onClick={() => setEditDialogOpen(true)}
        inputProps={{ readOnly: true }}
      />

      {/* Gym selection popup */}
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

      {/* About me textarea */}
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

      {/* Save changes button */}
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

      {/* Error display */}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Box>
  );
};

export default EditProfile;







