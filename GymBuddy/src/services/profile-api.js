import { auth } from '../firebase';

const API_URL = 'http://localhost:5000/api';

export const updateUserProfile = async (firebaseUid, profileData) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`${API_URL}/users/${auth.currentUser.email}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const fetchUserProfile = async (firebaseUid) => {
  try {
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`${API_URL}/users/${firebaseUid}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};