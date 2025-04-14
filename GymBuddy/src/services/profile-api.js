import { auth } from '../firebase';

// Updates a user's profile using their Firebase UID and new profile data
export const updateUserProfile = async (firebaseUid, profileData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    // Normalize gym data format to support legacy string format
    const processedData = {
      ...profileData,
      gym: typeof profileData.gym === 'string' 
        ? { display: profileData.gym, place_id: `legacy_${firebaseUid}` }
        : profileData.gym
    };

    const token = await user.getIdToken();

    const response = await fetch(`http://localhost:5000/api/users/${firebaseUid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(processedData)
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

// Fetches the currently logged-in user's profile from the backend
export const fetchUserProfile = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const token = await user.getIdToken();
    const response = await fetch(
      `http://localhost:5000/api/users/${user.uid}`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    // If no profile exists yet, return a default empty profile
    if (!response.ok) {
      if (response.status === 404) {
        return {
          firebaseUid: user.uid,
          email: user.email,
          name: '',
          age: null,
          gender: null,
          gym: '',
          about: '',
          profilePicture: null
        };
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch profile');
    }

    const data = await response.json();

    // Convert gym object to string for backward compatibility
    if (data.gym && typeof data.gym === 'object') {
      data.gym = data.gym.display || '';
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Fetches a public version of another user's profile by ID
export const fetchOtherUserProfile = async (userId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const token = await user.getIdToken();
    const response = await fetch(
      `http://localhost:5000/api/users/${userId}/public`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch profile');
    }

    const data = await response.json();

    // Only return public-facing fields
    return {
      name: data.name || '',
      age: data.age || null,
      gender: data.gender || null,
      gym: data.gym || '',
      about: data.about || '',
      profilePicture: data.profilePicture || null
    };
  } catch (error) {
    console.error('Error fetching other user profile:', error);
    throw error;
  }
};

export const createUserProfile = async (name) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    const response = await fetch(`http://localhost:5000/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await user.getIdToken()}`
      },
      body: JSON.stringify({
        firebaseUid: user.uid,
        email: user.email,
        name: name,
        profilePicture: "https://firebasestorage...default_image.jpg"
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create profile');
    }

    return { success: true, data: await response.json() };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Fetches a list of users who go to the same gym based on place_id
export const fetchUsersByGym = async ({ place_id }) => {
  try {
    const user = auth.currentUser;
    if (!user || !place_id) return [];

    const token = await user.getIdToken();
    const response = await fetch(
      `http://localhost:5000/api/users/by-gym?place_id=${encodeURIComponent(place_id)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!response.ok) return []; // Fallback if API fails
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return [];
  }
};
