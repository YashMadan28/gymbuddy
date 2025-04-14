import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { Typography, Button, Box, Toolbar } from '@mui/material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import default_image from './assets/default_image.jpg';
import './editprofile.css';
import { fetchUserProfile, fetchOtherUserProfile } from './services/profile-api';

// Profile component handles both user's own profile and viewing others' profiles
const Profile = () => {
    // Navigation and route handling hooks
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();
    
    // State management for profile data and loading status
    const [profileData, setProfileData] = useState({
        name: '',
        age: '',
        gender: '',
        gym: '',
        about: '',
        profilePicture: default_image
    });
    const [loading, setLoading] = useState(true);

    // Determine if this is the user's own profile
    const isOwnProfile = !userId;

    // Data fetching effect - runs when userId changes
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Fetch appropriate profile based on whether userId exists
                const data = userId 
                    ? await fetchOtherUserProfile(userId) 
                    : await fetchUserProfile();
                
                // Update state with fetched data or defaults
                setProfileData({
                    name: data?.name || '',
                    age: data?.age || '',
                    gender: data?.gender || '',
                    gym: data?.gym || '',
                    about: data?.about || '',
                    profilePicture: data?.profilePicture || default_image,
                    ...(isOwnProfile && { email: data?.email || '' }) // Only include email for own profile
                });
            } catch (error) {
                console.error('Error:', error);
                navigate(userId ? '/matches' : '/'); // Redirect on error
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId, navigate]);

    // Loading state UI
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    // Main profile display
    return (
        <Box sx={{ justifyContent: 'center', maxWidth: 500, margin: 'auto', padding: 3 }}>
            <Toolbar />
            <h2>{isOwnProfile ? "Your Profile" : `${profileData.name}'s Profile`}</h2>

            {/* Edit button only appears on own profile */}
            {isOwnProfile && (
                <div className="profileView">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => navigate('/profile/edit', { 
                            state: { profileData } 
                        })}
                    >
                        Edit Profile
                    </Button>
                </div>
            )}

            {/* Profile image with fallback to default */}
            <div className="image-container">
                <img 
                    src={profileData.profilePicture} 
                    alt="Profile" 
                    className="profile-image"
                    onError={(e) => { e.target.src = default_image }} 
                />
            </div>

            {/* Email display (only for own profile) */}
            {isOwnProfile && profileData.email && (
                <Typography variant="h6" sx={{ textAlign: 'center', py: 2 }}>
                    {profileData.email}
                </Typography>
            )}

            {/* Profile information fields */}
            <ProfileField label="Name" value={profileData.name} />
            <ProfileField label="Age" value={profileData.age} />
            <ProfileField label="Gender" value={profileData.gender} />
            <ProfileField label="Gym" value={profileData.gym} />
            
            {/* About me section */}
            <Typography variant="h6" sx={{ pt: 2, pb: 1 }}>
                About Me:
            </Typography>
            <Typography variant="body1">
                {profileData.about || 'Not specified'}
            </Typography>

            {/* Back button - navigates differently based on context */}
            <div className="profileView">
                <Button 
                    variant="contained" 
                    sx={{ mb: 2, mt: 3 }}
                    onClick={() => navigate(isOwnProfile ? '/' : '/matches')}
                >
                    Back
                </Button>
            </div>
        </Box>
    );
};

// Reusable component for profile fields
const ProfileField = ({ label, value }) => (
    <Typography variant="h6" sx={{ py: 1 }}>
        {label}: <span style={{ fontWeight: 'normal' }}>
            {value || 'Not specified'}
        </span>
    </Typography>
);

export default Profile;


