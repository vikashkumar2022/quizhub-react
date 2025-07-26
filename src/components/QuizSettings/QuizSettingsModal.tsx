import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  Close,
  QuestionMark,
  Timer,
  Speed,
  PlayArrow,
} from '@mui/icons-material';
import { QuizSettings, Difficulty } from '../../types';

interface QuizSettingsModalProps {
  open: boolean;
  onClose: () => void;
  onStartQuiz: (settings: QuizSettings) => void;
  categoryId: string;
  categoryName: string;
}

const QuizSettingsModal: React.FC<QuizSettingsModalProps> = ({
  open,
  onClose,
  onStartQuiz,
  categoryId,
  categoryName,
}) => {
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [timePerQuestion, setTimePerQuestion] = useState<number>(30);

  const questionOptions = [10, 20, 30, 50];
  const difficultyOptions: { value: Difficulty; label: string; color: string }[] = [
    { value: 'easy', label: 'Easy', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'hard', label: 'Hard', color: '#ef4444' },
  ];
  
  const timeOptions = [
    { value: 30, label: '30 Seconds', icon: '⚡' },
    { value: 60, label: '1 Minute', icon: '⏱️' },
    { value: 120, label: '2 Minutes', icon: '🕐' },
  ];

  const handleStartQuiz = () => {
    const settings: QuizSettings = {
      category: categoryId,
      questionCount,
      difficulty,
      timeLimit: timePerQuestion,
      shuffleQuestions: true,
      shuffleOptions: true,
    };
    
    onStartQuiz(settings);
    onClose();
  };

  const getDifficultyDescription = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'Basic questions, perfect for beginners';
      case 'medium': return 'Balanced challenge for most players';
      case 'hard': return 'Expert level questions for true masters';
    }
  };

  const getTimeDescription = (time: number) => {
    switch (time) {
      case 30: return 'Quick thinking required';
      case 60: return 'Balanced pace for consideration';
      case 120: return 'Plenty of time to think through';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Quiz Settings - {categoryName}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {/* Number of Questions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <QuestionMark sx={{ mr: 1, color: '#3b82f6' }} />
            Number of Questions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {questionOptions.map((count) => (
              <Card
                key={count}
                sx={{
                  minWidth: 100,
                  cursor: 'pointer',
                  border: questionCount === count ? '2px solid #3b82f6' : '1px solid #e0e0e0',
                  backgroundColor: questionCount === count ? '#f0f8ff' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transform: 'translateY(-2px)',
                  }
                }}
                onClick={() => setQuestionCount(count)}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: questionCount === count ? '#3b82f6' : 'inherit' }}>
                    {count}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    Questions
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Difficulty Level */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Speed sx={{ mr: 1, color: '#f59e0b' }} />
            Difficulty Level
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {difficultyOptions.map((diff) => (
              <Card
                key={diff.value}
                sx={{
                  minWidth: 120,
                  cursor: 'pointer',
                  border: difficulty === diff.value ? `2px solid ${diff.color}` : '1px solid #e0e0e0',
                  backgroundColor: difficulty === diff.value ? `${diff.color}15` : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transform: 'translateY(-2px)',
                  }
                }}
                onClick={() => setDifficulty(diff.value)}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: difficulty === diff.value ? diff.color : 'inherit',
                      mb: 1 
                    }}
                  >
                    {diff.label}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.75rem' }}>
                    {getDifficultyDescription(diff.value)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Time Per Question */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <Timer sx={{ mr: 1, color: '#10b981' }} />
            Time Per Question
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {timeOptions.map((time) => (
              <Card
                key={time.value}
                sx={{
                  minWidth: 140,
                  cursor: 'pointer',
                  border: timePerQuestion === time.value ? '2px solid #10b981' : '1px solid #e0e0e0',
                  backgroundColor: timePerQuestion === time.value ? '#f0fff4' : 'transparent',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transform: 'translateY(-2px)',
                  }
                }}
                onClick={() => setTimePerQuestion(time.value)}
              >
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                    {time.icon}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600, 
                      color: timePerQuestion === time.value ? '#10b981' : 'inherit',
                      mb: 1 
                    }}
                  >
                    {time.label}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.75rem' }}>
                    {getTimeDescription(time.value)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>

        {/* Summary */}
        <Card sx={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>
              Quiz Summary
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={`${questionCount} Questions`} 
                color="primary" 
                variant="outlined"
              />
              <Chip 
                label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} 
                sx={{ 
                  backgroundColor: difficultyOptions.find(d => d.value === difficulty)?.color,
                  color: 'white'
                }}
              />
              <Chip 
                label={`${timePerQuestion}s per question`} 
                color="success" 
                variant="outlined"
              />
            </Box>
            <Typography variant="body2" sx={{ mt: 2, color: '#64748b' }}>
              Estimated time: {Math.ceil((questionCount * timePerQuestion) / 60)} minutes
            </Typography>
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} size="large">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleStartQuiz}
          size="large"
          startIcon={<PlayArrow />}
          sx={{ minWidth: 140 }}
        >
          Start Quiz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QuizSettingsModal;
