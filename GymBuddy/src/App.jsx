
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';  // Import the AuthProvider
import './App.css';
import AppLayout from './AppLayout';
import Profile from './Profile';
import EditProfile from './EditProfile';
import MainPage from './MainPage';

function App() {
  return (
    <AuthProvider>  {/* Wrap your app with AuthProvider */}
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
