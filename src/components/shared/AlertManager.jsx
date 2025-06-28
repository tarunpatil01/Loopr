import { useEffect, forwardRef } from 'react';
import { Snackbar, Alert as MuiAlert, IconButton, Box, useTheme } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAlert } from '../../context/AlertContext';

// Custom Alert component with styling
const Alert = forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} sx={{ background: '#232733', color: '#16F381', fontWeight: 600 }} />;
});

const AlertManager = () => {
  const { alerts, removeAlert } = useAlert();
  const theme = useTheme();

  // Handle alert removal
  const handleClose = (id) => {
    removeAlert(id);
  };

  // Position alerts at the top of the page
  const alertStyle = {
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.snackbar,
    width: '100%',
    maxWidth: '400px'
  };

  return (
    <Box className="fixed top-4 right-4 z-[1200] w-full max-w-xs sm:max-w-sm">
      {alerts.map((alert, index) => (
        <Snackbar
          key={alert.id}
          open={true}
          sx={{
            ...alertStyle,
            top: `${theme.spacing(2 + index * 8)}`,
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          className="mb-2"
        >
          <Alert
            severity={alert.type}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => handleClose(alert.id)}
                className="ml-2"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            className="text-xs md:text-sm"
          >
            {alert.message}
          </Alert>
        </Snackbar>
      ))}
    </Box>
  );
};

export default AlertManager;
