import { Routes, Route } from 'react-router';
import './App.css';
import Home from './pages/home/Home';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import UserPage from './pages/userPage/userPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/user-sessions" element={<UserPage />} />
    </Routes>
  );
}

export default App;
