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
      p: { xs: 1.5, sm: 2, md: 3 },
      boxShadow: '0 2px 12px 0 rgba(22,243,129,0.08)',
      mb: 3,
      minWidth: { xs: '90vw', sm: 320, md: 350 },
      maxWidth: 500,
      width: { xs: '100%', sm: 'auto' },
      mx: 'auto',
    }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, mb: 2, gap: { xs: 1, sm: 0 } }}>
        <Typography variant="h7" sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: 16, sm: 18 } }}>
          Recent Transactions
        </Typography>
        <Button 
          component={Link} 
          to="/transactions" 
          size="small" 
          sx={{ borderColor: '#16F381', color: '#16F381', fontWeight: 600, borderRadius: 2, textTransform: 'none', fontSize: { xs: 13, sm: 15 }, mt: { xs: 1, sm: 0 } }}
        >
          See All
        </Button>
      </Box>
      <Stack spacing={1.5}>
        {recent.map((tx) => (
          <Box key={tx.id} sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: { xs: 1, sm: 2 },
            p: 1,
            borderRadius: 2,
            background: '#232733cc',
            width: '100%',
          }}>
            <Avatar src={tx.user_profile} alt={tx.user_id} sx={{ width: { xs: 36, sm: 44 }, height: { xs: 36, sm: 44 }, border: '2px solid #16F381', mb: { xs: 0.5, sm: 0 } }} />
            <Box sx={{ flex: 1, width: '100%' }}>
              <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: { xs: 15, sm: 16 } }}>{tx.user_id}</Typography>
              <Typography sx={{ color: '#A3AED0', fontSize: { xs: 12, sm: 14 } }}>{new Date(tx.date).toLocaleDateString()}</Typography>
            </Box>
            <Typography sx={{ color: tx.category === 'Expense' ? '#F44336' : '#16F381', fontWeight: 700, fontSize: { xs: 15, sm: 16 }, mt: { xs: 0.5, sm: 0 } }}>
              {tx.category === 'Expense' ? <span style={{color:'#F44336'}}>- ${tx.amount.toLocaleString()}</span> : <span style={{color:'#16F381'}}>+${tx.amount.toLocaleString()}</span>}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default RecentTransactions;
