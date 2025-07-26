import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const TestComponent: React.FC = () => {
  return (
    <Container>
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h1" gutterBottom>
          🎯 QuizHub
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Your Dynamic Quiz Experience
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          The application is loading...
        </Typography>
      </Box>
    </Container>
  );
};

export default TestComponent;
