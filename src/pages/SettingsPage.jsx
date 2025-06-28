import { Box, Typography, Paper } from '@mui/material';

const SettingsPage = () => (
  <Box sx={{ p: { xs: 2, sm: 4 }, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Typography variant="h4" sx={{ color: '#16F381', fontWeight: 700, mb: 2 }}>Settings</Typography>
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, background: '#1A1C22', color: '#fff', borderRadius: 3, maxWidth: 500, width: '100%', textAlign: 'center' }}>
      <Typography variant="body1" sx={{ mb: 1 }}>
        Settings management coming soon!
      </Typography>
      <Typography variant="body2" sx={{ color: '#A3AED0' }}>
        Here you will be able to update your preferences and application settings.
      </Typography>
    </Paper>
  </Box>
);

export default SettingsPage;
