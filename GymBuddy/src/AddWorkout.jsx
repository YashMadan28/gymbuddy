import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserWorkouts } from './services/workout-api';

const FOCUS_CATEGORIES = [
  'chest',
  'back',
  'legs',
  'arms',
  'shoulders',
  'core'
];

function AddWorkout() {
  const navigate = useNavigate();
  const [error, setError] = useState(null); 
  const [formData, setFormData] = useState({
    focus: FOCUS_CATEGORIES[0],
    name: '',
    sets: '',
    reps: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setError(null); // Reset error state
        await updateUserWorkouts({
            exercises: [formData]
        });
        navigate('/workout_library/custom-workout');
    } catch (error) {
        console.error('Error saving workout:', error);
        setError(error.message);
    }
};

const handleChange = (field, value) => {
  setFormData({
    ...formData,
    [field]: value
  });
};

return (
  <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
    <h1>Add New Exercise</h1>
    
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label>
            Focus:
            <select
              value={formData.focus}
              onChange={(e) => handleChange('focus', e.target.value)}
              style={{ 
                marginLeft: "10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              required
            >
              {FOCUS_CATEGORIES.map((focus) => (
                <option key = {focus} value = {focus}>
                  {focus.charAt(0).toUpperCase() + focus.slice(1)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            Exercise Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              style={{ marginLeft: "10px" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            Sets:
            <input
              type="number"
              value={formData.sets}
              onChange={(e) => handleChange('sets', e.target.value)}
              style={{ marginLeft: "10px", width: "60px" }}
              required
            />
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>
            Reps:
            <input
              type="number"
              value={formData.reps}
              onChange={(e) => handleChange('reps', e.target.value)}
              style={{ marginLeft: "10px", width: "60px" }}
              required
            />
          </label>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button type="submit" style={{ marginRight: "10px" }}>Save Exercise</button>
        <button type="button" onClick={() => navigate('/workout_library/custom-workout')}>Cancel</button>
      </div>
    </form>
  </div>
);
}

export default AddWorkout;