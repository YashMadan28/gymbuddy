import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

// Predefined fitness goals and gender options for dropdowns
const fitnessGoals = ["Cut", "Maintain", "Bulk"];
const genders = ["Male", "Female"];

const Stats = () => {
  // State to store form input values
  const [formData, setFormData] = useState({
    weight: "",
    targetWeight: "",
    height: "",
    age: "",
    gender: "",
    calorieGoal: "",
    fitnessGoal: "",
  });

  // Handles updates to form fields
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Calculates BMI using height and weight
  const calculateBMI = () => {
    const { height, weight } = formData;
    if (!height || !weight) return null;
    const h = height / 100; // convert cm to meters
    return (weight / (h * h)).toFixed(1); // BMI formula
  };

  // Calculates suggested daily calorie intake based on BMR and fitness goal
  const calculateSuggestedCalories = () => {
    const { weight, height, age, gender, fitnessGoal } = formData;
    if (!weight || !height || !age || !gender || !fitnessGoal) return null;

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    // Mifflin-St Jeor BMR formula
    let bmr =
      gender === "Male"
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;

    // Adjust based on fitness goal
    if (fitnessGoal === "Cut") return Math.round(bmr - 500);
    if (fitnessGoal === "Bulk") return Math.round(bmr + 300);
    return Math.round(bmr); // Maintain
  };

  return (
    // Main container box
    <Box sx={{ maxWidth: 700, margin: "auto", padding: 3 }}>
      {/* Page heading */}
      <Typography variant="h4" gutterBottom>
        Personal Fitness Stats
      </Typography>

      {/* Form section for entering user data */}
      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Enter Your Data
        </Typography>

        {/* Input fields for stats */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Current Weight (kg)"
            type="number"
            value={formData.weight}
            onChange={(e) => handleChange("weight", e.target.value)}
          />
          <TextField
            label="Target Weight (kg)"
            type="number"
            value={formData.targetWeight}
            onChange={(e) => handleChange("targetWeight", e.target.value)}
          />
          <TextField
            label="Height (cm)"
            type="number"
            value={formData.height}
            onChange={(e) => handleChange("height", e.target.value)}
          />
          <TextField
            label="Age"
            type="number"
            value={formData.age}
            onChange={(e) => handleChange("age", e.target.value)}
          />
          <TextField
            select
            label="Gender"
            value={formData.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            {genders.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Fitness Goal"
            value={formData.fitnessGoal}
            onChange={(e) => handleChange("fitnessGoal", e.target.value)}
          >
            {fitnessGoals.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* Summary section displaying calculated results */}
      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>
        <ul>
          <li>
            <strong>BMI:</strong> {calculateBMI() || "—"}
          </li>
          <li>
            <strong>Suggested Daily Calories:</strong>{" "}
            {calculateSuggestedCalories() || "—"} kcal
          </li>
          <li>
            <strong>Target Weight:</strong> {formData.targetWeight || "—"} kg
          </li>
        </ul>
      </Paper>
    </Box>
  );
};

export default Stats;

