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
  Chip,
  Paper,
  IconButton
} from '@mui/material';
import {
  School,
  Science,
  Computer,
  History,
  MenuBook,
  Public,
  Movie,
  Calculate,
  Psychology,
  AccountBalance,
  PlayArrow,
  Shuffle
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuizStore } from '../store/quizStore';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { categories, startQuiz } = useQuizStore();

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      sports: <School />,
      science: <Science />,
      technology: <Computer />,
      history: <History />,
      literature: <MenuBook />,
      world: <Public />,
      entertainment: <Movie />,
      mathematics: <Calculate />,
      general: <Psychology />,
      political: <AccountBalance />
    };
    return iconMap[categoryName] || <School />;
  };

  const handleQuickStart = async (category: string, questionCount: number) => {
    await startQuiz({
      category,
      questionCount,
      difficulty: 'mixed',
      timeLimit: 60,
      shuffleQuestions: true,
      shuffleOptions: true
    });
    navigate(`/quiz/${category}`);
  };

  const handleRandomQuiz = async (questionCount: number) => {
    await startQuiz({
      category: 'random',
      questionCount,
      difficulty: 'mixed',
      timeLimit: 60,
      shuffleQuestions: true,
      shuffleOptions: true
    });
    navigate('/quiz/random');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants}>
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to QuizHub
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                mb: 4,
                fontWeight: 300
              }}
            >
              Test your knowledge across 10+ categories with enhanced features
            </Typography>
            
            {/* Stats */}
            <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap" mb={4}>
              <Chip
                label="2000+ Questions"
                sx={{
                  background: 'linear-gradient(45deg, #10b981, #34d399)',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              />
              <Chip
                label="10 Categories"
                sx={{
                  background: 'linear-gradient(45deg, #3b82f6, #60a5fa)',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              />
              <Chip
                label="React + TypeScript"
                sx={{
                  background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
                  color: '#000',
                  fontWeight: 600,
                  fontSize: '14px'
                }}
              />
            </Box>
          </Box>
        </motion.div>

        {/* Ultimate Challenge Section */}
        <motion.div variants={itemVariants}>
          <Paper
            sx={{
              p: 4,
              mb: 6,
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 4,
              textAlign: 'center'
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <Shuffle sx={{ fontSize: 40, color: '#6366f1', mr: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 600, color: '#6366f1' }}>
                Ultimate Challenge
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.8)' }}>
              Test yourself with questions from all categories in one epic quiz!
            </Typography>
            <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
              {[10, 20, 30, 50].map((count) => (
                <motion.div
                  key={count}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    onClick={() => handleRandomQuiz(count)}
                    sx={{
                      background: 'linear-gradient(45deg, #6366f1, #8b5cf6)',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      '&:hover': {
                        background: 'linear-gradient(45deg, #4f46e5, #7c3aed)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    {count}Q
                  </Button>
                </motion.div>
              ))}
            </Box>
          </Paper>
        </motion.div>

        {/* Categories Grid */}
        <motion.div variants={itemVariants}>
          <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', fontWeight: 600 }}>
            Choose Your Category
          </Typography>
          
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: category.color || '#6366f1'
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: '12px',
                            background: `${category.color}20`,
                            color: category.color,
                            mr: 2
                          }}
                        >
                          {getCategoryIcon(category.name)}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#ffffff'
                          }}
                        >
                          {category.displayName}
                        </Typography>
                      </Box>
                      
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          mb: 2,
                          lineHeight: 1.5
                        }}
                      >
                        {category.description}
                      </Typography>
                      
                      <Chip
                        label={`${category.questionCount} Questions`}
                        size="small"
                        sx={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: 500
                        }}
                      />
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Box display="flex" gap={1} width="100%" flexWrap="wrap">
                        {[10, 20, 30, 50].map((count) => (
                          <motion.div
                            key={count}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleQuickStart(category.name, count)}
                              sx={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: '#ffffff',
                                minWidth: 'auto',
                                width: 32,
                                height: 32,
                                fontSize: '12px',
                                fontWeight: 600,
                                '&:hover': {
                                  background: category.color,
                                  color: '#000'
                                }
                              }}
                            >
                              {count}
                            </IconButton>
                          </motion.div>
                        ))}
                      </Box>
                    </CardActions>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Home;
