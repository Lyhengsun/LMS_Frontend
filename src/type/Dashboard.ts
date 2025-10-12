import { ContentProgress } from "./Course";

export type StudentSummaryStats = {
  enrolledCourses: number;
  courseProgress: number;
  quizzesTaken: number;
  quizPerformance: number;
};

export type StudentLearningInsight = {
  lessonsThisWeek: number;
  quizImprovement: number;
  streakDays: number;
};

export type ContinueLearning = {
  courseId: number;
  courseName: string;
  categoryName: string;
  progress: number;
  thumbnailUrl: string;
  timeRemainingInMinutes: number;
  nextContent: ContentProgress;
};

export type QuizOverview = {
  quizId: number;
  quizName: string;
  categoryName: string;
  bestScore: number;
  maxScore: number;
  attempts: number;
  maxAttempts: number;
};

// Type definition for what the backend API should return
export type InstructorStatsData = {
  myCourses: number;
  coursesPublished: number;
  coursesDraft: number;
  coursesPending: number;
  quizzesCreated: number;
  quizTotalAttempts: number;
  activeStudentsThisWeek: number;
  quizzesAttemptedToday: number;
};

export type InstructorDashboardCourse = {
  courseId: number;
  courseName: string;
  categoryName: string;
  status: string; // "Published" | "Draft" | "Pending Approval"
  enrollmentCount: number;
  thumbnailUrl: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CourseStatusCounts = {
  published: number;
  draft: number;
  pending: number;
  rejected: number;
};

export type DailyAttempt = {
  date: string;
  count: number;
};

export type QuizDistribution = {
  passed: number;
  failed: number;
};
