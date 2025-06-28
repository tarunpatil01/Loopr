import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Close as CloseIcon } from '@mui/icons-material';

const TransactionFilters = ({ filters, filterOptions, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local filters when prop filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      category: 'all',
      status: 'all',
      user_id: 'all',
      startDate: null,
      endDate: null,
      minAmount: '',
      maxAmount: ''
    };
    
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Box sx={{ background: '#232733', borderRadius: 3, p: 2, color: '#fff', boxShadow: 2 }}>
      <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} className="gap-y-2 md:gap-y-3">
        <Grid item>
          <FormControl fullWidth size="small" className="mb-2">
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={localFilters.category || 'all'}
              label="Category"
              onChange={(e) => handleChange('category', e.target.value)}
              className="text-xs md:text-sm"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {filterOptions.categories?.map((category) => (
                <MenuItem key={category} value={category} style={{ fontSize: window.innerWidth < 600 ? 12 : 14 }} className="text-xs md:text-sm">
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              value={localFilters.status || 'all'}
              label="Status"
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              {filterOptions.statuses?.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <FormControl fullWidth size="small">
            <InputLabel id="user-filter-label">User</InputLabel>
            <Select
              labelId="user-filter-label"
              value={localFilters.user_id || 'all'}
              label="User"
              onChange={(e) => handleChange('user_id', e.target.value)}
            >
              <MenuItem value="all">All Users</MenuItem>
              {filterOptions.userIds?.map((userId) => (
                <MenuItem key={userId} value={userId}>
                  {userId}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <DatePicker
            label="Start Date"
            value={localFilters.startDate ? new Date(localFilters.startDate) : null}
            onChange={(newValue) => handleChange('startDate', newValue ? newValue.toISOString() : null)}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />
        </Grid>

        <Grid item>
          <DatePicker
            label="End Date"
            value={localFilters.endDate ? new Date(localFilters.endDate) : null}
            onChange={(newValue) => handleChange('endDate', newValue ? newValue.toISOString() : null)}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />
        </Grid>

        <Grid item>
          <TextField
            fullWidth
            label="Min Amount"
            type="number"
            size="small"
            value={localFilters.minAmount || ''}
            onChange={(e) => handleChange('minAmount', e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item>
          <TextField
            fullWidth
            label="Max Amount"
            type="number"
            size="small"
            value={localFilters.maxAmount || ''}
            onChange={(e) => handleChange('maxAmount', e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item>
          <Box sx={{ display: 'flex', gap: 1, height: '100%', alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              size={window.innerWidth < 600 ? 'small' : 'medium'}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
              className="w-full sm:w-auto mb-2 sm:mb-0"
            >
              Apply Filters
            </Button>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              size={window.innerWidth < 600 ? 'small' : 'medium'}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransactionFilters;
