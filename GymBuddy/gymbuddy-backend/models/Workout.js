const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    focus: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
});

const workoutSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    exercises: [exerciseSchema]
});

module.exports = mongoose.model('Workout', workoutSchema);