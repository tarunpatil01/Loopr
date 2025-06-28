import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  TextField, 
  MenuItem, 
  InputAdornment,
  IconButton,
  Divider 
} from '@mui/material';
import { 
  Search as SearchIcon, 
  FilterList as FilterListIcon,
  GetApp as DownloadIcon 
} from '@mui/icons-material';
import { useAlert } from '../context/AlertContext';
import TransactionTable from '../components/transactions/TransactionTable';
import TransactionFilters from '../components/transactions/TransactionFilters';
import ExportModal from '../components/transactions/ExportModal';
import { transactionService } from '../services/api';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false,
    totalRecords: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    user_id: 'all',
    startDate: null,
    endDate: null,
    minAmount: '',
    maxAmount: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    statuses: [],
    userIds: [],
    dateRange: null,
    amountRange: null
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { showError, showSuccess } = useAlert();

  // Fetch transactions with current filters and pagination
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        const params = {
          page,
          limit: rowsPerPage,
          sortBy,
          sortOrder,
          search: searchTerm,
          ...filters
        };
        
        // Remove empty filters
        Object.keys(params).forEach(key => {
          if (params[key] === null || params[key] === '' || params[key] === 'all') {
            delete params[key];
          }
        });
        
        const response = await transactionService.getTransactions(params);
        
        if (response.success) {
          setTransactions(response.data.transactions);
          setPagination(response.data.pagination);
        } else {
          throw new Error(response.message || 'Failed to fetch transactions');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        showError('Failed to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [page, rowsPerPage, sortBy, sortOrder, searchTerm, filters, showError]);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await transactionService.getFilterOptions();
        
        if (response.success) {
          setFilterOptions(response.data);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
        showError('Failed to load filter options.');
      }
    };
    
    fetchFilterOptions();
  }, [showError]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1); // Reset to first page when sort changes
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage + 1); // MUI uses 0-based indexing
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleExportSuccess = () => {
    showSuccess('Export completed successfully. Your file is downloading.');
    setShowExportModal(false);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
      <Paper  sx={{ p: { xs: 1, sm: 2 },background: '#1a1c22', mb: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Transactions
          </Typography>
          <Box>
            <IconButton onClick={() => setShowFilters(!showFilters)} color={showFilters ? 'primary' : 'default'}>
              <FilterListIcon />
            </IconButton>
            <IconButton onClick={() => setShowExportModal(true)} color="primary">
              <DownloadIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ mb: 2 } }>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              background: '#232733',
              borderRadius: 2,
              border: '1.5px solid #16F381',
              color: '#fff',
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': {
                  borderColor: '#16F381',
                },
                '&:hover fieldset': {
                  borderColor: '#16F381',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#16F381',
                },
              },
              '& input': {
                color: '#fff',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#16F381' }} />
                </InputAdornment>
              ),
            }}
            size="small"
          />
        </Box>

        {showFilters && (
          <>
            <Divider sx={{ my: 2 }} />
            <TransactionFilters
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={handleFilterChange}
            />
          </>
        )}
      </Paper>

      <Paper sx={{ p: { xs: 1, sm: 2 }, background: '#1a1c22', color: '#fff', borderRadius: 3, boxShadow: 3 }}>
        <Box sx={{ background: '#1a1c22', borderRadius: 2 }}>
          <TransactionTable
            transactions={transactions}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSortChange}
            pagination={{
              page: pagination.current - 1, // Adjust for MUI's 0-based indexing
              count: pagination.totalRecords,
              rowsPerPage,
              onPageChange: handlePageChange,
              onRowsPerPageChange: handleRowsPerPageChange
            }}
          />
        </Box>
      </Paper>

      <ExportModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        filters={filters}
        onExportSuccess={handleExportSuccess}
      />
    </Container>
  );
};

export default TransactionsPage;
