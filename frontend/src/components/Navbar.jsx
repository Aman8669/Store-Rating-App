import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [openPassModal, setOpenPassModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    // Password validation: 8-16 chars, 1 uppercase, 1 special char
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    if (!passwordRegex.test(newPassword)) {
      setMsg({ type: 'error', text: 'New password must be 8-16 chars with 1 Uppercase & 1 Special character.' });
      return;
    }

    try {
      await API.put('/auth/update-password', { oldPassword, newPassword });
      setMsg({ type: 'success', text: 'Password updated successfully!' });
      setTimeout(() => {
        setOpenPassModal(false);
        setOldPassword('');
        setNewPassword('');
        setMsg({ type: '', text: '' });
      }, 1500);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
    }
  };

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B' }}>
            StoreRating Platform
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user.role && (
              <Chip
                label={user.role.replace('_', ' ')}
                color="primary"
                size="small"
                sx={{ fontWeight: 600, fontSize: '11px' }}
              />
            )}

            <Button
              variant="outlined"
              startIcon={<LockResetIcon />}
              onClick={() => setOpenPassModal(true)}
              sx={{
                height: '40px',
                borderRadius: '10px',
                borderColor: '#CBD5E1',
                color: '#334155',
                fontWeight: 600,
                fontSize: '13px',
                textTransform: 'none',
                '&:hover': { borderColor: '#94A3B8', backgroundColor: '#F8FAFC' },
              }}
            >
              Update Password
            </Button>

            <Button
              variant="contained"
              startIcon={<LogoutRoundedIcon />}
              onClick={handleLogout}
              sx={{
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '14px',
                textTransform: 'none',
                px: 2.5,
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  backgroundColor: '#DC2626',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Password Update Modal */}
      <Dialog open={openPassModal} onClose={() => setOpenPassModal(false)} PaperProps={{ sx: { borderRadius: '12px', p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Update Password</DialogTitle>
        <form onSubmit={handlePasswordChange}>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1, minWidth: '320px' }}>
            {msg.text && <Alert severity={msg.type}>{msg.text}</Alert>}
            <TextField
              type="password"
              label="Old Password *"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              fullWidth
            />
            <TextField
              type="password"
              label="New Password *"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="8-16 chars, 1 Uppercase & 1 Special char"
              required
              fullWidth
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenPassModal(false)} sx={{ color: '#64748B' }}>Cancel</Button>
            <Button type="submit" variant="contained" sx={{ borderRadius: '8px' }}>Update</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default Navbar;