import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  LinearProgress,
  Paper
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

const SimpleQuiz: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fileName = category === 'general' ? 'general_knowledge' : category;
        const response = await fetch(`/data/${fileName}.json`);
        
        if (response.ok) {
          const data = await response.json();
          // Take first 10 questions for demo
          setQuestions(data.questions.slice(0, 10));
        } else {
          // Fallback demo questions
          setQuestions([
            {
              question: "What is the capital of Australia?",
              options: ["Sydney", "Melbourne", "Brisbane", "Canberra"],
              answer: "Canberra"
            },
            {
              question: "Which planet is known as the Red Planet?",
              options: ["Venus", "Mars", "Jupiter", "Saturn"],
              answer: "Mars"
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback demo questions
        setQuestions([
          {
            question: "What is 2 + 2?",
            options: ["3", "4", "5", "6"],
            answer: "4"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestions();
  }, [category]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentIndex].answer) {
      setScore(score + 1);
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
    } else {
      setShowResult(true);
    }
  };

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5">Loading {category} questions...</Typography>
        </Paper>
      </Container>
    );
  }

  if (showResult) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            🎉 Quiz Complete!
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Your Score: {score} / {questions.length}
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            {score === questions.length 
              ? "Perfect! You got all questions right! 🌟"
              : score >= questions.length * 0.7 
              ? "Great job! You did really well! 👏"
              : "Good effort! Keep practicing! 💪"
            }
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Quiz'}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body2">
              Question {currentIndex + 1} of {questions.length}
            </Typography>
            <Typography variant="body2">
              Score: {score}
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} />
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {currentQuestion.question}
            </Typography>
            <Box sx={{ mt: 3 }}>
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "contained" : "outlined"}
                  fullWidth
                  sx={{ 
                    mb: 2, 
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    py: 2
                  }}
                  onClick={() => handleAnswerSelect(option)}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            sx={{ minWidth: 120 }}
          >
            {currentIndex + 1 === questions.length ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SimpleQuiz;
