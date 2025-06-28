import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import transactionsData from '../../transactions.json';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const MonthlyBarChart = () => {
  const data = useMemo(() => {
    const monthly = Array(12).fill().map((_, i) => ({ name: monthNames[i], income: 0, expenses: 0 }));
    transactionsData.forEach(tx => {
      let amount = Number(tx.amount);
      let category = tx.category;
      let date = new Date(tx.date);
      if (!isNaN(date.getTime())) {
        const monthIndex = date.getMonth();
        if (category === 'Revenue' || category === 'Income') {
          monthly[monthIndex].income += amount;
        } else if (category === 'Expense' || category === 'Expenses') {
          monthly[monthIndex].expenses += amount;
        }
      }
    });
    return monthly;
  }, []);

  return (
    <Paper sx={{ background: '#1A1C22', borderRadius: 3, p: 2, boxShadow: 3, width: '100%', maxWidth: 700, mx: 'auto', mb: 3 }}>
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>Monthly Comparison</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#35394a" />
          <XAxis dataKey="name" style={{ fill: '#A3AED0' }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={value => `$${value}`} style={{ fill: '#A3AED0' }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" name="Income" fill="#16F381" />
          <Bar dataKey="expenses" name="Expenses" fill="#FFBB28" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default MonthlyBarChart;
