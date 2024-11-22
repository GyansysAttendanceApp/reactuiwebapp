import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom'; // If using React Router for navigation

const SomethingWentWrong = () => {
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f8d7da',
        padding: 3,
      }}
    >
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: 3,
          width: '100%',
          maxWidth: '500px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ErrorIcon
          sx={{
            fontSize: '4rem',
            color: '#dc3545',
            marginBottom: 2,
          }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            color: '#721c24',
            marginBottom: 3,
            fontFamily: "'Roboto', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textDecoration: 'underline dashed #dc3545', // Broken underline effect
            transform: 'rotate(-1deg)',
          }}
        >
          Something Went Wrong
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 4,
            color: '#721c24',
            fontFamily: "'Roboto', sans-serif",
            letterSpacing: '0.5px',
            fontSize: '1.1rem',
            transform: 'rotate(2deg)', // Slight rotation to make it feel "broken"
          }}
        >
          Oops! Something went wrong on our side. We're working on it.
        </Typography>

        <Button
          variant="contained"
          color="error"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            backgroundColor: '#dc3545',
            '&:hover': {
              backgroundColor: '#c82333',
            },
          }}
          component={Link}
          to="/"
        >
          Go Back to Home
        </Button>

        <Box
          sx={{
            position: 'absolute',
            bottom: '0',
            left: '-30%',
            right: '-30%',
            top: '40%',
            height: '20px',
            backgroundColor: '#dc3545',
            transform: 'rotate(15deg)',
            zIndex: -1,
            borderRadius: '50%',
          }}
        />
      </Box>
    </Container>
  );
};

export default SomethingWentWrong;
