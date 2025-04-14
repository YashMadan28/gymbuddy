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