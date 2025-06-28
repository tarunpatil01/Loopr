import { useState, useEffect, useMemo } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Box,
  Divider,
  CircularProgress
} from '@mui/material';
import { exportService } from '../../services/api';
import { useAlert } from '../../context/AlertContext';
import transactionsSample from '../../transactions.json'; // Use a sample of transactions for preview

const ExportModal = ({ open, onClose, filters, onExportSuccess }) => {
  const [columns, setColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [filename, setFilename] = useState('transactions_export');
  const [loading, setLoading] = useState(false);
  const { showError } = useAlert();

  // Fetch available columns when modal opens
  useEffect(() => {
    if (open) {
      fetchAvailableColumns();
    }
  }, [open]);

  const fetchAvailableColumns = async () => {
    try {
      setLoading(true);
      const response = await exportService.getExportColumns();
      
      if (response.success) {
        setAvailableColumns(response.data);
        // By default select common columns
        setColumns(['id', 'date', 'amount', 'category', 'status', 'user_id']);
      } else {
        showError('Failed to load export columns');
      }
    } catch (error) {
      console.error('Error fetching export columns:', error);
      showError('Failed to load export options');
    } finally {
      setLoading(false);
    }
  };

  const handleColumnChange = (columnId) => {
    setColumns(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(col => col !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  };

  const handleSelectAll = () => {
    if (columns.length === availableColumns.length) {
      setColumns([]);
    } else {
      setColumns(availableColumns.map(col => col.id));
    }
  };

  const handleExport = async () => {
    if (columns.length === 0) {
      showError('Please select at least one column to export');
      return;
    }

    try {
      setLoading(true);
      
      const exportData = {
        columns,
        filters,
        filename
      };
      
      const response = await exportService.exportToCsv(exportData);
      
      if (response.success) {
        onExportSuccess();
      }
    } catch (error) {
      console.error('Export error:', error);
      showError('Failed to generate export. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Preset column sets
  const presets = [
    { name: 'Minimal', columns: ['id', 'date', 'amount'] },
    { name: 'Standard', columns: ['id', 'date', 'amount', 'category', 'status'] },
    { name: 'Full', columns: availableColumns.map(col => col.id) }
  ];

  // Preview data (first 3 rows)
  const previewRows = useMemo(() => {
    if (!availableColumns.length || !columns.length) return [];
    return transactionsSample.slice(0, 3).map(row =>
      columns.reduce((acc, col) => {
        acc[col] = row[col];
        return acc;
      }, {})
    );
  }, [columns, availableColumns]);

  // Filter summary
  const filterSummary = useMemo(() => {
    const summary = [];
    if (filters.category && filters.category !== 'all') summary.push(`Category: ${filters.category}`);
    if (filters.status && filters.status !== 'all') summary.push(`Status: ${filters.status}`);
    if (filters.user_id && filters.user_id !== 'all') summary.push(`User: ${filters.user_id}`);
    if (filters.startDate) summary.push(`From: ${new Date(filters.startDate).toLocaleDateString()}`);
    if (filters.endDate) summary.push(`To: ${new Date(filters.endDate).toLocaleDateString()}`);
    if (filters.minAmount) summary.push(`Min: $${filters.minAmount}`);
    if (filters.maxAmount) summary.push(`Max: $${filters.maxAmount}`);
    return summary.length ? summary.join(' | ') : 'No filters applied';
  }, [filters]);

  return (
    <Dialog 
      open={open} 
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          m: { xs: 1, sm: 2 },
          width: { xs: '98%', sm: '100%' },
          background: '#232733',
          borderRadius: 3,
          color: '#fff',
        },
        className: 'rounded-lg shadow',
      }}
    >
      <DialogTitle sx={{ fontSize: { xs: 18, sm: 22 }, color: '#16F381', fontWeight: 700 }} className="text-lg md:text-xl font-semibold">
        Export Transactions
      </DialogTitle>
      <DialogContent sx={{ px: { xs: 1, sm: 3 } }} className="px-2 md:px-6">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="body1" gutterBottom sx={{ fontSize: { xs: 14, sm: 16 } }} className="mb-2">
              Select columns to include in your export
            </Typography>
            {/* Presets */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" sx={{ color: '#A3AED0', fontWeight: 600 }}>Quick Presets:</Typography>
              {presets.map(preset => (
                <Button
                  key={preset.name}
                  variant="outlined"
                  size="small"
                  sx={{ mx: 0.5, my: 0.5, color: '#16F381', borderColor: '#16F381', '&:hover': { background: 'rgba(22,243,129,0.08)' } }}
                  onClick={() => setColumns(preset.columns)}
                >
                  {preset.name}
                </Button>
              ))}
            </Box>
            {/* Filename */}
            <Box sx={{ mb: 2, mt: 1 }}>
              <TextField
                label="Filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                fullWidth
                variant="outlined"
                margin="dense"
                helperText="The export will be downloaded as a CSV file"
                size={window.innerWidth < 600 ? 'small' : 'medium'}
                className="mb-2"
              />
            </Box>
            {/* Filter summary */}
            <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(22,243,129,0.05)', borderRadius: 1 }}>
              <Typography variant="caption" sx={{ color: '#A3AED0' }}>
                <b>Filters:</b> {filterSummary}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            {/* Column selection */}
            <Box sx={{ mb: 2 }}>
              <Button 
                onClick={handleSelectAll}
                color="primary"
                size={window.innerWidth < 600 ? 'small' : 'medium'}
                className="mb-2"
                sx={{ color: '#fff', borderColor: '#16F381', '&:hover': { borderColor: '#16F381', background: 'rgba(22,243,129,0.08)' } }}
              >
                {columns.length === availableColumns.length ? 'Deselect All' : 'Select All'}
              </Button>
            </Box>
            <FormGroup row className="mb-2" sx={{ flexWrap: 'wrap' }}>
              {availableColumns.map((column) => (
                <FormControlLabel
                  key={column.id}
                  control={
                    <Checkbox
                      checked={columns.includes(column.id)}
                      onChange={() => handleColumnChange(column.id)}
                      size={window.innerWidth < 600 ? 'small' : 'medium'}
                    />
                  }
                  label={<span className="text-xs md:text-sm">{column.label}</span>}
                  className="mb-1"
                  sx={{ minWidth: 160 }}
                />
              ))}
            </FormGroup>
            {/* Preview */}
            <Box sx={{ mt: 3, mb: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#16F381', mb: 1 }}>Preview (first 3 rows):</Typography>
              <Box sx={{ overflowX: 'auto', bgcolor: '#181C23', borderRadius: 1, p: 1 }}>
                <table style={{ width: '100%', fontSize: 13, color: '#fff' }}>
                  <thead>
                    <tr>
                      {columns.map(col => (
                        <th key={col} style={{ padding: 4, borderBottom: '1px solid #232733', color: '#16F381', fontWeight: 700 }}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, idx) => (
                      <tr key={idx}>
                        {columns.map(col => (
                          <td key={col} style={{ padding: 4, borderBottom: '1px solid #232733' }}>
                            {row[col] ?? ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {previewRows.length === 0 && (
                  <Typography variant="caption" sx={{ color: '#A3AED0' }}>No preview available</Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }} className="rounded bg-gray-100">
              <Typography variant="caption" sx={{ fontSize: { xs: 10, sm: 12 } }} className="text-xs">
                Your export will include current filter settings, if any.
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: { xs: 1, sm: 3 }, pb: { xs: 1, sm: 2 } }} className="px-2 md:px-6 pb-2">
        <Button onClick={onClose} disabled={loading} size={window.innerWidth < 600 ? 'small' : 'medium'} className="mr-2" sx={{ color: '#fff', borderColor: '#16F381', '&:hover': { borderColor: '#16F381', background: 'rgba(22,243,129,0.08)' } }}>
          Cancel
        </Button>
        <Button 
          onClick={handleExport} 
          color="primary" 
          variant="contained"
          disabled={loading || columns.length === 0}
          size={window.innerWidth < 600 ? 'small' : 'medium'}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          sx={{ background: '#16F381', color: '#181A20', fontWeight: 700, '&:hover': { background: '#13c06b' } }}
        >
          {loading ? 'Exporting...' : 'Export CSV'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal;
