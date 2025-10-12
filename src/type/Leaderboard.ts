import User from "./User";

export type Leaderboard = {
  quizPoints: number;
  coursePoints: number;
  assignmentPoints: number;
  totalPoints: number;
  student: User;
};
