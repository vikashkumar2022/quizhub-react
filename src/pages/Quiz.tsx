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
  SkipNext,
  Casino,
  AccessAlarm,
  Help,
  Close,
  Pause,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';
import { formatTime } from '../utils/quizUtils';

const Quiz: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { currentQuiz, updateQuiz, submitAnswer, useLifeline, nextQuestion, previousQuestion, goToQuestion, finishQuiz, abandonQuiz, startQuiz, pauseQuiz } = useQuizStore();
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [quitDialogOpen, setQuitDialogOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [finalResult, setFinalResult] = useState<any>(null);

  useEffect(() => {
    const initializeQuiz = async () => {
      if (!currentQuiz && category) {
        // If no quiz exists, start a new one with default settings
        await startQuiz({
          category,
          questionCount: 10,
          difficulty: 'mixed',
          timeLimit: 60,
          shuffleQuestions: true,
          shuffleOptions: true
        });
      }
      setIsInitializing(false);
    };

    initializeQuiz();
  }, [category, currentQuiz, startQuiz]);

  useEffect(() => {
    if (!currentQuiz && !isInitializing) {
      navigate('/');
      return;
    }

    if (currentQuiz) {
      setTimeLeft(currentQuiz.settings.timeLimit);
      
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
    }
  }, [currentQuiz, navigate, isInitializing]);

  const handleTimeUp = () => {
    setShowResult(true);
    setTimeout(() => {
      nextQuestion();
      setShowResult(false);
      setSelectedAnswer('');
      setTimeLeft(currentQuiz?.settings.timeLimit || 30);
    }, 2000);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult || !currentQuiz) return;
    
    setSelectedAnswer(answer);
    const isCorrect = submitAnswer(answer, currentQuiz.settings.timeLimit - timeLeft);
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuiz.currentQuestionIndex + 1 >= currentQuiz.questions.length) {
        console.log('Quiz completed! Preparing result...');
        
        // Calculate result data using actual quiz data BEFORE calling finishQuiz
        const correctAnswers = currentQuiz.correctAnswers;
        const totalQuestions = currentQuiz.questions.length;
        const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
        const timeTaken = Math.round((Date.now() - new Date(currentQuiz.startTime).getTime()) / 1000);
        
        const rank = accuracy >= 90 ? 'excellent' :
                     accuracy >= 75 ? 'good' :
                     accuracy >= 60 ? 'average' : 'needs-improvement';

        const result = {
          quiz: currentQuiz,
          finalScore: currentQuiz.score,
          accuracy,
          correctAnswers,
          totalQuestions,
          timeTaken,
          rank,
          achievements: []
        };
        
        console.log('Quiz result prepared:', result);
        console.log('Current score:', currentQuiz.score, 'Correct answers:', correctAnswers);
        
        // Set result and show score card FIRST
        setFinalResult(result);
        setShowScoreCard(true);
        console.log('Score card should show now');
        
        // Don't call finishQuiz automatically - let user close manually
        // The close button will handle navigation
      } else {
        // Auto-progression to next question after showing answer
        setShowResult(false);
        setSelectedAnswer('');
        nextQuestion();
      }
    }, 2000);
  };

  const handleLifeline = (lifeline: 'fiftyFifty' | 'skipQuestion' | 'doubleChance' | 'extraTime' | 'hint') => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
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
    if (currentQuiz) {
      // Show score before quitting
      const correctAnswers = currentQuiz.correctAnswers;
      const totalQuestions = currentQuiz.questions.length;
      const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
      const timeTaken = Math.round((Date.now() - new Date(currentQuiz.startTime).getTime()) / 1000);
      
      const rank = accuracy >= 90 ? 'excellent' :
                   accuracy >= 75 ? 'good' :
                   accuracy >= 60 ? 'average' : 'needs-improvement';
      
      const result = {
        quiz: currentQuiz,
        finalScore: currentQuiz.score,
        accuracy,
        correctAnswers,
        totalQuestions,
        timeTaken,
        rank,
        achievements: []
      };
      
      setFinalResult(result);
      setShowScoreCard(true);
      setQuitDialogOpen(false);
      
      // Abandon quiz after showing score
      setTimeout(() => {
        abandonQuiz();
      }, 100);
    } else {
      abandonQuiz();
      navigate('/');
    }
  };

  if (isInitializing || !currentQuiz) {
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
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => {
                  pauseQuiz();
                  navigate('/');
                }}
                size="small"
                startIcon={<Pause />}
              >
                Pause
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setQuitDialogOpen(true)}
                size="small"
              >
                Quit
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  console.log('Test button clicked');
                  if (currentQuiz) {
                    const correctAnswers = currentQuiz.correctAnswers;
                    const totalQuestions = currentQuiz.questions.length;
                    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
                    const timeTaken = Math.round((Date.now() - new Date(currentQuiz.startTime).getTime()) / 1000);
                    
                    const rank = accuracy >= 90 ? 'excellent' :
                                 accuracy >= 75 ? 'good' :
                                 accuracy >= 60 ? 'average' : 'needs-improvement';
                    
                    const testResult = {
                      quiz: currentQuiz,
                      finalScore: currentQuiz.score,
                      accuracy,
                      correctAnswers,
                      totalQuestions,
                      timeTaken,
                      rank,
                      achievements: []
                    };
                    console.log('Test result:', testResult);
                    setFinalResult(testResult);
                    setShowScoreCard(true);
                  }
                }}
                size="small"
              >
                Check Score
              </Button>
            </Box>
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
                skipQuestion: { icon: <SkipNext />, label: 'Skip', color: '#3b82f6' },
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

      {/* Navigation Controls */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        sx={{ mt: 3, mx: 2 }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            setShowResult(false);
            setSelectedAnswer('');
            previousQuestion();
          }}
          disabled={showResult || currentQuiz?.currentQuestionIndex === 0}
          startIcon={<ArrowBack />}
          sx={{
            color: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: '#6366f1',
              background: 'rgba(99, 102, 241, 0.1)'
            },
            '&:disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Previous
        </Button>

        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
          {currentQuiz ? `${currentQuiz.currentQuestionIndex + 1} of ${currentQuiz.questions.length}` : ''}
        </Typography>

        <Button
          variant="outlined"
          onClick={() => {
            setShowResult(false);
            setSelectedAnswer('');
            nextQuestion();
          }}
          disabled={showResult || (currentQuiz ? currentQuiz.currentQuestionIndex >= currentQuiz.questions.length - 1 : true)}
          endIcon={<ArrowForward />}
          sx={{
            color: '#ffffff',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: '#6366f1',
              background: 'rgba(99, 102, 241, 0.1)'
            },
            '&:disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Next
        </Button>
      </Box>

      {/* Score Card Modal */}
      <Dialog
        open={showScoreCard}
        onClose={() => {}}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 2, position: 'relative' }}>
          <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
            <Button
              onClick={() => {
                setShowScoreCard(false);
                setFinalResult(null);
                finishQuiz(); // Call finishQuiz when user manually closes
                navigate('/'); // Navigate back to home
              }}
              sx={{
                minWidth: 'auto',
                width: 40,
                height: 40,
                borderRadius: '50%',
                color: 'rgba(255, 255, 255, 0.7)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff'
                }
              }}
            >
              <Close />
            </Button>
          </Box>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              🎉
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              Quiz Completed!
            </Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Here's your score
            </Typography>
          </motion.div>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', py: 3 }}>
          {finalResult && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper sx={{ 
                p: 4, 
                mb: 3, 
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))', 
                border: '1px solid rgba(99, 102, 241, 0.4)',
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)'
                }
              }}>
                <Typography variant="h1" sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '3.5rem'
                }}>
                  {finalResult.finalScore}
                </Typography>
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                  out of {Math.round(1200 / finalResult.totalQuestions) * finalResult.totalQuestions} points
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
                  {finalResult.correctAnswers} correct out of {finalResult.totalQuestions} questions
                </Typography>
              </Paper>

              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#10b981', fontWeight: 700 }}>
                      {finalResult.accuracy}%
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500 }}>
                      Accuracy
                    </Typography>
                  </Box>
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: '#3b82f6', fontWeight: 700 }}>
                      {Math.floor(finalResult.timeTaken / 60)}:{(finalResult.timeTaken % 60).toString().padStart(2, '0')}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500 }}>
                      Time Taken
                    </Typography>
                  </Box>
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ 
                      color: finalResult.rank === 'excellent' ? '#10b981' : 
                             finalResult.rank === 'good' ? '#3b82f6' : 
                             finalResult.rank === 'average' ? '#f59e0b' : '#ef4444',
                      fontWeight: 700 
                    }}>
                      {finalResult.rank === 'excellent' ? '🏆' : 
                       finalResult.rank === 'good' ? '⭐' : 
                       finalResult.rank === 'average' ? '📈' : '💪'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.7, fontWeight: 500 }}>
                      {finalResult.rank.charAt(0).toUpperCase() + finalResult.rank.slice(1).replace('-', ' ')}
                    </Typography>
                  </Box>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{ display: 'flex', gap: 16, width: '100%', justifyContent: 'center' }}
          >
            <Button
              onClick={() => {
                setShowScoreCard(false);
                navigate('/results', { state: { result: finalResult } });
              }}
              variant="contained"
              size="large"
              sx={{ 
                minWidth: 150,
                py: 1.5,
                fontWeight: 600,
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                }
              }}
            >
              View Details
            </Button>
            <Button
              onClick={() => {
                setShowScoreCard(false);
                navigate('/');
              }}
              variant="outlined"
              size="large"
              sx={{ 
                minWidth: 150,
                py: 1.5,
                fontWeight: 600,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: '#6366f1',
                  background: 'rgba(99, 102, 241, 0.1)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Home
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>

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
