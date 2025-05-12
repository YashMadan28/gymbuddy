import React from 'react';
import { Typography, Button, Box } from '@mui/material';

/**
 * ErrorBoundary is used to catch runtime errors
 * in child components and display a fallback UI instead of crashing the app.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // Initialize state to track whether an error has occurred
    this.state = { hasError: false };
  }

  /**
   * Triggered when a child component throws an error.
   * Used to update the state and render fallback UI.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  /**
   * Log error details for debugging.
   * Called after getDerivedStateFromError.
   */
  componentDidCatch(error, errorInfo) {
    console.error('Error:', error, errorInfo);
  }

  /**
   * Render method decides whether to show fallback UI or normal children.
   */
  render() {
    if (this.state.hasError) {
      // Fallback UI shown when an error occurs
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h5">Something went wrong</Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Reload Page
          </Button>
        </Box>
      );
    }

    // If no error, render child components normally
    return this.props.children;
  }
}

export default ErrorBoundary;
