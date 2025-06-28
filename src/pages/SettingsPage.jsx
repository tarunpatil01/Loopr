import { Box, Typography, Paper, Switch, FormControlLabel } from '@mui/material';
import { useThemeContext } from '../context/ThemeContext';

const SettingsPage = () => {
  const { mode, toggleTheme } = useThemeContext();
  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ color: '#16F381', fontWeight: 700, mb: 2 }}>Settings</Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, background: '#1A1C22', color: '#fff', borderRadius: 3, maxWidth: 500, width: '100%', textAlign: 'center', mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Settings management coming soon!
        </Typography>
        <Typography variant="body2" sx={{ color: '#A3AED0' }}>
          Here you will be able to update your preferences and application settings.
        </Typography>
      </Paper>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, background: '#232733', color: '#fff', borderRadius: 3, maxWidth: 500, width: '100%', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Theme Preference</Typography>
        <FormControlLabel
          control={<Switch checked={mode === 'dark'} onChange={toggleTheme} color="success" />}
          label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
        />
      </Paper>
    </Box>
  );
};

export default SettingsPage;
