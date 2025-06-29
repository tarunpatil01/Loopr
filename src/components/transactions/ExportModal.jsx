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
  CircularProgress,
  Chip
} from '@mui/material';
import { exportService } from '../../services/api';
import { useAlert } from '../../context/AlertContext';
import transactionsSample from '../../transactions.json'; // Use a sample of transactions for preview
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SearchIcon from '@mui/icons-material/Search';
import GetAppIcon from '@mui/icons-material/GetApp';
import DescriptionIcon from '@mui/icons-material/Description';

const ExportModal = ({ open, onClose, filters, onExportSuccess }) => {
  const [columns, setColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [filename, setFilename] = useState('transactions_export');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(columns);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setColumns(reordered);
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

  const filteredColumns = availableColumns.filter(col => col.label.toLowerCase().includes(search.toLowerCase()));

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
              Select and order columns to include in your export
            </Typography>
            {/* Export format */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="caption" sx={{ color: '#A3AED0', fontWeight: 600 }}>Format:</Typography>
              <Button
                variant={exportFormat === 'csv' ? 'contained' : 'outlined'}
                startIcon={<DescriptionIcon />}
                onClick={() => setExportFormat('csv')}
                sx={{ background: exportFormat === 'csv' ? '#16F381' : 'transparent', color: exportFormat === 'csv' ? '#181A20' : '#16F381', borderColor: '#16F381', '&:hover': { background: 'rgba(22,243,129,0.08)' } }}
              >
                CSV
              </Button>
              <Button
                variant={exportFormat === 'xlsx' ? 'contained' : 'outlined'}
                startIcon={<GetAppIcon />}
                onClick={() => setExportFormat('xlsx')}
                sx={{ background: exportFormat === 'xlsx' ? '#16F381' : 'transparent', color: exportFormat === 'xlsx' ? '#181A20' : '#16F381', borderColor: '#16F381', '&:hover': { background: 'rgba(22,243,129,0.08)' } }}
              >
                Excel
              </Button>
            </Box>
            {/* Search columns */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SearchIcon sx={{ color: '#A3AED0' }} />
              <TextField
                placeholder="Search columns..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                size="small"
                sx={{ input: { color: '#fff' }, width: 200 }}
              />
            </Box>
            {/* Drag and drop columns */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="columns-droppable" direction="horizontal">
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {columns.map((colId, idx) => {
                      const col = availableColumns.find(c => c.id === colId);
                      if (!col || !filteredColumns.some(fc => fc.id === colId)) return null;
                      return (
                        <Draggable key={colId} draggableId={colId} index={idx}>
                          {(providedDraggable) => (
                            <Chip
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              {...providedDraggable.dragHandleProps}
                              label={col.label}
                              onDelete={() => setColumns(columns.filter(c => c !== colId))}
                              sx={{ background: '#181C23', color: '#16F381', fontWeight: 700, mb: 1 }}
                            />
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
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
          startIcon={exportFormat === 'csv' ? <DescriptionIcon /> : <GetAppIcon />}
        >
          {loading ? (exportFormat === 'csv' ? 'Exporting CSV...' : 'Exporting Excel...') : (exportFormat === 'csv' ? 'Export CSV' : 'Export Excel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal;
