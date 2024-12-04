import React, { Component } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import SomethingWentWrong from './SomthingWentWrong';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can log the error to an error reporting service here
    this.setState({
      errorInfo: info,
    });
    console.error('Error caught in boundary: ', error);
  }

  handleReload = () => {
    // Reload the page when the user clicks the "Try Again" button
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Render the fallback UI when an error is caught
      return <SomethingWentWrong />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
