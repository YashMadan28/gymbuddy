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

import "./App.css";

const App = () => {

  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    gender: "",
    gym: "",
    about: "",
    image: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/users/${user.uid}`,
            {
              headers: {
                'Authorization': `Bearer ${await user.getIdToken()}`
              }
            }
          );
          if (response.ok) {
            const userData = await response.json();
            setProfileData(userData);
          }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/profile"
            element={<Profile profileData={profileData} />}
          />
          <Route
            path="/profile/edit"
            element={
              <EditProfile
                profileData={profileData}
                setProfileData={setProfileData}
              />
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/findgymbuddy" element={<FindGymBuddy />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/Schedule" element={<Schedule />} />
          <Route path="/workout_library" element={<WorkoutLibrary />} />
          {/*<Route index element = {<WorkoutLibrary />} />*/}
          {/*<Route path = "splits" element = {<SplitView />} />
          <Route path = "muscle-groups" element = {<MuscleGroupView />} />*/}
          {/*</Route>*/}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
