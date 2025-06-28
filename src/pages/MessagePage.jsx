import { Box, Typography } from '@mui/material';

const MessagePage = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4" sx={{ color: '#16F381', fontWeight: 700, mb: 2 }}>Messages</Typography>
    <Typography variant="body1" sx={{ color: '#fff' }}>Your messages and notifications will appear here.</Typography>
    <Typography variant="body1" sx={{ color: '#fff', mt: 2 }}>Website under construction.</Typography>
  </Box>
);

export default MessagePage;
