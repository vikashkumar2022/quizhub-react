import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  AccessTime,
  TrendingUp,
  Star,
  EmojiEvents,
  Refresh,
  Home,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { QuizResult } from '../types';
import { useQuizStore } from '../store/quizStore';

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { categories } = useQuizStore();
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const state = location.state as { result?: QuizResult };
    if (state?.result) {
      setResult(state.result);
    } else {
      // If no result found, redirect to home
      navigate('/');
    }
  }, [location.state, navigate]);

  const handleRetryQuiz = () => {
    if (result) {
      navigate(`/quiz/${result.quiz.category}`);
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  if (!result) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4">Loading Results...</Typography>
      </Container>
    );
  }

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'average': return '#f59e0b';
      default: return '#ef4444';
    }
  };

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'excellent': return <EmojiEvents sx={{ color: '#ffd700', fontSize: 48 }} />;
      case 'good': return <Star sx={{ color: '#c0c0c0', fontSize: 48 }} />;
      case 'average': return <TrendingUp sx={{ color: '#cd7f32', fontSize: 48 }} />;
      default: return <Refresh sx={{ color: '#ef4444', fontSize: 48 }} />;
    }
  };

  const categoryInfo = categories.find(cat => cat.id === result.quiz.category);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper sx={{ p: 4, textAlign: 'center', mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            {getRankIcon(result.rank)}
          </Box>
          
          <Typography variant="h3" sx={{ mb: 2, fontWeight: 700 }}>
            Quiz Completed!
          </Typography>
          
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.8 }}>
            {categoryInfo?.displayName || result.quiz.category}
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 1, color: getRankColor(result.rank) }}>
              {result.finalScore} / {result.totalQuestions * 100}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              Final Score
            </Typography>
          </Box>

          <Chip 
            label={result.rank.toUpperCase().replace('-', ' ')}
            sx={{ 
              backgroundColor: getRankColor(result.rank),
              color: 'white',
              fontWeight: 600,
              px: 2,
              py: 1,
              fontSize: '1rem'
            }}
          />
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
          <Paper sx={{ flex: 1, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckCircle sx={{ color: '#10b981', mr: 1 }} />
              <Typography variant="h6">Accuracy</Typography>
            </Box>
            <Typography variant="h4" sx={{ mb: 2, color: '#10b981' }}>
              {result.accuracy}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={result.accuracy} 
              sx={{ height: 8, borderRadius: 4, mb: 2 }}
            />
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {result.correctAnswers} / {result.totalQuestions} correct
            </Typography>
          </Paper>

          <Paper sx={{ flex: 1, p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTime sx={{ color: '#3b82f6', mr: 1 }} />
              <Typography variant="h6">Time Taken</Typography>
            </Box>
            <Typography variant="h4" sx={{ mb: 2, color: '#3b82f6' }}>
              {Math.floor(result.timeTaken / 60)}:{(result.timeTaken % 60).toString().padStart(2, '0')}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {result.timeTaken} seconds total
            </Typography>
          </Paper>
        </Box>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, textAlign: 'center' }}>
            Performance Breakdown
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h4" sx={{ color: '#10b981' }}>
                {result.correctAnswers}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Correct
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h4" sx={{ color: '#ef4444' }}>
                {result.totalQuestions - result.correctAnswers}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Incorrect
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h4" sx={{ color: '#f59e0b' }}>
                {result.accuracy}%
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Accuracy
              </Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center', minWidth: 120 }}>
              <Typography variant="h4" sx={{ color: '#8b5cf6' }}>
                {result.finalScore}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Score
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={<Refresh />}
            onClick={handleRetryQuiz}
            sx={{ minWidth: 160 }}
          >
            Try Again
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            startIcon={<Home />}
            onClick={handleHome}
            sx={{ minWidth: 160 }}
          >
            Home
          </Button>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Results;
