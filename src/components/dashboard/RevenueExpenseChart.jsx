import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Box, Typography, ToggleButtonGroup, ToggleButton, CircularProgress } from '@mui/material';
import { transactionService } from '../../services/api';

const demoData = [
  { name: 'Jan', income: 320, expenses: 220 },
  { name: 'Feb', income: 900, expenses: 100 },
  { name: 'Mar', income: 100, expenses: 300 },
  { name: 'Apr', income: 300, expenses: 90 },
  { name: 'May', income: 400, expenses: 120 },
  { name: 'Jun', income: 350, expenses: 200 },
  { name: 'Jul', income: 224, expenses: 400 },
  { name: 'Aug', income: 500, expenses: 300 },
  { name: 'Sep', income: 900, expenses: 700 },
  { name: 'Oct', income: 1100, expenses: 800 },
  { name: 'Nov', income: 700, expenses: 600 },
  { name: 'Dec', income: 600, expenses: 900 },
];

const COLORS = {
  income: '#16F381',
  expenses: '#FFBB28',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const income = payload.find(p => p.dataKey === 'income');
    return (
      <Box sx={{ background: '#16F381', color: '#fff', p: 2, borderRadius: 2, minWidth: 120, textAlign: 'center', boxShadow: 3 }}>
        <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700 }}>
          Income
        </Typography>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
          ${income ? income.value.toFixed(2) : '0.00'}
        </Typography>
        <Typography variant="caption" sx={{ color: '#232733' }}>{label}</Typography>
      </Box>
    );
  }
  return null;
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RevenueExpenseChart = () => {
  const [chartType, setChartType] = useState('line');
  const [chartData, setChartData] = useState(demoData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await transactionService.getTransactions({ limit: 1000, sortBy: 'date', sortOrder: 'asc' });
        if (response.success && response.data && Array.isArray(response.data.transactions) && response.data.transactions.length > 0) {
          const transactions = response.data.transactions;
          // Prepare monthly data
          const monthlyData = Array(12).fill().map((_, i) => ({
            name: monthNames[i],
            income: 0,
            expenses: 0
          }));
          transactions.forEach(tx => {
            let amount = Number(tx.amount?.$numberInt ?? tx.amount?.$numberDouble ?? tx.amount ?? 0);
            let category = tx.category;
            let dateStr = tx.date;
            let date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              const monthIndex = date.getMonth();
              if (category === 'Revenue' || category === 'Income') {
                monthlyData[monthIndex].income += amount;
              } else if (category === 'Expense' || category === 'Expenses') {
                monthlyData[monthIndex].expenses += amount;
              }
            }
          });
          setChartData(monthlyData);
        } else {
          setChartData(demoData);
        }
      } catch (e) {
        setChartData(demoData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [chartType]);

  const handleChartType = (event, newType) => {
    if (newType) setChartType(newType);
  };

  return (
    <Box sx={{ background: '#1a1c22', borderRadius: 3, p: 2, boxShadow: 3, width: '100%', minWidth: 600, maxWidth: 700, mx: '1' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>
          Overview
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: COLORS.income, mr: 1 }} />
            <Typography variant="body2" sx={{ color: '#fff' }}>Income</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: COLORS.expenses, mr: 1 }} />
            <Typography variant="body2" sx={{ color: '#FFBB28' }}>Expenses</Typography>
          </Box>
          <Box sx={{ ml: 2 }}>
            <ToggleButtonGroup value={chartType} exclusive size="small" sx={{ background: '#181B2A', borderRadius: 2 }} onChange={handleChartType}>
              <ToggleButton value="line" sx={{ color: '#fff', fontWeight: 600, px: 2, '&.Mui-selected': { background: '#232733', color: '#16F381' } }}>Monthly</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
      </Box>
      <Box sx={{ height: 350, width: 550 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#35394a" />
              <XAxis dataKey="name" style={{ fill: '#A3AED0' }} tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={value => `$${value}`}
                style={{ fill: '#A3AED0' }}
                domain={[0, 1200]}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#16F381', strokeDasharray: '3 3' }} />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke={COLORS.income}
                strokeWidth={3}
                dot={{ r: 5, stroke: COLORS.income, strokeWidth: 2, fill: '#232733' }}
                activeDot={{ r: 8, fill: COLORS.income, stroke: '#fff', strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke={COLORS.expenses}
                strokeWidth={3}
                dot={{ r: 5, stroke: COLORS.expenses, strokeWidth: 2, fill: '#232733' }}
                activeDot={{ r: 8, fill: COLORS.expenses, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default RevenueExpenseChart;
