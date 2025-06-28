import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Box,
  Paper,
  CircularProgress,
  Avatar,
  Chip,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import { visuallyHidden } from '@mui/utils';

// Helper to format currency amounts
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Helper to format dates
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (error) {
    return 'Invalid date';
  }
};

const TransactionTable = ({
  transactions = [],
  loading = false,
  isPaginated = true,
  isSimplified = false,
  sortBy = 'date',
  sortOrder = 'desc',
  onSort,
  pagination = null
}) => {
  // Column definitions
  const columns = [
    { id: 'id', label: 'ID', minWidth: 70 },
    { id: 'date', label: 'Date', minWidth: 100 },
    { id: 'amount', label: 'Amount', minWidth: 120, align: 'right' },
    { id: 'category', label: 'Category', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 120 },
  ];

  // Add user column only for detailed view
  if (!isSimplified) {
    columns.push({ id: 'user_id', label: 'User', minWidth: 150 });
  }

  const handleSort = (property) => {
    if (onSort) {
      onSort(property);
    }
  };

  // Render status chip with appropriate color
  const renderStatusChip = (status) => {
    let chipStyle = {};
    switch (status) {
      case 'Paid':
      case 'Completed':
        chipStyle = { background: 'rgba(22,243,129,0.12)', color: '#16F381', fontWeight: 700 };
        break;
      case 'Pending':
        chipStyle = { background: 'rgba(255,193,7,0.12)', color: '#FFC107', fontWeight: 700 };
        break;
      case 'Failed':
        chipStyle = { background: 'rgba(244,67,54,0.12)', color: '#F44336', fontWeight: 700 };
        break;
      default:
        chipStyle = { background: '#2D3142', color: '#A3AED0' };
    }
    return <Chip label={status} size="small" sx={chipStyle} />;
  };

  // Render category with background color
  const renderCategory = (category) => {
    let bgColor = category === 'Revenue' ? 'rgba(22,243,129,0.12)' : 'rgba(244,67,54,0.12)';
    let textColor = category === 'Revenue' ? '#16F381' : '#F44336';
    return (
      <Chip 
        label={category} 
        size="small" 
        sx={{ backgroundColor: bgColor, color: textColor, fontWeight: 700 }}
      />
    );
  };

  // Render amount with + green for revenue, - red for expense
  const renderAmount = (transaction) => {
    const isExpense = transaction.category === 'Expense';
    const color = isExpense ? '#F44336' : '#16F381';
    const sign = isExpense ? '-' : '+';
    return (
      <span style={{ color, fontWeight: 700 }}>
        {sign}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}
      </span>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render empty state
  if (transactions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No transactions found</Typography>
      </Box>
    );
  }

  // Custom simplified list for dashboard recent transactions
  if (isSimplified) {
    return (
      <Box sx={{ width: '100' }}>
        {transactions.map((tx, idx) => (
          <Box key={tx.id || idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, px: 0, borderBottom: idx !== transactions.length - 1 ? '1px solid #232733' : 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar src={tx.user_profile || `https://randomuser.me/api/portraits/men/${idx+30}.jpg`} sx={{ width: 36, height: 36, mr: 1 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                  {tx.user_name || tx.name || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#A3AED0', fontSize: 13 }}>
                  {tx.type === 'credit' ? 'Transfers from' : 'Transfers to'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: 15 }}>
                {renderAmount(tx)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#A3AED0', fontSize: 12 }}>
                {format(new Date(tx.date), 'EEE, d MMM yyyy')}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }} className="w-full">
      <TableContainer
        className="rounded-lg shadow"
        sx={{
          background: '#1a1c22', // Changed from #232733
          color: '#fff',
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Table stickyHeader aria-label="transaction table" size={window.innerWidth < 600 ? 'small' : 'medium'} className="text-xs md:text-sm">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, fontSize: window.innerWidth < 600 ? 12 : 14, color: '#16F381', background: '#1a1c22', borderBottom: '1px solid #2D3142' }}
                  sortDirection={sortBy === column.id ? sortOrder : false}
                  className="font-semibold"
                >
                  {onSort ? (
                    <TableSortLabel
                      active={sortBy === column.id}
                      direction={sortBy === column.id ? sortOrder : 'desc'}
                      onClick={() => handleSort(column.id)}
                      sx={{ color: '#16F381',
                        '& .MuiTableSortLabel-icon': { color: '#16F381 !important' },
                      }}
                    >
                      {column.label}
                      {sortBy === column.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction, idx) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={transaction.id} sx={{ fontSize: window.innerWidth < 600 ? 12 : 14, background: idx % 2 === 0 ? '#1a1c22' : '#232733' }} className="hover:bg-gray-50">
                {columns.map((column) => {
                  const value = transaction[column.id];
                  return (
                    <TableCell key={column.id} align={column.align} sx={{ fontSize: window.innerWidth < 600 ? 12 : 14, color: '#fff', borderBottom: '1px solid #2D3142', background: '#1a1c22' }} className="py-2 px-3">
                      {column.id === 'date' ? (
                        <span style={{ color: '#A3AED0' }}>{formatDate(value)}</span>
                      ) : column.id === 'amount' ? (
                        renderAmount(transaction)
                      ) : column.id === 'status' ? (
                        renderStatusChip(value)
                      ) : column.id === 'category' ? (
                        renderCategory(value)
                      ) : column.id === 'user_id' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={transaction.user_profile || `https://randomuser.me/api/portraits/men/${(idx % 50) + 1}.jpg`} 
                            sx={{ width: 24, height: 24, mr: 1 }}
                          />
                          {value}
                        </Box>
                      ) : (
                        <span style={{ color: column.id === 'id' ? '#A3AED0' : '#fff' }}>{value}</span>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isPaginated && pagination && (
        <TablePagination
          rowsPerPageOptions={window.innerWidth < 600 ? [5, 10] : [5, 10, 25, 50]}
          component="div"
          count={pagination.count || 0}
          rowsPerPage={pagination.rowsPerPage || 10}
          page={pagination.page || 0}
          onPageChange={pagination.onPageChange}
          onRowsPerPageChange={pagination.onRowsPerPageChange}
          sx={{ background: '#1a1c22', color: '#fff', borderTop: '1px solid #2D3142' }}
        />
      )}
    </Box>
  );
};

export default TransactionTable;
