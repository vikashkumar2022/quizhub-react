// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  joinDate: string;
  scores: Score[];
  preferences: UserPreferences;
  achievements: Achievement[];
  totalQuizzes: number;
  bestStreak: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  soundEnabled: boolean;
  animationsEnabled: boolean;
  defaultQuestionCount: number;
  defaultDifficulty: Difficulty;
}

// Quiz Types
export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  difficulty: Difficulty;
  category: string;
  explanation?: string;
  timeLimit?: number;
}

export interface Quiz {
  id: string;
  category: string;
  questions: Question[];
  settings: QuizSettings;
  startTime: string;
  endTime?: string;
  currentQuestionIndex: number;
  score: number;
  timeLeft: number;
  lifelines: Lifelines;
  usedDoubleChance: boolean;
}

export interface QuizSettings {
  category: string;
  questionCount: number;
  difficulty: Difficulty;
  timeLimit: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
}

export interface Lifelines {
  fiftyFifty: boolean;
  skipQuestion: boolean;
  doubleChance: boolean;
  extraTime: boolean;
  hint: boolean;
}

// Score and Results Types
export interface Score {
  id: string;
  userId: string;
  category: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  date: string;
  difficulty: Difficulty;
  timeTaken: number;
  lifelinesUsed: string[];
  rank?: number;
}

export interface QuizResult {
  quiz: Quiz;
  finalScore: number;
  accuracy: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken: number;
  rank: 'excellent' | 'good' | 'average' | 'needs-improvement';
  achievements: Achievement[];
}

// Achievement Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

// Category Types
export interface Category {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  questionCount: number;
  difficulty: Difficulty[];
}

// Leaderboard Types
export interface LeaderboardEntry {
  user: User;
  totalScore: number;
  averageAccuracy: number;
  totalQuizzes: number;
  bestCategory: string;
  rank: number;
}

// Utility Types
export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

export type QuizStatus = 'not-started' | 'in-progress' | 'paused' | 'completed' | 'abandoned';

export type ScreenType = 'home' | 'quiz' | 'results' | 'profile' | 'leaderboard' | 'settings';

// Store Types
export interface QuizStore {
  currentUser: User | null;
  currentQuiz: Quiz | null;
  quizHistory: Score[];
  categories: Category[];
  leaderboard: LeaderboardEntry[];
  
  // Actions
  setUser: (user: User | null) => void;
  startQuiz: (settings: QuizSettings) => void;
  updateQuiz: (quiz: Partial<Quiz>) => void;
  submitAnswer: (answer: string) => void;
  useLifeline: (lifeline: keyof Lifelines) => void;
  finishQuiz: () => QuizResult;
  saveScore: (score: Score) => void;
  loadCategories: () => Promise<void>;
  loadLeaderboard: () => Promise<void>;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface QuestionData {
  questions: Question[];
}

// Animation Types
export interface AnimationVariants {
  hidden: { opacity: number; y?: number; x?: number; scale?: number };
  visible: { opacity: number; y?: number; x?: number; scale?: number };
  exit?: { opacity: number; y?: number; x?: number; scale?: number };
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  borderRadius: number;
  spacing: number;
}

// Event Types
export interface QuizEvent {
  type: 'question-answered' | 'lifeline-used' | 'time-warning' | 'quiz-completed';
  data: any;
  timestamp: string;
}

export interface UserAction {
  type: 'login' | 'logout' | 'quiz-start' | 'quiz-complete' | 'achievement-unlock';
  userId: string;
  data?: any;
  timestamp: string;
}
