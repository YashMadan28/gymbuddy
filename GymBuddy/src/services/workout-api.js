import { auth } from '../firebase';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;


/**
 * Fetches the current user's workout data from the backend.
 * Requires user to be authenticated.
 */
export const fetchUserWorkouts = async () => {
  try {
    // Ensure user is logged in
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    // Get Firebase ID token for authentication
    const token = await auth.currentUser.getIdToken();

    // Make GET request to fetch user's workouts
    const response = await fetch(`${API_URL}/workouts/${auth.currentUser.uid}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Handle non-successful response
    if (!response.ok) {
      throw new Error('Failed to fetch workouts');
    }

    // Parse and return workout data
    const data = await response.json();
    return data || { exercises: [] };
  } catch (error) {
    console.error('Error fetching workouts:', error);

    // Return safe fallback on failure
    return { exercises: [] };
  }
};

/**
 * Updates the user's workout list by appending new exercises.
 * Merges existing workouts with new ones and sends PUT request to backend.
 */
export const updateUserWorkouts = async (workoutData) => {
  try {
    // Ensure user is logged in
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    // Fetch existing workouts to merge
    const existingWorkouts = await fetchUserWorkouts();

    // Combine existing exercises with new ones
    const updatedWorkouts = {
      exercises: [
        ...(existingWorkouts.exercises || []),
        ...workoutData.exercises
      ]
    };

    // Get Firebase ID token
    const token = await auth.currentUser.getIdToken();

    // Send PUT request to update workouts
    const response = await fetch(`${API_URL}/workouts/${auth.currentUser.uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedWorkouts)
    });

    // Handle non-successful response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update workouts');
    }

    // Return updated workout data from backend
    return await response.json();
  } catch (error) {
    console.error('Error updating workouts:', error);
    throw error;
  }
};
