import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Leaderboard: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Leaderboard
        </Typography>
        <Typography variant="body1">
          Global leaderboard with user rankings and achievements.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Leaderboard;
