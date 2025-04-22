import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserWorkouts, updateUserWorkouts } from './services/workout-api';
import "./animations.css";

function CustomWorkouts() {
  const [workouts, setWorkouts] = useState({ exercises: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFocus, setSelectedFocus] = useState('all');
  const [expandedCards, setExpandedCards] = useState({});
  const navigate = useNavigate();

  const toggleCard = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const focusCategories = [
    'all',
    'chest',
    'back',
    'legs',
    'arms',
    'shoulders',
    'core'
  ];

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setLoading(true);
        const data = await fetchUserWorkouts();
        // If no workouts exist yet, initialize with empty arrays
        setWorkouts( data || { exercises: [] });
      } catch (error) {
        console.error('Failed to load workouts:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadWorkouts();
  }, []);

  const filteredExercises = workouts.exercises.filter(exercise => 
    selectedFocus === 'all' || exercise.focus.toLowerCase() === selectedFocus
  );

  if (loading) {
    return <div>Loading workouts...</div>;
  }

  if (error) {
    return <div>Error loading workouts: {error}</div>
  }

  return (
    <div style ={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      overflow: "hidden",
      paddingTop: "15px"
    }}>
      <div style={{ 
        padding: "20px",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}>
    <div style={{ maxWidth: "800px", margin: "0 auto"}}>
      <h1>My Custom Workouts</h1>

      <button
        onClick={() => navigate('/workout_library/custom-workout/add-workout')}
        style={{
          padding: '10px 20px',
          marginBottom: '15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Add New Exercise
      </button>
      
      <div className = "tabs">
        <div className = "container">
        {focusCategories.map((focus, index) => (
          <div key = {focus}>
            <input
              type = "radio"
              name = "focus"
              id = {`radio-${index + 1}`}
              value = {focus}
              checked = {selectedFocus == focus}
              onChange = {(e) => setSelectedFocus(e.target.value)}
            />
          <label
            className = "tab" 
            htmlFor={`radio-${index + 1}`}
          >
              {focus.charAt(0).toUpperCase() + focus.slice(1)}
          </label>
        </div>
        ))}
        </div>
      </div>
      </div>
      </div>

      <div style = {{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
      }}>
      <div style = {{
        maxWidth: "800px",
        margin: "0 auto",
        paddingBottom: "100px",
      }}>
      <div style={{ marginBottom: "40px " }}>
        <h2>My Exercises</h2>
        
        {filteredExercises.length === 0 ? (
          <p>
            {selectedFocus === 'all'
            ? 'No custom exercises added yet. Click "Add New Exercise" to create one!'
            : `No exercises found for ${selectedFocus} focus.`}
          </p>
        ) : (
          <div>
            {filteredExercises.map((exercise, index) => (
              <div 
                key={index}
                className="exercise-card"
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  padding: '15px',
                  marginBottom: '10px',
                  backgroundColor: 'black',
                  boxShadow: '2 2px 4px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => toggleCard(index)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <h3 style={{ margin: 0 }}>{exercise.name}</h3>
                  <span style={{ 
                    transform: expandedCards[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    }}>
                      ▼
                    </span>
                </div>

                {expandedCards[index] && (
                  <div style={{
                    marginTop: '10px',
                    padding: '10px',
                    borderTop: '1px solid #ddd',
                    transition: 'all 0.3s ease',
                  }}>
                    <p><strong>Focus:</strong> {exercise.focus}</p>
                    <p style = {{ margin: 0 }}><strong>Sets:</strong> {exercise.sets} | <strong>Reps:</strong> {exercise.reps}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
               
      <div style={{ 
      padding: "20px",
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10
      }}>
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
    </div>
    </div>
  );
}

export default CustomWorkouts;