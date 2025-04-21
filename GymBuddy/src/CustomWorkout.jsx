import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserWorkouts, updateUserWorkouts } from './services/workout-api';
import "./animations.css";

function CustomWorkouts() {
  const [workouts, setWorkouts] = useState({
    splits: [],
    muscleGroups: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSplit, setActiveSplit] = useState(null);
  const [activeDay, setActiveDay] = useState(null);
  const [activeMuscle, setActiveMuscle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setLoading(true);
        const data = await fetchUserWorkouts();
        // If no workouts exist yet, initialize with empty arrays
        setWorkouts({
          splits: data?.splits || [],
          muscleGroups: data?.muscleGroups || []
        });
      } catch (error) {
        console.error('Failed to load workouts:', error);
        setDefaultResultOrder(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadWorkouts();
  }, []);

  if (loading) {
    return <div>Loading workouts...</div>;
  }

  if (error) {
    return <div>Error loading workouts: {error}</div>
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>My Custom Workouts</h1>
      
      <button
        onClick={() => navigate('/workout_library/custom-workout/add-workout')}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Add New Workout
      </button>

      <div style={{ marginBottom: "40px " }}>
        <h2>Workout Splits</h2>
        
        {workouts.splits.length === 0 ? (
          <p>No custom splits added yet. Click "Add New Workout" to create one!</p>
        ) : (
          <div className="frutiger" style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
            justifyContent: "center",
          }}>
            {workouts.splits.map((split, splitIndex) => (
              <button
                key={splitIndex}
                onClick={() => {
                  setActiveSplit(splitIndex);
                  setActiveDay(null);
                }}
              >
                <div className="inner" style={{ gap: "20px" }}>
                  <div className="top-white"></div>
                  <span className="text">{split.name}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeSplit !== null && (
          <div className="purpleGlow" style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
            justifyContent: "center",
          }}>
            {workouts.splits[activeSplit].days.map((day, dayIndex) => (
              <button key={dayIndex} onClick={() => setActiveDay(dayIndex)}>
                {day.dayName}
              </button>
            ))}
          </div>
        )}

        {activeSplit !== null && activeDay !== null && (
          <div>
            <h3>{workouts.splits[activeSplit].days[activeDay].dayName}</h3>
            <p>
              <strong>Focus:</strong>{" "}
              {workouts.splits[activeSplit].days[activeDay].focus}
            </p>
            <ul>
              {workouts.splits[activeSplit].days[activeDay].exercises.map(
                (exercise, i) => (
                  <li key={i}>{exercise.name} - {exercise.sets} sets x {exercise.reps} reps</li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      <div>
        <h2>Muscle Group Focus</h2>
        {workouts.muscleGroups.length === 0 ? (
          <p>No custom muscle groups added yet. Click "Add New Workout" to create one!</p>
        ) : (
          <div style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
            justifyContent: "center",
          }}>
            {workouts.muscleGroups.map((group, index) => (
              <button
                key={index}
                style={{
                  padding: "10px 15px",
                  background: activeMuscle === index ? "#4CAF50" : "#d0d0d0",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => setActiveMuscle(index)}
              >
                {group.groupName}
              </button>
            ))}
          </div>
        )}

        {activeMuscle !== null && workouts.muscleGroups[activeMuscle] && (
          <div>
            <h3>{workouts.muscleGroups[activeMuscle].groupName}</h3>
            <ul>
              {workouts.muscleGroups[activeMuscle].exercises.map(
                (exercise, i) => (
                  <li key={i}>{exercise.name} - {exercise.sets} sets x {exercise.reps} reps</li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/workout_library")}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#d0d0d0',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Back
      </button>
    </div>
  );
}

export default CustomWorkouts;