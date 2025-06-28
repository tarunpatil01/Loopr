import { Box, Typography, TextField, Button, Stack, Paper, MenuItem } from '@mui/material';
import { useEffect, useState } from 'react';
import api, { authService } from '../services/api';

const roleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'viewer', label: 'Viewer' },
];

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', firstName: '', lastName: '', role: '' });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        // Always fetch from backend for latest info
        const res = await api.get('/users/profile');
        const localUser = res.data.data;
        setUser(localUser);
        setForm({
          username: localUser.username || '',
          email: localUser.email || '',
          firstName: localUser.firstName || '',
          lastName: localUser.lastName || '',
          role: localUser.role || '',
        });
      } catch (e) {
        setError('Failed to load user info');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.put('/users/profile', form);
      setUser(res.data.data);
      setEditMode(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handlePasswordSave = async () => {
    setPasswordError('');
    setPasswordSuccess(false);
    if (!passwords.newPassword || passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    try {
      await api.put('/users/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordSuccess(true);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setPasswordError('Failed to change password');
    }
  };

  if (loading) return <Typography sx={{ color: '#fff', p: 4 }}>Loading...</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ color: '#16F381', fontWeight: 700, mb: 2 }}>Profile</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
        <Paper sx={{ flex: 1, p: 3, background: '#232733', borderRadius: 3, mb: { xs: 3, md: 0 } }}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              InputProps={{ readOnly: !editMode }}
              sx={{ input: { color: '#fff' } }}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              InputProps={{ readOnly: !editMode }}
              sx={{ input: { color: '#fff' } }}
              fullWidth
            />
            <TextField
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              InputProps={{ readOnly: !editMode }}
              sx={{ input: { color: '#fff' } }}
              fullWidth
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              InputProps={{ readOnly: !editMode }}
              sx={{ input: { color: '#fff' } }}
              fullWidth
            />
            <TextField
              select
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              InputProps={{ readOnly: !editMode }}
              sx={{ input: { color: '#fff' } }}
              fullWidth
              disabled={!editMode}
            >
              {roleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Stack direction="row" spacing={2}>
              {editMode ? (
                <>
                  <Button variant="contained" color="success" onClick={handleSave} disabled={loading}>
                    Save
                  </Button>
                  <Button variant="outlined" color="inherit" onClick={() => { setEditMode(false); setForm({ ...user }); }}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="contained" color="primary" onClick={() => setEditMode(true)}>
                  Edit
                </Button>
              )}
            </Stack>
            {success && <Typography sx={{ color: '#16F381' }}>Profile updated!</Typography>}
            {error && <Typography sx={{ color: '#F44336' }}>{error}</Typography>}
          </Stack>
        </Paper>
        <Paper sx={{ flex: 1, p: 3, background: '#232733', borderRadius: 3 }}>
          <Typography variant="h6" sx={{ color: '#16F381', mb: 2 }}>Change Password</Typography>
          <Stack spacing={2}>
            <TextField
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              sx={{ input: { color: '#fff' } }}
              fullWidth
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              sx={{ input: { color: '#fff' } }}
              fullWidth
            />
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              sx={{ input: { color: '#fff' } }}
              fullWidth
            />
            <Button variant="contained" color="success" onClick={handlePasswordSave}>
              Change Password
            </Button>
            {passwordError && <Typography sx={{ color: '#F44336' }}>{passwordError}</Typography>}
            {passwordSuccess && <Typography sx={{ color: '#16F381' }}>Password changed successfully!</Typography>}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
};

export default ProfilePage;
