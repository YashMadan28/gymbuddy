import { auth } from '../firebase';

const API_URL = 'http://localhost:5000/api';

export const fetchUserWorkouts = async () => {
    try {
        if (!auth.currentUser) {
            throw new Error('User not authenticated');
        }

        const token = await auth.currentUser.getIdToken();
        const response = await fetch(`${API_URL}/workouts/${auth.currentUser.uid}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch workouts');
        }
        const data = await response.json();
        return data || { exercises: [] };
      } catch (error) {
        console.error('Error fetching workouts:', error);
        return { exercises: [] }; // Return empty default state
      }
};

export const updateUserWorkouts = async (workoutData) => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const existingWorkouts = await fetchUserWorkouts();
    const updatedWorkouts = {
      exercises: [
        ...(existingWorkouts.exercises || []),
        ...workoutData.exercises
      ]
    };
    
    const token = await auth.currentUser.getIdToken();
    const response = await fetch(`${API_URL}/workouts/${auth.currentUser.uid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedWorkouts)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update workouts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating workouts:', error);
    throw error;
  }
};