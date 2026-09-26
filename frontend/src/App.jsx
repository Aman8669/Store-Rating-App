import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

import AdminDash from './pages/AdminDash';
import OwnerDash from './pages/OwnerDash';
import UserDash from './pages/UserDash';

const DefaultRedirect = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'SYSTEM_ADMIN') return <Navigate to="/admin-dashboard" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner-dashboard" replace />;
  return <Navigate to="/user-dashboard" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DefaultRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🎯 Alag Alag Routes */}
        <Route path="/admin-dashboard" element={<AdminDash />} />
        <Route path="/owner-dashboard" element={<OwnerDash />} />
        <Route path="/user-dashboard" element={<UserDash />} />
      </Routes>
    </Router>
  );
}

export default App;