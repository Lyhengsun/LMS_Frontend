import { useState, useEffect } from 'react';

interface QuizQuestion {
  id: number;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer: string | number;
  points: number;
}

interface Quiz {
  id: number;
  title: string;
  description: string;
  course: string;
  duration: number; // in minutes
  status: 'active' | 'draft' | 'closed';
  questions: QuizQuestion[];
  totalPoints: number;
  attempts: number;
  dueDate: string;
  createdBy: string;
  createdAt: string;
}

interface QuizAttempt {
  id: number;
  studentId: string;
  studentName: string;
  quizId: number;
  answers: Record<number, string | number>;
  score: number;
  totalPoints: number;
  startedAt: string;
  submittedAt: string;
  timeSpent: number; // in minutes
  status: 'in-progress' | 'completed';
}

export const useQuizStore = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedQuizzes = localStorage.getItem('quizzes');
    const savedAttempts = localStorage.getItem('quizAttempts');
    
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    }
    if (savedAttempts) {
      setAttempts(JSON.parse(savedAttempts));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('quizAttempts', JSON.stringify(attempts));
  }, [attempts]);

  const addQuiz = (quiz: Omit<Quiz, 'id' | 'createdAt' | 'totalPoints'>) => {
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const newQuiz: Quiz = {
      ...quiz,
      id: Date.now(),
      totalPoints,
      createdAt: new Date().toISOString(),
    };
    setQuizzes(prev => [newQuiz, ...prev]);
    return newQuiz;
  };

  const updateQuiz = (id: number, updates: Partial<Quiz>) => {
    setQuizzes(prev => 
      prev.map(quiz => {
        if (quiz.id === id) {
          const updatedQuiz = { ...quiz, ...updates };
          if (updates.questions) {
            updatedQuiz.totalPoints = updates.questions.reduce((sum, q) => sum + q.points, 0);
          }
          return updatedQuiz;
        }
        return quiz;
      })
    );
  };

  const deleteQuiz = (id: number) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
    setAttempts(prev => prev.filter(attempt => attempt.quizId !== id));
  };

  const startQuizAttempt = (studentId: string, studentName: string, quizId: number) => {
    const newAttempt: QuizAttempt = {
      id: Date.now(),
      studentId,
      studentName,
      quizId,
      answers: {},
      score: 0,
      totalPoints: 0,
      startedAt: new Date().toISOString(),
      submittedAt: '',
      timeSpent: 0,
      status: 'in-progress'
    };
    setAttempts(prev => [newAttempt, ...prev]);
    return newAttempt;
  };

  const submitQuizAttempt = (attemptId: number, answers: Record<number, string | number>) => {
    setAttempts(prev =>
      prev.map(attempt => {
        if (attempt.id === attemptId) {
          const quiz = quizzes.find(q => q.id === attempt.quizId);
          if (!quiz) return attempt;

          let score = 0;
          quiz.questions.forEach(question => {
            const userAnswer = answers[question.id];
            if (userAnswer === question.correctAnswer) {
              score += question.points;
            }
          });

          const startTime = new Date(attempt.startedAt);
          const endTime = new Date();
          const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

          return {
            ...attempt,
            answers,
            score,
            totalPoints: quiz.totalPoints,
            submittedAt: new Date().toISOString(),
            timeSpent,
            status: 'completed' as const
          };
        }
        return attempt;
      })
    );
  };

  const getQuizAttempts = (quizId: number) => {
    return attempts.filter(attempt => attempt.quizId === quizId);
  };

  const getQuizResults = (quizId: number) => {
    return attempts.filter(attempt => attempt.quizId === quizId && attempt.status === 'completed');
  };

  const getStudentAttempts = (studentId: string) => {
    return attempts.filter(attempt => attempt.studentId === studentId);
  };

  const getStudentQuizAttempt = (studentId: string, quizId: number) => {
    return attempts.find(attempt => attempt.studentId === studentId && attempt.quizId === quizId);
  };

  return {
    quizzes,
    attempts,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    startQuizAttempt,
    submitQuizAttempt,
    getQuizAttempts,
    getQuizResults,
    getStudentAttempts,
    getStudentQuizAttempt,
  };
};
