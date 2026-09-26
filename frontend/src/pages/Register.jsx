import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText, Alert, CircularProgress } from '@mui/material';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import API from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'NORMAL_USER', // Default Role selection
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, address, password } = formData;

    // Requirement: Name length 20 - 60 chars
    if (name.length < 20 || name.length > 60) {
      return 'Full Name must be between 20 and 60 characters long.';
    }

    if (!email.includes('@')) {
      return 'Please enter a valid email address.';
    }

    // Address limit 400 chars
    if (address.length > 400) {
      return 'Address cannot exceed 400 characters.';
    }

    // Password requirement
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return 'Password must be 8-16 characters long, with 1 uppercase & 1 special character.';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await API.post('/auth/register', formData);
      alert('Registration Successful! Please Log In.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', p: 2 }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '440px',
          p: 4,
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
          border: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center', color: '#1E293B', mb: 3 }}>
          Sign Up
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Full Name */}
          <TextField
            fullWidth
            label="Full Name *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            helperText={`${formData.name.length}/60 chars (Must be between 20-60 characters)`}
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />

          {/* Email */}
          <TextField
            fullWidth
            type="email"
            label="Email Address *"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="alice@example.com"
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />

          {/* Address */}
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Address *"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter full address"
            helperText="Maximum 400 characters"
            required
            inputProps={{ maxLength: 400 }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />

          {/* Password */}
          <TextField
            fullWidth
            type="password"
            label="Password *"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            helperText="8-16 chars, 1 uppercase & 1 special character"
            required
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />

          {/* Role Selection Dropdown */}
          <FormControl fullWidth required sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}>
            <InputLabel id="role-select-label">Register As</InputLabel>
            <Select
              labelId="role-select-label"
              name="role"
              value={formData.role}
              label="Register As *"
              onChange={handleChange}
            >
              <MenuItem value="NORMAL_USER">Normal User (Customer)</MenuItem>
              <MenuItem value="STORE_OWNER">Store Owner</MenuItem>
              <MenuItem value="SYSTEM_ADMIN">System Admin</MenuItem>
            </Select>
            <FormHelperText>Select your account access role</FormHelperText>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddRoundedIcon />}
            sx={{
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '14px',
              textTransform: 'none',
              mt: 1,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              '&:hover': {
                backgroundColor: '#4338CA',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              },
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748B', mt: 3 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: 600 }}>
            Log In
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Register;