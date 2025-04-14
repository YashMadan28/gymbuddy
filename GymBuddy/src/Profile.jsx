import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { Typography, Button, Box, Toolbar } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import default_image from './assets/default_image.jpg';
import './editprofile.css';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userEmail, setUserEmail] = useState('');
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading]= useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    setUserEmail(user.email);
                    const token = await user.getIdToken();
                    console.log('Fetching profile for email', user.email); // Debugging line

                    const response = await fetch(`http://localhost:5000/api/users/${user.email}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Received profile data:', data); // Debugging line
                    setProfileData({
                        name: data.name,
                        age: data.age,
                        gender: data.gender,
                        gym: data.gym,
                        about: data.about
                    });
                } else {
                    console.error('Failed to fetch profile data');
                }
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchProfileData();
    }, []);

    /* Get the profile data (profile data is defined in app.jsx) passed from either the Profile
     button in the App Bar, Back or Save Changes button in EditProfile,
     or from the Matches page */
    //const { profileData, isOwnProfile} = location.state || {};  
    const profileToDisplay = profileData || location.state?.profileData;
    const isOwnProfile = location.state?.isOwnProfile || true;

    if (loading) {
        return <Box sx = {{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <Typography>Loading...</Typography>
        </Box>;
    }

    return (
        <Box sx={{ justifyContent: 'center', maxWidth: 500, margin: 'auto', backgroundColor: 'default', padding: 3 }}>
            <Toolbar /> 
            {/* Conditionally render the name based on if user is viewing their own profile or another persons */}
            <h2>{isOwnProfile? "Your Profile" : `${profileData?.name}'s Profile`}</h2>

            {isOwnProfile&& (
                <div className = "profileView" >
                    <Button variant="contained" color="primary" onClick={() => navigate('/profile/edit')}>
                        Edit Profile
                    </Button>
                </div>
            )}

            <div className="image-container">
                <img src={profileData?.image || default_image} alt="Profile" className="profile-image" />
            </div>

            <Typography variant = "h6"
                sx = {{
                    textAlign: 'center',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    color: 'rgba(255, 255, 255, 0.7)'
                }}
            >
                {userEmail}
            </Typography>

            <Typography variant="h6" sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                Name: <span style={{ fontWeight: 'normal', color: 'text.primary' }}>
                            {profileData?.name}
                        </span>
            </Typography>
            <Typography variant="h6" sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                Age: <span style={{ fontWeight: 'normal', color: 'text.primary' }}>
                            {profileData?.age}
                        </span>
            </Typography>
            <Typography variant="h6" sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                Gender: <span style={{ fontWeight: 'normal', color: 'text.primary' }}>
                            {profileData?.gender}
                        </span>
            </Typography>
            <Typography variant="h6" sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                Gym: <span style={{ fontWeight: 'normal', color: 'text.primary' }}>
                            {profileData?.gym}
                        </span>
            </Typography>
            <Typography variant="h6" sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                About Me:<br/> <Typography variant="body1" className="about-text" sx={{ fontWeight: 'normal' }}>
                                {profileData?.about}
                                </Typography>
            </Typography>
            <br />
            <br />
            <div className = "profileView">
                <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ marginBottom: 2 }}
                    /* If user is viewing their own profile and clicks on Back button, takes them to home page.
                        Otherwise, if user was viewing someone else's profile and clicks on Back button,
                        takes them back to the Matches page */
                    onClick={() => navigate(isOwnProfile? '/' : '/matches')}
                >
                    Back
                </Button>
            </div>
        </Box>
    );
};

export default Profile;


