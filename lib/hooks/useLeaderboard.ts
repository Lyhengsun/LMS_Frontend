"use client"
import { useState, useEffect } from 'react';
import { useAssignmentStore } from './useAssignmentStore';
import { useLearningStats } from './useLearningStats';

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  coursesCompleted: number;
  averageScore: number;
  badges: string[];
  assignmentPoints?: number;
  isCurrentUser?: boolean;
}

export const useLeaderboard = () => {
  const { getStudentGrades } = useAssignmentStore();
  const { stats } = useLearningStats();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      name: 'Sarah Chen',
      avatar: 'SC',
      points: 8,
      coursesCompleted: 8,
      averageScore: 96,
      badges: ['Top Performer', 'Course Master', 'Quiz Champion'],
      assignmentPoints: 450
    },
    {
      rank: 2,
      name: 'Alex Rivera',
      avatar: 'AR',
      points: 7,
      coursesCompleted: 7,
      averageScore: 94,
      badges: ['Consistent Learner', 'Discussion Leader'],
      assignmentPoints: 380
    },
    {
      rank: 3,
      name: 'Emily Wang',
      avatar: 'EW',
      points: 6,
      coursesCompleted: 6,
      averageScore: 92,
      badges: ['Fast Learner', 'Assignment Ace'],
      assignmentPoints: 320
    },
    {
      rank: 4,
      name: 'Kong KEAT',
      avatar: 'KK',
      points: 0,
      coursesCompleted: 0,
      averageScore: 88,
      badges: ['Rising Star'],
      assignmentPoints: 0,
      isCurrentUser: true
    },
    {
      rank: 5,
      name: 'Mike Johnson',
      avatar: 'MJ',
      points: 4,
      coursesCompleted: 4,
      averageScore: 85,
      badges: ['Steady Progress'],
      assignmentPoints: 200
    }
  ]);

  // Auto-update leaderboard when assignment grades or course completion changes
  useEffect(() => {
    updateLeaderboard();
  }, [stats.completedCourses]);

  // Update leaderboard with real data
  const updateLeaderboard = () => {
    setLeaderboardData(prevData => {
      const updatedData = prevData.map(entry => {
        if (entry.isCurrentUser) {
          const grades = getStudentGrades('Kong KEAT');
          
          return {
            ...entry,
            points: stats.completedCourses, // 1 point per completed course
            coursesCompleted: stats.completedCourses,
            assignmentPoints: grades.totalPoints || 0,
            averageScore: grades.averageGrade || 88
          };
        }
        return entry;
      });

      return sortAndRankLeaderboard(updatedData);
    });
  };

  // Update assignment points and re-rank leaderboard
  const updateAssignmentPoints = () => {
    setLeaderboardData(prevData => {
      const updatedData = prevData.map(entry => {
        if (entry.isCurrentUser) {
          const grades = getStudentGrades('Kong KEAT');
          return {
            ...entry,
            assignmentPoints: grades.totalPoints || 0,
            averageScore: grades.averageGrade || entry.averageScore
          };
        }
        return entry;
      });

      return sortAndRankLeaderboard(updatedData);
    });
  };

  // Helper function to sort and rank leaderboard
  const sortAndRankLeaderboard = (data: LeaderboardEntry[]) => {
    const sortedData = data.sort((a, b) => {
      const totalA = a.points + (a.assignmentPoints || 0);
      const totalB = b.points + (b.assignmentPoints || 0);
      
      // If total points are equal, sort by average score
      if (totalA === totalB) {
        return b.averageScore - a.averageScore;
      }
      
      return totalB - totalA;
    });
    
    return sortedData.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  };

  // Get current user's stats
  const getCurrentUserStats = () => {
    const currentUser = leaderboardData.find(entry => entry.isCurrentUser);
    return {
      rank: currentUser?.rank || 1,
      points: currentUser?.points || 0,
      coursesCompleted: currentUser?.coursesCompleted || 0,
      assignmentPoints: currentUser?.assignmentPoints || 0,
      totalPoints: (currentUser?.points || 0) + (currentUser?.assignmentPoints || 0)
    };
  };

  return {
    leaderboardData,
    updateAssignmentPoints,
    getCurrentUserStats,
    updateLeaderboard
  };
};
