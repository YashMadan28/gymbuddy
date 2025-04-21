import { useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import MainPage from "./MainPage";
import Login from "./Login";
import Signup from "./Signup";
import FindGymBuddy from "./FindGymBuddy";
import Matches from "./Matches";
import WorkoutLibrary from "./WorkoutLibrary";
import Stats from "./Stats";
import Messages from "./Messages";
import Schedule from "./Schedule";
import CustomWorkouts from "./CustomWorkout";
import AddWorkout from "./AddWorkout";

import "./App.css";

const App = () => {
// Initialize a piece of state to store the authenticated user
const [user, setUser] = useState(null);

// useEffect runs once when the component mounts
useEffect(() => {
  // Listen for changes to the authentication state (for example...user logs in/out)
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    // Update the 'user' state with the current authenticated user
    //  (or null if not signed in)
    setUser(currentUser);
  });

  // Cleanup function to unsubscribe from the listener when the component unmounts
  return unsubscribe;
}, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/findgymbuddy" element={<FindGymBuddy />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/workout_library" element={<WorkoutLibrary />} />
          <Route path="/workout_library/custom-workout" element={<CustomWorkouts />} />
          <Route path="/workout_library/custom-workout/add-workout" element={<AddWorkout />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;