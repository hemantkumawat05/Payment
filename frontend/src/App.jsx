import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Verify from './pages/Verify';
import Navbar from './pages/Navbar';
import Setting from './pages/Setting';
import Profile from './pages/Profile';
import Transcations from './controllers/Transcations';
import Logout from './controllers/Logout';
import { AppData } from './context/AppContext';
import Loading from './Loading';

export const BACKEND_URL = 'http://localhost:3000';

const App = () => {
  const { isAuth, loading } = AppData();

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      {isAuth && <Navbar />}
      <div className="min-h-screen bg-[#F8FAFC]">
        <Routes>
          {/* Protected Routes */}
          <Route path="/" element={isAuth ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/transcation" element={isAuth ? <Transcations /> : <Navigate to="/login" replace />} />
          <Route path="/setting" element={isAuth ? <Setting /> : <Navigate to="/login" replace />} />
          <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/logout" element={isAuth ? <Logout /> : <Navigate to="/login" replace />} />

          {/* Public & Verification Routes */}
          <Route path="/login" element={!isAuth ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/signup" element={!isAuth ? <Signup /> : <Navigate to="/" replace />} />
          <Route path="/token/:token" element={<Verify />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to={isAuth ? "/" : "/login"} replace />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
    </BrowserRouter>
  );
};

export default App;
