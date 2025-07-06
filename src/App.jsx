import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import AlertManager from './components/shared/AlertManager';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import WalletPage from './pages/WalletPage';
import MessagePage from './pages/MessagePage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useState, useMemo } from 'react';
import { ThemeProviderCustom } from './context/ThemeContext';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const [mode, setMode] = useState('dark');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === 'dark' ? '#282c35' : '#f4f6fa',
            paper: mode === 'dark' ? '#282c35' : '#fff',
          },
          primary: {
            main: '#16F381',
            contrastText: '#181C23',
          },
          secondary: {
            main: '#00C6FB',
            contrastText: '#181C23',
          },
          error: {
            main: '#FF5C5C',
          },
          success: {
            main: '#16F381',
          },
          text: {
            primary: mode === 'dark' ? '#fff' : '#181C23',
            secondary: mode === 'dark' ? '#A3AED0' : '#232733',
          },
        },
        typography: {
          fontFamily: [
            'Inter',
            'system-ui',
            'Avenir',
            'Helvetica',
            'Arial',
            'sans-serif',
          ].join(','),
          fontWeightBold: 700,
          fontWeightMedium: 600,
          fontWeightRegular: 500,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                backgroundImage: 'none',
              },
            },
          },
        },
      }),
    [mode]
  );
  const toggleTheme = () => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AlertProvider>
          <Router>
            <AuthProvider>
              <ThemeProviderCustom mode={mode} toggleTheme={toggleTheme}>
                <AlertManager />
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Layout toggleTheme={toggleTheme} mode={mode} />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="transactions" element={<TransactionsPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="wallet" element={<WalletPage />} />
                    {/* <Route path="personal" element={<PersonalPage />} /> */}
                    <Route path="message" element={<MessagePage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </ThemeProviderCustom>
            </AuthProvider>
          </Router>
        </AlertProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
