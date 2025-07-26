import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  LinearProgress,
  Chip,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  AccessTime,
  QuizOutlined,
  Star,
  Lightbulb,
  Skip,
  Casino,
  AccessAlarm,
  Help,
  Close
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { formatTime } from '../utils/quizUtils';

const Quiz: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { currentQuiz, updateQuiz, submitAnswer, useLifeline, nextQuestion, finishQuiz, abandonQuiz } = useQuizStore();
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [quitDialogOpen, setQuitDialogOpen] = useState(false);

  useEffect(() => {
    if (!currentQuiz) {
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuiz, navigate]);

  const handleTimeUp = () => {
    setShowResult(true);
    setTimeout(() => {
      nextQuestion();
      setShowResult(false);
      setSelectedAnswer('');
      setTimeLeft(currentQuiz?.settings.timeLimit || 60);
    }, 2000);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult || !currentQuiz) return;
    
    setSelectedAnswer(answer);
    const isCorrect = submitAnswer(answer, currentQuiz.settings.timeLimit - timeLeft);
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuiz.currentQuestionIndex + 1 >= currentQuiz.questions.length) {
        const result = finishQuiz();
        navigate('/results', { state: { result } });
      } else {
        nextQuestion();
        setShowResult(false);
        setSelectedAnswer('');
        setTimeLeft(currentQuiz.settings.timeLimit);
      }
    }, 2000);
  };

  const handleLifeline = (lifeline: 'fiftyFifty' | 'skipQuestion' | 'doubleChance' | 'extraTime' | 'hint') => {
    const success = useLifeline(lifeline);
    
    if (success) {
      switch (lifeline) {
        case 'extraTime':
          setTimeLeft(prev => prev + 30);
          break;
        case 'skipQuestion':
          setTimeout(() => {
            nextQuestion();
            setSelectedAnswer('');
            setTimeLeft(currentQuiz?.settings.timeLimit || 60);
          }, 1000);
          break;
      }
    }
  };

  const handleQuit = () => {
    abandonQuiz();
    navigate('/');
  };

  if (!currentQuiz) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4">Loading Quiz...</Typography>
      </Container>
    );
  }

  const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
  const progress = ((currentQuiz.currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Quiz Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {currentQuiz.category === 'random' ? 'Ultimate Challenge' : 
               currentQuiz.category.charAt(0).toUpperCase() + currentQuiz.category.slice(1)} Quiz
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setQuitDialogOpen(true)}
              size="small"
            >
              Quit
            </Button>
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              mb: 2,
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)'
              }
            }}
          />
          
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Question {currentQuiz.currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <AccessTime sx={{ fontSize: 20 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: timeLeft <= 10 ? '#ef4444' : '#ffffff',
                    fontWeight: 600,
                    minWidth: '60px'
                  }}
                >
                  {formatTime(timeLeft)}
                </Typography>
              </Box>
              <Chip 
                label={`Score: ${currentQuiz.score}`}
                sx={{ 
                  background: 'linear-gradient(45deg, #10b981, #34d399)',
                  color: '#000',
                  fontWeight: 600
                }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Lifelines */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)' }}>
            Lifelines
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {Object.entries(currentQuiz.lifelines).map(([lifeline, available]) => {
              const lifelineConfig = {
                fiftyFifty: { icon: <Casino />, label: '50:50', color: '#f59e0b' },
                skipQuestion: { icon: <Skip />, label: 'Skip', color: '#3b82f6' },
                doubleChance: { icon: <Star />, label: '2nd Chance', color: '#ec4899' },
                extraTime: { icon: <AccessAlarm />, label: '+30s', color: '#10b981' },
                hint: { icon: <Help />, label: 'Hint', color: '#8b5cf6' }
              };
              
              const config = lifelineConfig[lifeline as keyof typeof lifelineConfig];
              
              return (
                <motion.div
                  key={lifeline}
                  whileHover={available ? { scale: 1.05 } : {}}
                  whileTap={available ? { scale: 0.95 } : {}}
                >
                  <IconButton
                    onClick={() => handleLifeline(lifeline as any)}
                    disabled={!available}
                    sx={{
                      background: available ? `${config.color}20` : 'rgba(255, 255, 255, 0.1)',
                      color: available ? config.color : 'rgba(255, 255, 255, 0.3)',
                      border: `1px solid ${available ? config.color : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: 2,
                      flexDirection: 'column',
                      width: 64,
                      height: 64,
                      '&:hover': available ? {
                        background: `${config.color}30`,
                      } : {},
                      '&:disabled': {
                        opacity: 0.5
                      }
                    }}
                  >
                    {config.icon}
                    <Typography variant="caption" sx={{ fontSize: '10px', mt: 0.5 }}>
                      {config.label}
                    </Typography>
                  </IconButton>
                </motion.div>
              );
            })}
          </Box>
        </Paper>

        {/* Question */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                lineHeight: 1.4,
                fontWeight: 500
              }}
            >
              {question.question}
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={2}>
              {question.options.map((option, index) => {
                let buttonColor = 'rgba(255, 255, 255, 0.1)';
                let textColor = '#ffffff';
                
                if (showResult) {
                  if (option === question.answer) {
                    buttonColor = '#10b981';
                    textColor = '#000000';
                  } else if (option === selectedAnswer && option !== question.answer) {
                    buttonColor = '#ef4444';
                    textColor = '#ffffff';
                  }
                }
                
                return (
                  <motion.div
                    key={index}
                    whileHover={!showResult ? { scale: 1.02, x: 10 } : {}}
                    whileTap={!showResult ? { scale: 0.98 } : {}}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showResult}
                      sx={{
                        p: 3,
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: 500,
                        background: buttonColor,
                        color: textColor,
                        border: `1px solid ${buttonColor}`,
                        '&:hover': !showResult ? {
                          background: 'rgba(99, 102, 241, 0.2)',
                          border: '1px solid #6366f1',
                        } : {},
                        '&:disabled': {
                          color: textColor,
                          background: buttonColor,
                          border: `1px solid ${buttonColor}`,
                        }
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.2)',
                          mr: 2,
                          fontSize: '14px',
                          fontWeight: 600
                        }}
                      >
                        {String.fromCharCode(65 + index)}
                      </Box>
                      {option}
                    </Button>
                  </motion.div>
                );
              })}
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quit Confirmation Dialog */}
      <Dialog 
        open={quitDialogOpen} 
        onClose={() => setQuitDialogOpen(false)}
        PaperProps={{
          sx: {
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Quit Quiz?</Typography>
            <IconButton onClick={() => setQuitDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to quit? Your progress will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuitDialogOpen(false)}>
            Continue Quiz
          </Button>
          <Button onClick={handleQuit} color="error" variant="contained">
            Quit Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Quiz;
