import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { transactionService } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#16F381', '#F44336', '#FFBB28', '#0088FE', '#00C49F', '#FF8042'];

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await transactionService.getTransactions({ limit: 1000 });
        if (response.success && response.data && response.data.transactions) {
          setTransactions(response.data.transactions);
          // Category breakdown
          const catMap = {};
          response.data.transactions.forEach(tx => {
            catMap[tx.category] = (catMap[tx.category] || 0) + Number(tx.amount);
          });
          setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })));
          // Status breakdown (always show Paid and Pending)
          const statusMap = { Paid: 0, Pending: 0 };
          response.data.transactions.forEach(tx => {
            if (statusMap.hasOwnProperty(tx.status)) {
              statusMap[tx.status] += 1;
            } else {
              statusMap[tx.status] = 1;
            }
          });
          // Ensure both Paid and Pending are present
          setStatusData(Object.entries(statusMap).map(([name, value]) => ({ name, value })));
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" sx={{ color: '#16F381', fontWeight: 700, mb: 3, textAlign: 'center' }}>Analytics</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 6, background: '#1A1C22', color: '#fff', borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ color: '#16F381', mb: 4 }}>Category Breakdown</Typography>
            <ResponsiveContainer width={300}  height={350} className="analytics-pie-chart">
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {categoryData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, background: '#1A1C22', color: '#fff', borderRadius: 3, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ color: '#16F381', mb: 2 }}>Status Breakdown</Typography>
            <ResponsiveContainer width={300} height={400} className="analytics-bar-chart">
              <BarChart data={statusData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#35394a" />
                <XAxis dataKey="name" style={{ fill: '#A3AED0' }} />
                <YAxis allowDecimals={false} style={{ fill: '#A3AED0' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#16F381" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
      <Paper sx={{ mt: 5, p: { xs: 2, sm: 4 }, background: '#181B2A', color: '#fff', borderRadius: 3, boxShadow: 2, maxWidth: 900, mx: 'auto', textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: '#16F381', mb: 1 }}>
          Insights
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          - The majority of your transactions are in the <b>"{categoryData[0]?.name || 'N/A'}"</b> category.
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          - Most transactions have a status of <b>"{statusData[0]?.name || 'N/A'}"</b>.
        </Typography>
        <Typography variant="body2" sx={{ color: '#A3AED0' }}>
          More advanced analytics and trends coming soon!
        </Typography>
      </Paper>
    </Box>
  );
};

export default AnalyticsPage;
