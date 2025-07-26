import React from 'react';
import { Container, Typography, Paper } from '@mui/material';

const Profile: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          User Profile
        </Typography>
        <Typography variant="body1">
          Profile component with user statistics, achievements, and preferences.
        </Typography>
      </Paper>
    </Container>
  );
};

export default Profile;
