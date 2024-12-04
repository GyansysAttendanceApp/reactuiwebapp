import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // If you are using React Router for navigation
import { Home as HomeIcon } from '@mui/icons-material';

const PageNotFound = () => {
  return (
    <Container
      sx={{
        display: 'flex',
        // flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '85vh',
        //     textAlign: 'center',
        //     backgroundColor: '#f5f5f5',
        //     padding: 3,
      }}
    >
      <Box
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '30px',
          boxShadow: 3,
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: '6rem',
            fontWeight: 'bold',
            color: '#ff6f61',
            marginBottom: 2,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h5"
          sx={{
            marginBottom: 3,
            color: '#333',
          }}
        >
          Oops! Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 4,
            color: '#777',
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
          }}
        >
          <HomeIcon sx={{ marginRight: 1 }} />
          Go Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default PageNotFound;
