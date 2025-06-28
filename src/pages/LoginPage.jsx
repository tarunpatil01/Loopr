import { useState } from 'react';
import { TextField, Button, Box, Typography, Paper, Avatar, Container } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const { showSuccess, showError } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      showError('Please enter both email and password');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(email, password);
      
      if (result.success) {
        showSuccess('Login successful!');
        navigate('/dashboard');
      } else {
        showError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      showError(error.message || 'An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen min-w-screen w-screen h-screen flex items-center justify-center bg-login-animated">
      <Container
        component="main"
        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl relative z-10 flex items-center justify-center"
        maxWidth={false}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Paper 
          elevation={6} 
          className="p-4 sm:p-6 md:p-8 rounded-xl shadow-lg bg-white/90 backdrop-blur"
        >
          <div className="flex flex-col items-center">
            <Avatar className="mb-4 bg-blue-600 w-16 h-16">
              <LockOutlined fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h5" className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
              Login to Loopr
            </Typography>
            <Box component="form" onSubmit={handleSubmit} className="w-full mt-2 md:mt-4">
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="mb-2 sm:mb-4"
                size="small"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="mb-4 sm:mb-6"
                size="small"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                className="mt-2 mb-2 sm:mt-4 sm:mb-4 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg normal-case text-base font-medium"
                style={{ minHeight: 40 }}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
              <div className="text-center mt-2 sm:mt-4">
                <Typography variant="body2" className="text-white">
                  Don't have an account yet?{' '}
                  <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-800">
                    Register here
                  </Link>
                </Typography>
              </div>
            </Box>
          </div>
        </Paper>
        <div className="mt-4 sm:mt-6 text-center absolute bottom-4 left-0 right-0">
          <Typography variant="caption" className="text-gray-500 text-xs sm:text-sm">
            Demo credentials: analyst@loopr.com / password123
          </Typography>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
