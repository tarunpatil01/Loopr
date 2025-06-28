import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Button, Paper, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import transactionsData from '../../transactions.json';

const RecentTransactions = () => {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    // Sort by date descending and take the 5 most recent
    const sorted = [...transactionsData]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    setRecent(sorted);
  }, []);

  return (
    <Paper elevation={3} sx={{
      background: '#1A1C22',
      borderRadius: 3,
      p: 3,
      boxShadow: '0 2px 12px 0 rgba(22,243,129,0.08)',
      mb: 3,
      minWidth: 350,
      mx: 'auto',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h7" sx={{ color: '#fff', fontWeight: 600 }}>
          Recent Transactions
        </Typography>
        <Button 
          component={Link} 
          to="/transactions" 
          size="small" 
          // variant="outlined" 
          sx={{ borderColor: '#16F381', color: '#16F381', fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
        >
          See All
        </Button>
      </Box>
      <Stack spacing={2}>
        {recent.map((tx) => (
          <Box key={tx.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 2, background: '#232733cc' }}>
            <Avatar src={tx.user_profile} alt={tx.user_id} sx={{ width: 44, height: 44, border: '2px solid #16F381' }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: '#fff', fontWeight: 600 }}>{tx.user_id}</Typography>
              <Typography sx={{ color: '#A3AED0', fontSize: 14 }}>{new Date(tx.date).toLocaleDateString()}</Typography>
            </Box>
            <Typography sx={{ color: tx.category === 'Expense' ? '#F44336' : '#16F381', fontWeight: 700 }}>
              {tx.category === 'Expense' ? <span style={{color:'#F44336'}}>- ${tx.amount.toLocaleString()}</span> : <span style={{color:'#16F381'}}>+${tx.amount.toLocaleString()}</span>}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default RecentTransactions;
