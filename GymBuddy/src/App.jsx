import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AppLayout from "./AppLayout";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import MainPage from "./MainPage";
import Login from "./Login";
import FindGymBuddy from "./FindGymBuddy";
import Matches from "./Matches";
import WorkoutLibrary from "./WorkoutLibrary";
import Stats from "./Stats";
import Messages from "./Messages";
import Schedule from "./Schedule";

const App = () => {
  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    gender: "",
    gym: "",
    about: "",
    image: null,
  });

  return (
    <Router>
      <Routes>
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
