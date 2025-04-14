import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, MenuItem, Typography, CircularProgress } from '@mui/material';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import './FindGymBuddy.css';

// List of US states for dropdown
const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

const FindGymBuddy = () => {
  // Form state management
  const [formData, setFormData] = useState({
    gymName: '',
    city: '',
    state: '',
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({
    gymName: false,
    city: false,
    state: false,
  });

  // Location search results
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); 

  const navigate = useNavigate();

  // Google Maps API loading status
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDLdljkfHKd8Htb9s_JiXqjDLPWWiPWlZ0",
  });

  // Handle form submission to search for gyms
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare payload with trimmed values
    const payload = {
      gymName: formData.gymName.trim(),
      city: formData.city.trim(),
      state: formData.state.trim()
    };
  
    // Validate form fields
    const newErrors = {
      gymName: !payload.gymName,
      city: !payload.city,
      state: !payload.state
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
  
    try {
      setLoading(true);
      setLocations([]);
      setSelectedLocation(null);
      
      // Call backend API to search for gym locations
      const response = await fetch(
        "https://us-central1-gymbuddy-d7838.cloudfunctions.net/getGymLocations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");
      
      // Process successful response
      if (data.status === "OK" && data.results?.length) {
        const foundLocations = data.results.map(result => ({
          position: result.geometry.location,
          address: result.formatted_address,
          name: result.name,
          place_id: result.place_id
        }));
        setLocations(foundLocations);
      } else {
        alert("No results found");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  // Handle marker selection on map
  const handleMarkerClick = (location) => {
    setSelectedLocation({
      ...location,
      place_id: location.place_id || `manual_${location.name}_${location.address}`
    });
  };

  // Confirm location selection and navigate to matches
  const handleConfirm = () => {
    if (!selectedLocation) return;
    
    navigate('/Matches', { 
      state: {
        location: {
          fullGymString: `${selectedLocation.name}, ${selectedLocation.address}`,
          place_id: selectedLocation.place_id
        }
      }
    });
  };

  // Handle Google Maps API loading errors
  if (loadError) {
    return <Typography variant="h6" color="error">Error loading Google Maps API. Please try again later.</Typography>;
  }

  // Show loading state while Google Maps API loads
  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Set map center based on results or default to US center
  const mapCenter = locations.length > 0 ? locations[0].position : { lat: 39.8283, lng: -98.5795 };

  return (
    <>
      {/* Background image */}
      <div className="backdrop-image" />
      
      {/* Main content container */}
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
          {/* Page header */}
          <Typography variant="h4" gutterBottom sx={{ color: 'white' }}>
            Find Gym Buddy
          </Typography>
          
          {/* Search form */}
          <form onSubmit={handleSubmit}>
            {/* Gym name input */}
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
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)'},
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white'}
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(255,255,255,0.7)'
                }
              }}
            />
            
            {/* City input */}
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
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)'},
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white'}
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(255,255,255,0.7)'
                }
              }}
            />
            
            {/* State dropdown */}
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
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.3)'},
                  '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&.Mui-focused fieldset': { borderColor: 'white'}
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
            
            {/* Form action buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '10px' }}>
              <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
                Back
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Search
              </Button>
            </Box>
          </form>

          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          )}

          {/* Search results section */}
          {locations.length > 0 && (
            <>
              <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2, fontWeight: '500', color: 'white' }}>
                {locations.length} gym(s) found. Click on a marker to select:
              </Typography>

              {/* Selected location preview */}
              {selectedLocation && (
                <Box sx={{ 
                  mb: 2, 
                  p: 2, 
                  border: '1px solid #ddd',
                  borderRadius: 1, 
                  backgroundColor: 'white',
                  color: 'black'
                }}>
                  <Typography><strong>Selected:</strong> {selectedLocation.name}</Typography>
                  <Typography>{selectedLocation.address}</Typography>
                </Box>
              )}
            </>
          )}

          {/* Google Map display */}
          {(locations.length > 0 || submitted) && (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '400px' }}
              center={mapCenter}
              zoom={locations.length > 0 ? 12 : 4}
            >
              {/* Map markers for each location */}
              {locations.map((location, index) => (
                <Marker 
                  key={index}
                  position={location.position}
                  onClick={() => handleMarkerClick(location)}
                  title={`${location.name || 'Gym'}\n${location.address}`}
                  icon={{
                    scaledSize: new window.google.maps.Size(32, 32)
                  }}
                />
              ))}
            </GoogleMap>
          )}

          {/* Confirm button (only shown when locations found) */}
          {locations.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 1, flex: '0 0 auto' }}>
              <Button 
                variant="contained"
                color="primary"
                onClick={handleConfirm}
                disabled={!selectedLocation}
                sx={{
                  px: 3,
                  minWidth: 120,
                  '&:disabled': {
                    opacity: 0.7
                  }
                }}
              >
                Confirm
              </Button>
            </Box>
          )}

          {/* No results message */}
          {submitted && locations.length === 0 && !loading && (
            <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2, color: 'white' }}>
              No gym locations found. Please check the details.
            </Typography>
          )}
        </Box>
      </div>
    </>
  );
};

export default FindGymBuddy;












