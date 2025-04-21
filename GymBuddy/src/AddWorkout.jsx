import { useState } from 'react';
import { auth } from './firebase'; // Ensure you have firebase initialized in this file
import { useNavigate } from 'react-router-dom';
import { updateUserWorkouts } from './services/workout-api';

function AddWorkout() {
  const navigate = useNavigate();
  const [error, setError] = useState(null); 
  const [formData, setFormData] = useState({
    name: '',
    days: [{ dayName: '', focus: '', exercises: [{ name: '', sets: '', reps: '' }] }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        setError(null); // Reset error state
        await updateUserWorkouts({
            splits: [formData],
            muscleGroups: []
        });
        navigate('/workout_library/custom-workout');
    } catch (error) {
        console.error('Error saving workout:', error);
        setError(error.message);
    }
};

  const addExercise = (dayIndex) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises.push({ name: '', sets: '', reps: '' });
    setFormData({ ...formData, days: newDays });
  };

  const addDay = () => {
    setFormData({
      ...formData,
      days: [...formData.days, { dayName: '', focus: '', exercises: [{ name: '', sets: '', reps: '' }] }]
    });
  };

  const handleExerciseChange = (dayIndex, exerciseIndex, field, value) => {
    const newDays = [...formData.days];
    newDays[dayIndex].exercises[exerciseIndex][field] = value;
    setFormData({ ...formData, days: newDays });
  };

  const handleDayChange = (dayIndex, field, value) => {
    const newDays = [...formData.days];
    newDays[dayIndex][field] = value;
    setFormData({ ...formData, days: newDays });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Add New Workout</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label>
            Workout Name:
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ marginLeft: "10px" }}
              required
            />
          </label>
        </div>

        {formData.days.map((day, dayIndex) => (
          <div key={dayIndex} style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ccc" }}>
            <h3>Day {dayIndex + 1}</h3>
            <div style={{ marginBottom: "15px" }}>
              <label>
                Day Name:
                <input
                  type="text"
                  value={day.dayName}
                  onChange={(e) => handleDayChange(dayIndex, 'dayName', e.target.value)}
                  style={{ marginLeft: "10px" }}
                  required
                />
              </label>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <label>
                Focus:
                <input
                  type="text"
                  value={day.focus}
                  onChange={(e) => handleDayChange(dayIndex, 'focus', e.target.value)}
                  style={{ marginLeft: "10px" }}
                  required
                />
              </label>
            </div>

            <h4>Exercises:</h4>
            {day.exercises.map((exercise, exerciseIndex) => (
              <div key={exerciseIndex} style={{ marginBottom: "10px" }}>
                <input
                  type="text"
                  placeholder="Exercise name"
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'name', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'sets', e.target.value)}
                  style={{ marginLeft: "10px", width: "60px" }}
                  required
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(dayIndex, exerciseIndex, 'reps', e.target.value)}
                  style={{ marginLeft: "10px", width: "60px" }}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={() => addExercise(dayIndex)}>Add Exercise</button>
          </div>
        ))}

        <button type="button" onClick={addDay}>Add Day</button>
        
        <div style={{ marginTop: "20px" }}>
          <button type="submit" style={{ marginRight: "10px" }}>Save Workout</button>
          <button type="button" onClick={() => navigate('/workout_library/custom-workout')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default AddWorkout;