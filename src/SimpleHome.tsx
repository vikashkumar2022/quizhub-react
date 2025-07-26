import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const categories = [
  {
    id: 'sports',
    displayName: 'Sports Arena',
    description: 'Test your knowledge of sports, athletes, and competitions',
    icon: '⚽',
    color: '#10b981',
    questionCount: 200,
  },
  {
    id: 'science',
    displayName: 'Science Lab',
    description: 'Explore the wonders of physics, chemistry, and biology',
    icon: '🧪',
    color: '#3b82f6',
    questionCount: 200,
  },
  {
    id: 'technology',
    displayName: 'Tech Innovation',
    description: 'Dive into the latest in technology and computing',
    icon: '💻',
    color: '#8b5cf6',
    questionCount: 200,
  },
  {
    id: 'history',
    displayName: 'Time Machine',
    description: 'Journey through historical events and civilizations',
    icon: '🏛️',
    color: '#f59e0b',
    questionCount: 200,
  }
];

const SimpleHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h1" gutterBottom>
          🎯 QuizHub
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          Challenge Your Mind with Dynamic Quizzes
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto' }}>
          Choose from various categories and test your knowledge with our interactive quiz platform.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={category.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 40px ${category.color}30`,
                },
              }}
              onClick={() => navigate(`/quiz/${category.id}`)}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontSize: '3rem', mb: 2 }}>
                  {category.icon}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {category.displayName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {category.description}
                </Typography>
                <Chip
                  label={`${category.questionCount} Questions`}
                  size="small"
                  sx={{ 
                    bgcolor: category.color + '20',
                    color: category.color,
                    border: `1px solid ${category.color}50`
                  }}
                />
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  sx={{ 
                    bgcolor: category.color,
                    '&:hover': { bgcolor: category.color + 'dd' }
                  }}
                >
                  Start Quiz
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SimpleHome;
