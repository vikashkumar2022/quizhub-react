import { Question, QuestionData } from '../types';

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Load questions from a specific category
 */
export const loadQuestionsByCategory = async (category: string): Promise<Question[]> => {
  try {
    const fileName = category === 'random' ? 'general_knowledge' : category;
    const response = await fetch(`/data/${fileName}.json`);
    
    if (!response.ok) {
      throw new Error(`Failed to load ${category} questions`);
    }
    
    const data: QuestionData = await response.json();
    
    // Add unique IDs and format questions
    return data.questions.map((q, index) => ({
      id: `${category}_${index}`,
      question: q.question,
      options: q.options,
      answer: q.answer,
      difficulty: q.difficulty || 'medium',
      category: category,
      explanation: q.explanation,
      timeLimit: q.timeLimit || 60
    }));
  } catch (error) {
    console.error(`Error loading ${category} questions:`, error);
    return getBackupQuestions(category);
  }
};

/**
 * Get backup questions if the JSON file fails to load
 */
export const getBackupQuestions = (category: string): Question[] => {
  const backupQuestions = {
    general: [
      {
        id: 'backup_1',
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        answer: "Paris",
        difficulty: 'easy' as const,
        category: 'general'
      },
      {
        id: 'backup_2',
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        answer: "Mars",
        difficulty: 'easy' as const,
        category: 'general'
      }
    ],
    science: [
      {
        id: 'backup_3',
        question: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Gd", "Go"],
        answer: "Au",
        difficulty: 'medium' as const,
        category: 'science'
      },
      {
        id: 'backup_4',
        question: "What is the speed of light in vacuum?",
        options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
        answer: "300,000 km/s",
        difficulty: 'medium' as const,
        category: 'science'
      }
    ]
  };

  return backupQuestions[category as keyof typeof backupQuestions] || backupQuestions.general;
};

/**
 * Load questions for random quiz from multiple categories
 */
export const loadRandomQuestions = async (questionCount: number): Promise<Question[]> => {
  const categories = ['sports', 'science', 'technology', 'history', 'literature', 
                     'world', 'entertainment', 'mathematics', 'general_knowledge', 'political'];
  
  const allQuestions: Question[] = [];
  const questionsPerCategory = Math.ceil(questionCount / categories.length);
  
  for (const category of categories) {
    try {
      const categoryQuestions = await loadQuestionsByCategory(category);
      const shuffled = shuffleArray(categoryQuestions);
      allQuestions.push(...shuffled.slice(0, Math.min(questionsPerCategory, shuffled.length)));
    } catch (error) {
      console.warn(`Failed to load questions from ${category}:`, error);
    }
  }
  
  return shuffleArray(allQuestions).slice(0, questionCount);
};

/**
 * Calculate quiz score with bonuses
 */
export const calculateScore = (
  isCorrect: boolean,
  timeLeft: number,
  totalTime: number,
  difficulty: string,
  streak: number = 0
): number => {
  if (!isCorrect) return 0;
  
  const baseScore = 100;
  const timeBonus = Math.max(0, (timeLeft / totalTime) * 50);
  const difficultyMultiplier = difficulty === 'hard' ? 1.5 : 
                               difficulty === 'medium' ? 1.2 : 1;
  const streakBonus = Math.min(streak * 5, 50); // Max 50 bonus points for streak
  
  return Math.round((baseScore + timeBonus + streakBonus) * difficultyMultiplier);
};

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Get performance rating based on accuracy
 */
export const getPerformanceRating = (accuracy: number): {
  rating: string;
  message: string;
  color: string;
  emoji: string;
} => {
  if (accuracy >= 95) {
    return {
      rating: 'Perfect',
      message: 'Outstanding! You\'re a quiz master! 🏆',
      color: '#ffd700',
      emoji: '🏆'
    };
  } else if (accuracy >= 90) {
    return {
      rating: 'Excellent',
      message: 'Excellent work! You\'re doing great! 🌟',
      color: '#10b981',
      emoji: '🌟'
    };
  } else if (accuracy >= 80) {
    return {
      rating: 'Very Good',
      message: 'Very good performance! Keep it up! 👏',
      color: '#3b82f6',
      emoji: '👏'
    };
  } else if (accuracy >= 70) {
    return {
      rating: 'Good',
      message: 'Good job! Room for improvement! 👍',
      color: '#f59e0b',
      emoji: '👍'
    };
  } else if (accuracy >= 60) {
    return {
      rating: 'Fair',
      message: 'Fair attempt! Practice makes perfect! 📚',
      color: '#f97316',
      emoji: '📚'
    };
  } else {
    return {
      rating: 'Needs Improvement',
      message: 'Don\'t give up! Try again to improve! 💪',
      color: '#ef4444',
      emoji: '💪'
    };
  }
};

/**
 * Generate achievement based on performance
 */
export const checkAchievements = (score: number, accuracy: number, streak: number): string[] => {
  const achievements: string[] = [];
  
  if (accuracy === 100) achievements.push('Perfect Score! 🎯');
  if (accuracy >= 95) achievements.push('Almost Perfect! ⭐');
  if (streak >= 10) achievements.push('Hot Streak! 🔥');
  if (streak >= 5) achievements.push('On Fire! 💫');
  if (score >= 2000) achievements.push('High Scorer! 💎');
  if (score >= 1500) achievements.push('Quiz Champion! 🏅');
  
  return achievements;
};

/**
 * Local storage utilities
 */
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Generate random color for categories
 */
export const generateCategoryColor = (category: string): string => {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];
  
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};
