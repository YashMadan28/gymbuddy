import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./animations.css";

<Link to="/workout_library">
  <button>Workout Library</button>
</Link>;

const workoutData = {
  splits: [
    {
      name: "Upper/Lower Split",
      days: [
        {
          dayName: "Day 1: Upper Body",
          focus: "Chest, Shoulders, Triceps",
          exercises: ["Bench Press", "Overhead Press", "Tricep Pushdowns"],
        },
        {
          dayName: "Day 2: Lower Body",
          focus: "Legs, Glutes",
          exercises: ["Squats", "Deadlifts", "Leg Press"],
        },
      ],
    },
    {
      name: "Push/Pull/Legs Split",
      days: [
        {
          dayName: "Push Day",
          focus: "Chest, Shoulders, Triceps",
          exercises: [
            "Bench Press",
            "Dumbell Fly",
            "Incline Bench Press",
            "Shoulder Press",
            "Tricep Extensions",
          ],
        },
        {
          dayName: "Pull Day",
          focus: "Chest Shoulders, Triceps",
          exercises: [
            "Incline Dumbbell Press",
            "Lat Pulldown",
            "Cable Crossovers",
            "Bicep Curls",
            "Deadlift",
          ],
        },
        {
          dayName: "Leg Day",
          focus: "Quads, Hamstrings, Glutes",
          exercises: ["Leg Extentions", "Romanian Deadlifts", "Calf Raises"],
        },
      ],
    },
  ],
  muscleGroups: [
    {
      groupName: "Chest",
      exercises: [
        "Push-ups",
        "Cable Flyes",
        "Dumbbell Press",
        "Decline Bench Press",
      ],
    },
    {
      groupName: "Back",
      exercises: ["Pull-ups", "Lat Pulldowns", "Face Pulls", "Deadlifts"],
    },
    {
      groupName: "Legs",
      exercises: ["Leg Extensions", "Leg Press", "Walking Lunges", "Squats"],
    },
    {
      groupName: "Shoulders",
      exercises: [
        "Dumbell Lateral Raise",
        "Dumbell Shoulder Press",
        "Face Pull",
        "Rear Delt Flys",
      ],
    },
    {
      groupName: "Arms",
      exercises: [
        "Hammer Curl",
        "Cable Curl",
        "Tricep Pulldown",
        "Skull Crushers",
      ],
    },
  ],
};

function WorkoutLibrary() {
  const [activeSplit, setActiveSplit] = useState(null);
  const [activeDay, setActiveDay] = useState(null);
  const [activeMuscle, setActiveMuscle] = useState(null);

  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "40px " }}>
        <h2> Workout Splits</h2>

        <div
          className="frutiger"
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
              /*className = "fruitger"*/
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
        {activeSplit !== null && (
          <div
            className="purpleGlow"
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
