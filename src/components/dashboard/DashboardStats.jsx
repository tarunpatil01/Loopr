import React, { useMemo } from 'react';
import { Box, Typography, Paper, Stack, Avatar } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';
import transactionsData from '../../transactions.json';

const DashboardStats = () => {
  // Calculate expenses and revenue sum
  const expenses = useMemo(() =>
    transactionsData.filter(tx => tx.category === 'Expense')
      .reduce((sum, tx) => sum + Number(tx.amount), 0),
    []
  );
  const revenue = useMemo(() =>
    transactionsData.filter(tx => tx.category === 'Revenue')
      .reduce((sum, tx) => sum + Number(tx.amount), 0),
    []
  );

  // Fixed values
  const savings = 12000;
  // Balance must be greater than savings
  const balance = Math.max(savings + 8000, 25000);

  const stats = [
    {
      label: 'Balance',
      value: balance,
      icon: <AccountBalanceWalletIcon sx={{ color: '#16F381', fontSize: 32 }} />, 
      active: false,
    },
    {
      label: 'Revenue',
      value: revenue,
      icon: <TrendingUpIcon sx={{ color: '#16F381', fontSize: 32 }} />, 
      active: false,
    },
    {
      label: 'Expenses',
      value: expenses,
      icon: <TrendingDownIcon sx={{ color: '#16F381', fontSize: 32 }} />, 
      active: false,
    },
    {
      label: 'Savings',
      value: savings,
      icon: <SavingsIcon sx={{ color: '#16F381', fontSize: 32 }} />, 
      active: false,
    },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: { xs: 2, sm: 2.5 },
        justifyContent: { xs: 'center', sm: 'center' },
        alignItems: 'center',
        mt: 1.5,
        mb: 1.5,
        width: '100%',
      }}
    >
      {stats.map((stat, idx) => (
        <Paper
          key={stat.label}
          elevation={5}
          sx={{
            background: '#1a1c22',
            borderRadius: 2.5,
            minWidth: { xs: 140, sm: 180, md: 220 },
            maxWidth: { xs: '90vw', sm: 250 },
            width: { xs: '100%', sm: 'auto' },
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 1.2, sm: 2 },
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            boxShadow: stat.active ? '0 0 0 2px #16F381' : '0 2px 12px 0 rgba(22,243,129,0.08)',
            border: stat.active ? '3px solid #16F381' : 'none',
            outline: stat.active ? '2px solid #16F38144' : 'none',
            transition: 'border 0.2s, box-shadow 0.2s, transform 0.2s, background 0.2s',
            cursor: 'pointer',
            '&:hover': {
              boxShadow: '0 0 0 3px #16F381, 0 4px 24px 0 #16F38122',
              border: '1px solid #16F381',
              background: '#232733',
              transform: 'translateY(-4px) scale(1.03)',
            },
          }}
        >
          <Box sx={{
            background: '#282c35',
            borderRadius: 2,
            width: { xs: 40, sm: 56 },
            height: { xs: 32, sm: 40 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: { xs: 1, sm: 1.5 },
            transition: 'background 0.2s',
            '&:hover': {
              background: '#16F38122',
            },
          }}>
            {React.cloneElement(stat.icon, { sx: { color: '#16F381', fontSize: { xs: 20, sm: 24 } } })}
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#fff', opacity: 0.8, fontWeight: 400, fontSize: { xs: 13, sm: 15 } }}>
              {stat.label}
            </Typography>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 500, fontSize: { xs: 16, sm: 22 }, mt: 0.2 }}>
              ${stat.value.toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default DashboardStats;
