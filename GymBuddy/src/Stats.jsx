import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
} from '@mui/material';

const fitnessGoals = ['Cut', 'Maintain', 'Bulk'];
const genders = ['Male', 'Female'];

const Stats = () => {
  const [formData, setFormData] = useState({
    weight: '',
    targetWeight: '',
    height: '',
    age: '',
    gender: '',
    calorieGoal: '',
    fitnessGoal: '',
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const calculateBMI = () => {
    const { height, weight } = formData;
    if (!height || !weight) return null;
    const h = height / 100;
    return (weight / (h * h)).toFixed(1);
  };

  const calculateSuggestedCalories = () => {
    const { weight, height, age, gender, fitnessGoal } = formData;
    if (!weight || !height || !age || !gender || !fitnessGoal) return null;

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);

    let bmr =
      gender === 'Male'
        ? 10 * w + 6.25 * h - 5 * a + 5
        : 10 * w + 6.25 * h - 5 * a - 161;

    if (fitnessGoal === 'Cut') return Math.round(bmr - 500);
    if (fitnessGoal === 'Bulk') return Math.round(bmr + 300);
    return Math.round(bmr);
  };

  return (
    <Box sx={{ maxWidth: 700, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Personal Fitness Stats
      </Typography>

      <Paper sx={{ padding: 3, marginBottom: 3 }}>
        <Typography variant="h6" gutterBottom>
          Enter Your Data
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Current Weight (kg)"
            type="number"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
          />
          <TextField
            label="Target Weight (kg)"
            type="number"
            value={formData.targetWeight}
            onChange={(e) => handleChange('targetWeight', e.target.value)}
          />
          <TextField
            label="Height (cm)"
            type="number"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
          />
          <TextField
            label="Age"
            type="number"
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
          />
          <TextField
            select
            label="Gender"
            value={formData.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
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
            onChange={(e) => handleChange('fitnessGoal', e.target.value)}
          >
            {fitnessGoals.map((g) => (
              <MenuItem key={g} value={g}>
                {g}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      <Paper sx={{ padding: 3 }}>
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>
        <ul>
          <li><strong>BMI:</strong> {calculateBMI() || '—'}</li>
          <li><strong>Suggested Daily Calories:</strong> {calculateSuggestedCalories() || '—'} kcal</li>
          <li><strong>Target Weight:</strong> {formData.targetWeight || '—'} kg</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default Stats;
