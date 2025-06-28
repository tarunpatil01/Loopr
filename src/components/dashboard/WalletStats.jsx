import React, { useMemo } from 'react';
import { Box, Typography, Paper, Stack, Avatar, Tooltip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';
import transactionsData from '../../transactions.json';

const WalletStats = () => {
  const expenses = useMemo(() =>
    transactionsData.filter(tx => tx.category === 'Expense')
      .reduce((sum, tx) => sum + Number(tx.amount), 0),
    []
  );
  const savings = 12000;
  const balance = Math.max(savings + 8000, 25000);

  const stats = [
    {
      label: 'Balance',
      value: balance,
      icon: <AccountBalanceWalletIcon sx={{ color: '#16F381' }} fontSize="large" />, 
      color: '#232733',
      display: <><span style={{color:'#16F381'}}>+${balance.toLocaleString()}</span></>,
      tooltip: `Total Balance: $${balance.toLocaleString()}`,
    },
    {
      label: 'Expenses',
      value: expenses,
      icon: <TrendingDownIcon sx={{ color: '#F44336' }} fontSize="large" />, 
      color: '#232733',
      display: <><span style={{color:'#F44336'}}>- ${expenses.toLocaleString()}</span></>,
      tooltip: `Total Expenses: $${expenses.toLocaleString()}`,
    },
    {
      label: 'Savings',
      value: savings,
      icon: <SavingsIcon sx={{ color: '#16F381' }} fontSize="large" />, 
      color: '#232733',
      display: <><span style={{color:'#16F381'}}>+${savings.toLocaleString()}</span></>,
      tooltip: `Total Savings: $${savings.toLocaleString()}`,
    },
  ];

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'center' }}>
      {stats.map((stat) => {
        const card = (
          <Paper key={stat.label} elevation={3} sx={{
            minWidth: 140,
            px: 7,
            py: 2,
            borderRadius: 3,
            background: '#1A1C22',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 2px 12px 0 rgba(22,243,129,0.08)',
          }}>
            <Avatar sx={{ bgcolor: '#181B2A', width: 48, height: 48, mb: 1, boxShadow: '0 2px 8px #16F38133' }}>
              {stat.icon}
            </Avatar>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 500 }}>
              {stat.label}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 500 }}>
              {stat.display}
            </Typography>
          </Paper>
        );
        return (
          <Tooltip key={stat.label} title={stat.tooltip || ''} arrow placement="top">
            <span>{card}</span>
          </Tooltip>
        );
      })}
    </Stack>
  );
};

export default WalletStats;
