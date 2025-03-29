import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, MenuItem, Typography, CircularProgress, Dialog, DialogTitle, DialogActions } from '@mui/material';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

const FindGymBuddy = () => {
  const [formData, setFormData] = useState({
    gymName: '',
    city: '',
    state: '',
  });
  
  const [errors, setErrors] = useState({
    gymName: false,
    city: false,
    state: false,
  });

  // Changed to store multiple locations
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false); 
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDLdljkfHKd8Htb9s_JiXqjDLPWWiPWlZ0",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      gymName: formData.gymName.trim(),
      city: formData.city.trim(),
      state: formData.state.trim()
    };
  
    const newErrors = {
      gymName: !payload.gymName,
      city: !payload.city,
      state: !payload.state
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
  
    try {
      setLoading(true);
      setLocations([]); // Clear previous locations
      setSelectedLocation(null);
      
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
      
      if (data.status === "OK" && data.results?.length) {
        // Store all locations
        const foundLocations = data.results.map(result => ({
          position: result.geometry.location,
          address: result.formatted_address,
          name: result.name
        }));
        setLocations(foundLocations);
        
        // Set the first location as selected by default
        if (foundLocations.length > 0) {
          setSelectedLocation(foundLocations[0]);
        }
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

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    setOpenDialog(true);
  };

  const handleConfirm = () => {
    setOpenDialog(false);
    // Navigate with the selected location
    navigate('/Matches', { state: { location: selectedLocation } });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    alert('Please select a different location or adjust your search.');
  };

  if (loadError) {
    return <Typography variant="h6" color="error">Error loading Google Maps API. Please try again later.</Typography>;
  }

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Calculate map center (use first location or default)
  const mapCenter = locations.length > 0 ? locations[0].position : { lat: 39.8283, lng: -98.5795 };

  return (
    <Box 
      sx={{ 
        backgroundColor: 'white',
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: 3,
        width: '100%', 
        maxWidth: '600px',
        margin: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        marginTop: '50px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Find Gym Buddy
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <TextField
          label="Gym Name"
          name="gymName"
          value={formData.gymName}
          onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
          error={errors.gymName}
          helperText={errors.gymName ? 'Gym name is required' : ''}
          fullWidth
          margin="normal"
        />
        
        <TextField
          label="City"
          name="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          error={errors.city}
          helperText={errors.city ? 'City is required' : ''}
          fullWidth
          margin="normal"
        />
        
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
        >
          {states.map((state) => (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          ))}
        </TextField>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, marginTop: '10px' }}>
          <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
            Back
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </Box>
      </form>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {locations.length > 0 && (
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            marginTop: 2, 
            fontWeight: '500',
            color: 'black' 
          }}
        >
          {locations.length} gym(s) found. Select a location:
        </Typography>
      )}

      {(locations.length > 0 || submitted) && (
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '400px' }}
          center={mapCenter}
          zoom={locations.length > 0 ? 12 : 4}
        >
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

      {submitted && locations.length === 0 && !loading && (
        <Typography variant="h6" color="error" sx={{ textAlign: 'center', marginTop: 2 }}>
          No gym locations found. Please check the details.
        </Typography>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          Confirm Location: {selectedLocation?.name || 'Gym'}
        </DialogTitle>
        <Typography sx={{ padding: '0 24px' }}>
          {selectedLocation?.address}
        </Typography>
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
  );
};

export default FindGymBuddy;













