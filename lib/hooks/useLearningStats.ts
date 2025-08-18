
import { useState, useEffect } from 'react';

interface LearningStats {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  pendingCourses: number;
}

interface ProgressData {
  date: string;
  completed: number;
  inProgress: number;
}

export const useLearningStats = () => {
  const [stats, setStats] = useState<LearningStats>({
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    pendingCourses: 0
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    updateStatsFromCourseProgress();
  }, []);

  // Listen for course progress updates
  useEffect(() => {
    const handleCourseProgress = () => {
      updateStatsFromCourseProgress();
    };

    const handleLessonCompleted = () => {
      updateStatsFromCourseProgress();
    };

    window.addEventListener('storage', handleCourseProgress);
    window.addEventListener('lessonCompleted', handleLessonCompleted as EventListener);
    window.addEventListener('courseCompleted', handleCourseProgress as EventListener);

    return () => {
      window.removeEventListener('storage', handleCourseProgress);
      window.removeEventListener('lessonCompleted', handleLessonCompleted as EventListener);
      window.removeEventListener('courseCompleted', handleCourseProgress as EventListener);
    };
  }, []);

  const updateStatsFromCourseProgress = () => {
    try {
      // Get course progress data
      const courseProgressData = localStorage.getItem('course-progress-storage');
      const studentCoursesData = localStorage.getItem('studentCourses');
      
      let totalCourses = 0;
      let completedCourses = 0;
      let inProgressCourses = 0;
      let pendingCourses = 0;

      if (studentCoursesData) {
        const courses = JSON.parse(studentCoursesData);
        totalCourses = courses.length;
      }

      if (courseProgressData) {
        const progressStore = JSON.parse(courseProgressData);
        const courseProgress = progressStore.state?.courseProgress || {};
        
        Object.values(courseProgress).forEach((progress: any) => {
          if (progress.isCompleted) {
            completedCourses++;
          } else if (progress.hasStarted) {
            inProgressCourses++;
          } else {
            pendingCourses++;
          }
        });

        // Count courses that haven't been started yet
        pendingCourses = totalCourses - completedCourses - inProgressCourses;
        if (pendingCourses < 0) pendingCourses = 0;
      } else {
        // If no progress data exists, all courses are pending
        pendingCourses = totalCourses;
      }

      setStats({
        totalCourses,
        completedCourses,
        inProgressCourses,
        pendingCourses
      });
    } catch (error) {
      console.error('Error parsing course progress:', error);
    }
  };

  const updateCompletedCourses = (courses: any[]) => {
    // This will trigger the effect to recalculate stats
    updateStatsFromCourseProgress();
  };

  const resetStats = () => {
    const defaultStats: LearningStats = {
      totalCourses: 0,
      completedCourses: 0,
      inProgressCourses: 0,
      pendingCourses: 0
    };
    setStats(defaultStats);
  };

  // Calculate completion rate
  const getCompletionRate = () => {
    return stats.totalCourses > 0 ? Math.round((stats.completedCourses / stats.totalCourses) * 100) : 0;
  };

  // Get progress data for chart (last 7 days)
  const getProgressData = (): ProgressData[] => {
    const data: ProgressData[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const completedPercentage = stats.totalCourses > 0 ? Math.round((stats.completedCourses / stats.totalCourses) * 100) : 0;
      const inProgressPercentage = stats.totalCourses > 0 ? Math.round((stats.inProgressCourses / stats.totalCourses) * 100) : 0;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completed: completedPercentage,
        inProgress: inProgressPercentage
      });
    }
    
    return data;
  };

  return {
    stats: {
      ...stats,
      completionRate: getCompletionRate()
    },
    updateCompletedCourses,
    resetStats,
    progressData: getProgressData(),
    updateStatsFromCourseProgress
  };
};
