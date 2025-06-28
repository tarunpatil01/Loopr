import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';
import transactionsData from '../../transactions.json';

const COLORS = ['#16F381', '#FFBB28', '#F44336', '#8884d8', '#00C49F', '#FF8042'];

const CategoryPieChart = () => {
  const data = useMemo(() => {
    const categoryTotals = {};
    transactionsData.forEach(tx => {
      const cat = tx.category;
      const amt = Number(tx.amount);
      if (cat && amt) {
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
      }
    });
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <Paper sx={{ background: '#1A1C22', borderRadius: 3, p: 2, boxShadow: 3, width: '100%', maxWidth: 400, mx: 'auto', mb: 3 }}>
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>Category Breakdown</Typography>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, idx) => <Cell key={entry.name} fill={COLORS[idx % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default CategoryPieChart;
