import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, Typography, CircularProgress, Dialog } from '@mui/material';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming'
];

const EditGymPopup = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    gymName: '',
    city: '',
    state: '',
  });
  
  const [errors, setErrors] = useState({
    gymName: false,
    city: false,
    state: false,
  });

  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      setLocations([]);
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
        const foundLocations = data.results.map(result => ({
          position: result.geometry.location,
          address: result.formatted_address,
          name: result.name
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

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const handleSave = () => {
    if (!selectedLocation) {
      alert('Please select a location first');
      return;
    }
    onSave({
      ...formData,
      location: selectedLocation
    });
    onClose();
  };

  const mapCenter = locations.length > 0 ? locations[0].position : { lat: 39.8283, lng: -98.5795 };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
          Select Gym Location
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Gym Name"
            value={formData.gymName}
            onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
            error={errors.gymName}
            helperText={errors.gymName ? 'Gym name is required' : ''}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            error={errors.city}
            helperText={errors.city ? 'City is required' : ''}
            fullWidth
            margin="normal"
          />
          
          <TextField
            label="State"
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
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button onClick={onClose} color="secondary" variant="contained">
            Cancel
          </Button>
            <Button type="submit" variant="contained" color="primary">
              Search
            </Button>
          </Box>
        </form>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {locations.length > 0 && (
          <>
    <Typography 
      variant="h6" 
      sx={{ 
        textAlign: 'center', 
        marginTop: 2, 
        fontWeight: '500',
        color: 'black' 
      }}
    >
      {locations.length} gym(s) found. Click on a marker to select:
    </Typography>
            
            {selectedLocation && (
              <Box sx={{ mb: 2, p: 2, border: '1px solid #ddd',
                    borderRadius: 1, textAlign: 'center' }}>
                <Typography><strong>Selected:</strong> {selectedLocation.name}</Typography>
                <Typography>{selectedLocation.address}</Typography>
              </Box>
            )}

            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '300px' }}
              center={mapCenter}
              zoom={locations.length > 0 ? 12 : 4}
            >
              {locations.map((location, index) => (
                <Marker 
                  key={index}
                  position={location.position}
                  onClick={() => handleMarkerClick(location)}
                  title={`${location.name || 'Gym'}\n${location.address}`}
                />
              ))}
            </GoogleMap>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  <Button 
                    onClick={handleSave} 
                    color="primary" 
                    variant="contained"
                    disabled={!selectedLocation}
                  >
                    Confirm
                  </Button>
                </Box>
            </>
        )}
      </Box>
    </Dialog>
  );
};

export default EditGymPopup;