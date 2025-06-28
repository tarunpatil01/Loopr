import { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import { useAlert } from '../context/AlertContext';
import RevenueExpenseChart from '../components/dashboard/RevenueExpenseChart';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import { transactionService } from '../services/api';
import DashboardStats from '../components/dashboard/DashboardStats';
import ErrorBoundary from '../components/dashboard/ErrorBoundary';
import CategoryPieChart from '../components/dashboard/CategoryPieChart';
import MonthlyBarChart from '../components/dashboard/MonthlyBarChart';
import ThemeToggle from '../components/shared/ThemeToggle';

const DashboardPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useAlert();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch analytics data
        const analyticsResponse = await transactionService.getTransactionAnalytics();
        if (analyticsResponse.success) {
          setAnalyticsData(analyticsResponse.data);
        }
        
        // Fetch recent transactions
        const transactionsResponse = await transactionService.getTransactions({
          page: 1,
          limit: 10,
          sortBy: 'date',
          sortOrder: 'desc'
        });
        
        if (transactionsResponse.success) {
          setTransactions(transactionsResponse.data.transactions);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [showError]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 0.5, sm: 2, md: 2 } }}>
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <DashboardStats />
        </Box>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid item xs={12} md={8}>
            {/* <Paper sx={{ p: { xs: 1, sm: 2, md: 3 },width: '100%' , height: '90%', background: '#1A1C22', color: '#fff', borderRadius: 3, boxShadow: 3 }} className="rounded-lg shadow-md"> */}
              <ErrorBoundary>
                <RevenueExpenseChart analyticsData={analyticsData} />
              </ErrorBoundary>
            {/* </Paper> */}
          </Grid>
          <Grid item xs={12} md={2}>
            {/* <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, background: '#1A1C22', color: '#fff', borderRadius: 3, boxShadow: 3 }} className="rounded-lg shadow mb-2"> */}
              
              <RecentTransactions />
            {/* </Paper> */}
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mt: 3, justifyContent: 'center' }}>
          <CategoryPieChart />
          <MonthlyBarChart />
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;
