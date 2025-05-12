import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { workoutData } from './workoutData';
import "./animations.css";

<Link to="/workout_library">
  <button>Workout Library</button>
</Link>;


function WorkoutLibrary() {
  const [activeSplit, setActiveSplit] = useState(null);
  const [activeDay, setActiveDay] = useState(null);
  const [activeMuscle, setActiveMuscle] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {isLoggedIn && (
        <button
          onClick = {() => navigate("/workout_library/custom-workout")}
          style = {{
            padding: "10px 20px",
            marginBottom: "20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          My Custom Workouts
        </button>
      )}
      <div style={{ marginBottom: "40px " }}>
        <h2> Workout Splits</h2>

        <div
          
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
            justifyContent: "center",
          }}
        >
          {workoutData.splits.map((split, splitIndex) => (
            <button
              key={splitIndex}
              onClick={() => {
                setActiveSplit(splitIndex);
                setActiveDay(null);
              }}
            >
              <div style={{ gap: "20px" }}>
                <span className="text">{split.name}</span>
              </div>
            </button>
          ))}
        </div>
        {activeSplit !== null && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "20px",
              justifyContent: "center",
            }}
          >
            {workoutData.splits[activeSplit].days.map((day, dayIndex) => (
              <button key={dayIndex} onClick={() => setActiveDay(dayIndex)}>
                {day.dayName}
              </button>
            ))}
          </div>
        )}
        {activeSplit !== null && activeDay !== null && (
          <div>
            <h3>{workoutData.splits[activeSplit].days[activeDay].dayName}</h3>
            <p>
              <strong>Focus:</strong>{" "}
              {workoutData.splits[activeSplit].days[activeDay].focus}
            </p>
            <ul>
              {workoutData.splits[activeSplit].days[activeDay].exercises.map(
                (exercise, i) => (
                  <li key={i}>{exercise}</li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      <div>
        <h2> Muscle Group Focus </h2>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "20px",
            justifyContent: "center",
          }}
        >
          {workoutData.muscleGroups.map((group, index) => (
            <button
              key={index}
              style={{
                padding: "10px 15px",
                background: activeMuscle == index ? "#4CAF50" : "#d0d0d0",
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
        {activeMuscle !== null && (
          <div>
            <h3>{workoutData.muscleGroups[activeMuscle].groupName}</h3>
            <ul>
              {workoutData.muscleGroups[activeMuscle].exercises.map(
                (exercise, i) => (
                  <li key={i}>{exercise}</li>
                )
              )}
            </ul>
          </div>
        )}
      </div>
      <button
        variant="contained"
        color="secondary"
        sx={{ marginBottom: 2 }}
        onClick={() => navigate("/")}
      >
        Back
      </button>
    </div>
  );
}

export default WorkoutLibrary;
