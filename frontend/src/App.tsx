import { Routes, Route, useLocation } from 'react-router';
import { useEffect } from 'react';
import './App.css';
import Home from './pages/home/Home';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import UserSessions from './pages/userSessions/UserSessions';

const pageTitles: Record<string, string> = {
  '/': 'Henning the Navigator',
  '/signup': 'Sign up',
  '/login': 'Login',
  '/user-sessions': 'Sessions',
};

function App() {
  const location = useLocation();
  useEffect(() => {
    let title = 'Henning the Navigator'; // Set default title
    if (location.pathname in pageTitles) {
      // Update title based on current path if it exists in our mapping
      title = pageTitles[location.pathname];
    }
    document.title = title;
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user-sessions" element={<UserSessions />} />
    </Routes>
  );
}

export default App;
