import { Box, Typography } from '@mui/material';
import WalletStats from '../components/dashboard/WalletStats';

const WalletPage = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4" sx={{ color: '#16F381', fontWeight: 700, mb: 2 }}>Wallet</Typography>
    <WalletStats />
    <Typography variant="body1" sx={{ color: '#fff' }}>Your wallet overview and transactions will appear here.</Typography>
    <Typography variant="body1" sx={{ color: '#fff', mt: 2 }}>Website under construction.</Typography>
  </Box>
);

export default WalletPage;
