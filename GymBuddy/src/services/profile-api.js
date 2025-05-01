import { auth } from '../firebase';

/**
 * Updates the user's profile data in the backend using their Firebase UID.
 * Ensures gym is formatted as an object with a `display` key.
 */
export const updateUserProfile = async (firebaseUid, profileData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No authenticated user');

    // Format gym field correctly for backend schema
    const processedData = {
      ...profileData,
      gym: typeof profileData.gym === 'string' 
        ? { display: profileData.gym }
        : profileData.gym
    };    

    const token = await user.getIdToken();

    // Send PUT request to update user profile
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

/**
 * Fetches the currently authenticated user's profile from the backend.
 * If the profile doesn't exist, returns a default empty profile.
 */
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

    if (!response.ok) {
      // Return fallback profile if user not found
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

    // Flatten gym.display if gym is stored as object
    if (data.gym && typeof data.gym === 'object') {
      data.gym = data.gym.display || '';
    }

    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

/**
 * Fetches the public-facing profile of another user by MongoDB user ID.
 * Only non-sensitive fields are returned.
 */
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

    // Return only public data
    return {
      name: data.name || '',
      age: data.age || null,
      gender: data.gender || null,
      gym: data.gym?.display || '',
      about: data.about || '',
      profilePicture: data.profilePicture || null
    };
  } catch (error) {
    console.error('Error fetching other user profile:', error);
    throw error;
  }
};

/**
 * Creates a new user profile document in the backend.
 * Sends name, UID, and email to backend via POST.
 */
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

/**
 * Fetches a list of users who go to a gym matching the given display string.
 */
export const fetchUsersByGym = async ({ gym_display }) => {
  try {
    const user = auth.currentUser;
    if (!user || !gym_display) {
      console.warn("Missing user or gym_display");
      return [];
    }

    const token = await user.getIdToken();

    // Construct full URL with query param
    const url = `http://localhost:5000/api/users/by-gym?gym_display=${encodeURIComponent(gym_display)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to fetch users');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('fetchUsersByGym error:', error);
    return { success: false, data: [], message: error.message };
  }
};




