// Import dependencies
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserWorkouts, updateUserWorkouts } from './services/workout-api';
import "./animations.css";

function CustomWorkouts() {
  // State to store the user's custom workouts
  const [workouts, setWorkouts] = useState({ exercises: [] });

  // Loading and error handling state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected focus category for filtering
  const [selectedFocus, setSelectedFocus] = useState('all');

  // Track which exercise cards are expanded
  const [expandedCards, setExpandedCards] = useState({});

  const navigate = useNavigate();

  // Toggle expansion of an exercise card
  const toggleCard = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Focus categories for filtering
  const focusCategories = [
    'all',
    'chest',
    'back',
    'legs',
    'arms',
    'shoulders',
    'core'
  ];

  // Fetch workouts
  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        setLoading(true);
        const data = await fetchUserWorkouts();
        setWorkouts(data || { exercises: [] });
      } catch (error) {
        console.error('Failed to load workouts:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadWorkouts();
  }, []);

  // Filter exercises based on selected focus
  const filteredExercises = workouts.exercises.filter(exercise => 
    selectedFocus === 'all' || exercise.focus.toLowerCase() === selectedFocus
  );

  // Show loading message while fetching workouts
  if (loading) {
    return <div>Loading workouts...</div>;
  }

  // Show error message if fetch failed
  if (error) {
    return <div>Error loading workouts: {error}</div>;
  }

  return (
    <div style ={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      overflow: "hidden",
      paddingTop: "15px"
    }}>
      {/* Header section with title and Add button */}
      <div style={{ 
        padding: "20px",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h1>My Custom Workouts</h1>

          {/* Button to add a new exercise */}
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

          {/* Focus category tabs */}
          <div className="tabs">
            <div className="container">
              {focusCategories.map((focus, index) => (
                <div key={focus}>
                  <input
                    type="radio"
                    name="focus"
                    id={`radio-${index + 1}`}
                    value={focus}
                    checked={selectedFocus === focus}
                    onChange={(e) => setSelectedFocus(e.target.value)}
                  />
                  <label
                    className="tab" 
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

      {/* Main content section */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "20px",
      }}>
        <div style={{
          maxWidth: "800px",
          margin: "0 auto",
          paddingBottom: "100px",
        }}>
          <div style={{ marginBottom: "40px" }}>
            <h2>My Exercises</h2>

            {/* Display empty state if no exercises */}
            {filteredExercises.length === 0 ? (
              <p>
                {selectedFocus === 'all'
                  ? 'No custom exercises added yet. Click "Add New Exercise" to create one!'
                  : `No exercises found for ${selectedFocus} focus.`}
              </p>
            ) : (
              // Display list of filtered exercises
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
                    {/* Exercise card header */}
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

                    {/* Expanded details */}
                    {expandedCards[index] && (
                      <div style={{
                        marginTop: '10px',
                        padding: '10px',
                        borderTop: '1px solid #ddd',
                        transition: 'all 0.3s ease',
                      }}>
                        <p><strong>Focus:</strong> {exercise.focus}</p>
                        <p style={{ margin: 0 }}>
                          <strong>Sets:</strong> {exercise.sets} | <strong>Reps:</strong> {exercise.reps}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Back button */}
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
