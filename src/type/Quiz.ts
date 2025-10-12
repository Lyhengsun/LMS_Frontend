import Category from "./Category";
import User from "./User";

export type Quiz = {
  createdAt: string;
  editedAt: string;
  id: number;
  quizName: string;
  quizDescription: string;
  quizInstruction: string;
  level: string;
  durationMinutes: number;
  maxAttempts: number;
  questionCount: number;
  category: Category;
  attemptCount: number;
};

export type Question = {
  createdAt: string;
  editedAt: string;
  id: number;
  content: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  trueFalseAnswer?: boolean;
  score: number;
  answers?: Answer[];
};

export type Answer = {
  createdAt: string;
  editedAt: string;
  id: number;
  content: string;
  isCorrect: boolean;
};

export type QuizDetails = {
  createdAt: string;
  editedAt: string;
  id: number;
  quizName: string;
  quizDescription: string;
  quizInstruction: string;
  level: string;
  durationMinutes: number;
  maxAttempts: number;
  passingScore: number;
  author: User;
  category: Category;
  questions: Question[];
};

export type QuizRequest = {
  quizName: string;
  quizDescription: string;
  quizInstruction: string;
  level: string;
  durationMinutes: number;
  maxAttempts: number;
  categoryId: number;
  questions: QuestionRequest[];
};

export type QuestionRequest = {
  content: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE";
  trueFalseAnswer?: boolean;
  score: number;
  answers?: AnswerRequest[];
};

export type TakeQuiz = {
  id: number;
  user: User;
  quiz: Quiz;
  deadlineTime: string;
  createdAt: string;
  editedAt: string;
};

export type AnswerRequest = {
  content: string;
  isCorrect: boolean;
};

export type QuizResult = {
  takeQuizId: number;
  quizId: number;
  quizName: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  attemptNumber: number;
  completedAt: string;
  timeSpentInMinutes: number;
  correctAnswers: number;
  totalQuestions: number;
};

