import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import AppLayout from './AppLayout';
import Profile from './Profile';
import EditProfile from './EditProfile';
import MainPage from './MainPage';


function App() {

  return (
    <Router>
      <Routes>
        <Route element = {<AppLayout />}>
          <Route path = "/" element = { <MainPage />} />
          <Route path = "/profile" element = {<Profile />} />
          <Route path= "/profile/edit" element={<EditProfile />} />
          {/*<Route path = "/login" element = {<Login />} />*/}
          {/*<Route path = "/messages" element = {<Messages />} />*/}
          {/*<Route path = "/stats" element = {<Stats />} />*/}
          {/*<Route path = "/Schedule" element = {<Schedule />} />*/}
          {/*<Route path = "/workout_library" element = {<Workout_Library />} />*/}
        </Route>
      </Routes>
    </Router>
  );
}

export default App
