import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Quiz, Score, Category, LeaderboardEntry, QuizSettings, QuizResult, Lifelines } from '../types';
import { loadQuestionsByCategory, shuffleArray } from '../utils/quizUtils';
import toast from 'react-hot-toast';

interface QuizStore {
  // State
  currentUser: User | null;
  currentQuiz: Quiz | null;
  quizHistory: Score[];
  categories: Category[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  
  // User Actions
  setUser: (user: User | null) => void;
  login: (username: string, email: string) => void;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
  
  // Quiz Actions
  startQuiz: (settings: QuizSettings) => Promise<void>;
  updateQuiz: (quiz: Partial<Quiz>) => void;
  submitAnswer: (answer: string, timeSpent: number) => boolean;
  useLifeline: (lifeline: keyof Lifelines) => boolean;
  nextQuestion: () => void;
  finishQuiz: () => QuizResult;
  abandonQuiz: () => void;
  
  // Data Actions
  saveScore: (score: Score) => void;
  loadCategories: () => void;
  loadLeaderboard: () => void;
  
  // Utility Actions
  setLoading: (loading: boolean) => void;
}

const defaultCategories: Category[] = [
  {
    id: 'sports',
    name: 'sports',
    displayName: 'Sports Arena',
    description: 'Test your knowledge of sports, athletes, and competitions',
    icon: '⚽',
    color: '#10b981',
    questionCount: 200,
    difficulty: ['easy', 'medium', 'hard']
  },
  {
    id: 'science',
    name: 'science',
    displayName: 'Science Lab',
    description: 'Explore the wonders of physics, chemistry, and biology',
    icon: '🧪',
    color: '#3b82f6',
    questionCount: 200,
    difficulty: ['easy', 'medium', 'hard']
  },
  {
    id: 'technology',
    name: 'technology',
    displayName: 'Tech Innovation',
    description: 'Dive into the latest in technology and computing',
    icon: '💻',
    color: '#8b5cf6',
    questionCount: 200,
    difficulty: ['easy', 'medium', 'hard']
  },
  {
    id: 'history',
    name: 'history',
    displayName: 'Time Machine',
    description: 'Journey through historical events and civilizations',
    icon: '🏛️',
    color: '#f59e0b',
    questionCount: 200,
    difficulty: ['easy', 'medium', 'hard']
  },
  {
    id: 'literature',
    name: 'literature',
    displayName: 'Book Club',
    description: 'Explore the world of books, authors, and poetry',
    icon: '📚',
    color: '#ef4444',
    questionCount: 200,
    difficulty: ['easy', 'medium', 'hard']
  },
  {
    id: 'world',
    name: 'world',
    displayName: 'World Explorer',
    description: 'Discover countries, cultures, and geography',
    icon: '🌍',
    color: '#06b6d4',
    questionCount: 200,
    difficulty: ['easy', 'medium', 'hard']
  },
  {
    id: 'entertainment',
    name: 'entertainment',
    displayName: 'Show Time',
    description: 'Movies, music, celebrities, and pop culture',
    icon: '🎬',
    color: '#ec4899',
    questionCount: 200,
    difficulty: ['easy', 'medium', 'hard']
  },
  {
    id: 'mathematics',
    name: 'mathematics',
    displayName: 'Math Masters',
    description: 'Numbers, equations, and mathematical concepts',
    icon: '🔢',
    color: '#84cc16',
    questionCount: 200,
    difficulty: ['easy', 'medium', 'hard']
  },
  {
    id: 'general',
    name: 'general_knowledge',
    displayName: 'Brain Boost',
    description: 'General knowledge across various topics',
    icon: '🧠',
    color: '#f97316',
    questionCount: 200,
    difficulty: ['easy', 'medium', 'hard']
  },
  {
    id: 'political',
    name: 'political',
    displayName: 'Political Arena',
    description: 'Politics, government, and current affairs',
    icon: '🏛️',
    color: '#6366f1',
    questionCount: 200,
    difficulty: ['easy', 'medium', 'hard']
  }
];

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      // Initial State
      currentUser: null,
      currentQuiz: null,
      quizHistory: [],
      categories: defaultCategories,
      leaderboard: [],
      isLoading: false,

      // User Actions
      setUser: (user) => set({ currentUser: user }),

      login: (username, email) => {
        const user: User = {
          id: Date.now().toString(),
          username,
          email,
          joinDate: new Date().toISOString(),
          scores: [],
          preferences: {
            theme: 'dark',
            soundEnabled: true,
            animationsEnabled: true,
            defaultQuestionCount: 20,
            defaultDifficulty: 'medium'
          },
          achievements: [],
          totalQuizzes: 0,
          bestStreak: 0
        };
        
        set({ currentUser: user });
        toast.success(`Welcome to QuizHub, ${username}! 🎉`);
      },

      logout: () => {
        set({ currentUser: null, currentQuiz: null });
        toast.success('Logged out successfully! 👋');
      },

      updateUserPreferences: (preferences) => {
        const { currentUser } = get();
        if (currentUser) {
          set({
            currentUser: {
              ...currentUser,
              preferences: { ...currentUser.preferences, ...preferences }
            }
          });
        }
      },

      // Quiz Actions
      startQuiz: async (settings) => {
        set({ isLoading: true });
        
        try {
          const questions = await loadQuestionsByCategory(settings.category);
          
          if (questions.length === 0) {
            toast.error('No questions available for this category!');
            return;
          }

          const shuffledQuestions = settings.shuffleQuestions 
            ? shuffleArray(questions) 
            : questions;
          
          const selectedQuestions = shuffledQuestions
            .slice(0, settings.questionCount)
            .map(q => ({
              ...q,
              id: Math.random().toString(36).substr(2, 9),
              options: settings.shuffleOptions ? shuffleArray(q.options) : q.options
            }));

          const quiz: Quiz = {
            id: Date.now().toString(),
            category: settings.category,
            questions: selectedQuestions,
            settings,
            startTime: new Date().toISOString(),
            currentQuestionIndex: 0,
            score: 0,
            timeLeft: settings.timeLimit,
            lifelines: {
              fiftyFifty: true,
              skipQuestion: true,
              doubleChance: true,
              extraTime: true,
              hint: true
            },
            usedDoubleChance: false
          };

          set({ currentQuiz: quiz });
          toast.success(`Quiz started! ${selectedQuestions.length} questions ready 🚀`);
        } catch (error) {
          toast.error('Failed to start quiz. Please try again.');
          console.error('Quiz start error:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuiz: (quizUpdate) => {
        const { currentQuiz } = get();
        if (currentQuiz) {
          set({ currentQuiz: { ...currentQuiz, ...quizUpdate } });
        }
      },

      submitAnswer: (answer, timeSpent) => {
        const { currentQuiz } = get();
        if (!currentQuiz) return false;

        const question = currentQuiz.questions[currentQuiz.currentQuestionIndex];
        const isCorrect = answer === question.answer;
        
        if (isCorrect) {
          const baseScore = 100;
          const timeBonus = Math.max(0, ((currentQuiz.timeLeft / currentQuiz.settings.timeLimit) * 50));
          const difficultyMultiplier = question.difficulty === 'hard' ? 1.5 : 
                                       question.difficulty === 'medium' ? 1.2 : 1;
          
          const points = Math.round((baseScore + timeBonus) * difficultyMultiplier);
          
          set({
            currentQuiz: {
              ...currentQuiz,
              score: currentQuiz.score + points
            }
          });
          
          toast.success(`Correct! +${points} points 🎉`);
        } else if (currentQuiz.usedDoubleChance) {
          set({
            currentQuiz: {
              ...currentQuiz,
              usedDoubleChance: false
            }
          });
          toast.error('Incorrect! Second chance used 💔');
        } else {
          toast.error(`Incorrect! The answer was: ${question.answer} ❌`);
        }

        return isCorrect;
      },

      useLifeline: (lifeline) => {
        const { currentQuiz } = get();
        if (!currentQuiz || !currentQuiz.lifelines[lifeline]) return false;

        const updatedLifelines = {
          ...currentQuiz.lifelines,
          [lifeline]: false
        };

        set({
          currentQuiz: {
            ...currentQuiz,
            lifelines: updatedLifelines,
            usedDoubleChance: lifeline === 'doubleChance' ? true : currentQuiz.usedDoubleChance
          }
        });

        const messages = {
          fiftyFifty: '50:50 used! Two wrong answers removed 🎯',
          skipQuestion: 'Question skipped! Moving to next ⏭️',
          doubleChance: 'Double chance activated! Second try available 🔄',
          extraTime: 'Extra time granted! +30 seconds ⏰',
          hint: 'Hint revealed! Check the question again 💡'
        };

        toast.success(messages[lifeline]);
        return true;
      },

      nextQuestion: () => {
        const { currentQuiz } = get();
        if (!currentQuiz) return;

        const nextIndex = currentQuiz.currentQuestionIndex + 1;
        
        if (nextIndex >= currentQuiz.questions.length) {
          get().finishQuiz();
        } else {
          set({
            currentQuiz: {
              ...currentQuiz,
              currentQuestionIndex: nextIndex,
              timeLeft: currentQuiz.settings.timeLimit
            }
          });
        }
      },

      finishQuiz: () => {
        const { currentQuiz, currentUser } = get();
        if (!currentQuiz) {
          return {
            quiz: {} as Quiz,
            finalScore: 0,
            accuracy: 0,
            correctAnswers: 0,
            totalQuestions: 0,
            timeTaken: 0,
            rank: 'needs-improvement' as const,
            achievements: []
          };
        }

        const correctAnswers = Math.round(currentQuiz.score / 100);
        const accuracy = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
        const timeTaken = Date.now() - new Date(currentQuiz.startTime).getTime();
        
        const rank = accuracy >= 90 ? 'excellent' :
                     accuracy >= 75 ? 'good' :
                     accuracy >= 60 ? 'average' : 'needs-improvement';

        const score: Score = {
          id: Date.now().toString(),
          userId: currentUser?.id || 'anonymous',
          category: currentQuiz.category,
          score: currentQuiz.score,
          correctAnswers,
          totalQuestions: currentQuiz.questions.length,
          accuracy,
          date: new Date().toISOString(),
          difficulty: currentQuiz.settings.difficulty,
          timeTaken: Math.round(timeTaken / 1000),
          lifelinesUsed: Object.entries(currentQuiz.lifelines)
            .filter(([_, used]) => !used)
            .map(([lifeline]) => lifeline)
        };

        get().saveScore(score);

        const result: QuizResult = {
          quiz: currentQuiz,
          finalScore: currentQuiz.score,
          accuracy,
          correctAnswers,
          totalQuestions: currentQuiz.questions.length,
          timeTaken: Math.round(timeTaken / 1000),
          rank,
          achievements: []
        };

        set({ currentQuiz: null });
        return result;
      },

      abandonQuiz: () => {
        set({ currentQuiz: null });
        toast('Quiz abandoned. Progress not saved.', { icon: '⚠️' });
      },

      // Data Actions
      saveScore: (score) => {
        const { quizHistory, currentUser } = get();
        const updatedHistory = [...quizHistory, score];
        
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            scores: [...currentUser.scores, score],
            totalQuizzes: currentUser.totalQuizzes + 1
          };
          set({ 
            quizHistory: updatedHistory,
            currentUser: updatedUser 
          });
        } else {
          set({ quizHistory: updatedHistory });
        }
      },

      loadCategories: () => {
        // Categories are already loaded with default data
        // In a real app, this would fetch from an API
      },

      loadLeaderboard: () => {
        // Mock leaderboard data
        // In a real app, this would fetch from an API
        const mockLeaderboard: LeaderboardEntry[] = [
          {
            user: {
              id: '1',
              username: 'QuizMaster',
              email: 'master@quiz.com',
              joinDate: '2024-01-01',
              scores: [],
              preferences: {
                theme: 'dark',
                soundEnabled: true,
                animationsEnabled: true,
                defaultQuestionCount: 20,
                defaultDifficulty: 'medium'
              },
              achievements: [],
              totalQuizzes: 150,
              bestStreak: 25
            },
            totalScore: 15000,
            averageAccuracy: 95,
            totalQuizzes: 150,
            bestCategory: 'Science',
            rank: 1
          }
        ];
        
        set({ leaderboard: mockLeaderboard });
      },

      // Utility Actions
      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'quizhub-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        quizHistory: state.quizHistory
      })
    }
  )
);
