import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Correct Endpoint Path: /auth/login
      const res = await API.post('/auth/login', { email, password });

      // Save Token and User Data
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      // Redirect Based on Role
      const role = res.data.user.role;
      if (role === 'SYSTEM_ADMIN') {
        navigate('/admin-dashboard');
      } else if (role === 'STORE_OWNER') {
        navigate('/owner-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '12px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;