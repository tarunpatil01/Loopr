import React from 'react';
import { Box, Typography } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, textAlign: 'center', minHeight: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'error.main' }}>
          <Typography variant="h6">Something went wrong rendering the chart.</Typography>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
