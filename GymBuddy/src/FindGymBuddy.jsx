import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, MenuItem, Typography, CircularProgress } from '@mui/material';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import './FindGymBuddy.css';

// List of US states for dropdown selection
const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

const FindGymBuddy = () => {
  // Form input and validation state
  const [formData, setFormData] = useState({ gymName: '', city: '', state: '' });
  const [errors, setErrors] = useState({ gymName: false, city: false, state: false });

  // State for fetched locations and map interaction
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Loading and submission state
  const [loading, setLoading] = useState(false);
  // Track if the form has been submitted
  const [submitted, setSubmitted] = useState(false); 
  // State to control the confirmation dialog window
  const [openDialog, setOpenDialog] = useState(false);

  // Navigation
  const navigate = useNavigate();

  // Use the useLoadScript hook to load the Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    // My API key
    googleMapsApiKey: "AIzaSyDLdljkfHKd8Htb9s_JiXqjDLPWWiPWlZ0",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Makes sure the user can't submit an empty form and throws errors if they try to
    const newErrors = {
      gymName: formData.gymName.trim() === '',
      city: formData.city.trim() === '',
      state: formData.state.trim() === '',
    };


    setErrors(newErrors);

    if (!newErrors.gymName && !newErrors.city && !newErrors.state) {
      console.log('Submitted Data:', formData);
      alert('Form submitted successfully!');
      
      // Start loading state
      setLoading(true);
      setLocation(null); // Reset location to ensure the map is cleared before fetching new data
      setAddress(''); // Reset address

      // Set the submitted flag to true to show the "Gym location not found" message if applicable
      setSubmitted(true);

      // Use the Geocoding API to get the latitude and longitude of the gym
      const address = `${formData.gymName}, ${formData.city}, ${formData.state}`;
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDLdljkfHKd8Htb9s_JiXqjDLPWWiPWlZ0`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'OK' && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            const formattedAddress = data.results[0].formatted_address;
            // Set the location for the map
            setLocation(location); 
            // Set the address for the marker tooltip
            setAddress(formattedAddress);
          } else {
            alert('Gym location not found.');
            // Clear location if not found
            setLocation(null);
            // Clear address 
            setAddress(''); 
          }
        })
        .catch(error => {
          console.error('Error fetching the geolocation:', error);
          alert('Error fetching location data.');
        })
        .finally(() => {
          // Stop loading state once the API call finishes (success or error)
          setLoading(false);
        });
    }
  };

  // Handle marker click
  const handleMarkerClick = () => {
    // Opens the confirmation dialog window
    setOpenDialog(true);
  };

  // Handle confirmation from the dialog
  const handleConfirm = () => {
    // Closes the confirmation dialog window
    setOpenDialog(false);
    // Navigate to the Matches page and pass the gym coordinates
    navigate('/Matches');
};

  // Handle cancellation from the dialog
  const handleCloseDialog = () => {
    // Close the dialog
    setOpenDialog(false);
    alert('Please adjust the search and try again.');
  };

  // Handle errors while loading the Google Maps API
  if (loadError) {
    return <Typography variant="h6" color="error">Error loading Google Maps API.</Typography>;
  }

  // Show a loading spinner while the Google Maps API is being loaded
  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Background image */}
      <div className="backdrop-image" />

      {/* Scrollable container for form and results */}
      <div className="scroll-container">
        <Box
          className="glass-effect"
          sx={{
            padding: '20px',
            maxWidth: '650px',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            marginTop: '50px',
            overflow: 'hidden',
            color: 'white'
          }}
        >
          {/* Page heading */}
          <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
            Find Gym Buddy
          </Typography>

          {/* Form for gym input */}
          <form onSubmit={handleSubmit}>
            {/* Gym name field */}
            <TextField
              label="Gym Name"
              name="gymName"
              value={formData.gymName}
              onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
              error={errors.gymName}
              helperText={errors.gymName ? 'Gym name is required' : ''}
              fullWidth
              margin="normal"
              sx={{
                input: { color: 'white' },
                label: { color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: 'white' } },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(255,255,255,0.7)'
                }
              }}
            />

            {/* City field */}
            <TextField
              label="City"
              name="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              error={errors.city}
              helperText={errors.city ? 'City is required' : ''}
              fullWidth
              margin="normal"
              sx={{
                input: { color: 'white' },
                label: { color: 'rgba(255,255,255,0.7)', '&.Mui-focused': { color: 'white' } },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(255,255,255,0.7)'
                }
              }}
            />

            {/* State select field */}
            <TextField
              label="State"
              name="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              error={errors.state}
              helperText={errors.state ? 'State is required' : ''}
              select
              fullWidth
              margin="normal"
              sx={{
                '& .MuiSelect-select': { color: 'white' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiSvgIcon-root': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(255,255,255,0.7)'
                }
              }}
            >
              {states.map((state) => (
                <MenuItem key={state} value={state} sx={{ color: 'black' }}>
                  {state}
                </MenuItem>
              ))}
            </TextField>

            {/* Form buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '10px' }}>
              <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
                Back
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Search
              </Button>
            </Box>
          </form>

      {/* Show a loading spinner while waiting for the API response */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Show message above the map when a location is available */}
    {location && (
        <Typography 
        variant="h6" 
        sx={{ 
        textAlign: 'center', 
        marginTop: 2, 
        fontWeight: '500',
        color: 'black' 
        }}
    >
        Select the correct location
    </Typography>
    )}

      {/* Render the Google Map if location is available */}
      {location && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={location}
          zoom={12}
        >
          <Marker 
            position={location} 
            onClick={handleMarkerClick}
            // Show the address as a tooltip when hovering over the marker
            title={address}
          />
        </GoogleMap>
      )}
      {/* If location is not found after submission */}
      {submitted && location === null && !loading && (
        <Typography variant="h6" color="error" sx={{ textAlign: 'center', marginTop: 2 }}>
          Gym location not found. Please check the details.
        </Typography>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Is this the correct location?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            No
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </div>
    </>
  );
};

export default FindGymBuddy;