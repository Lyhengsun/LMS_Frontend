
import { useState, useEffect } from 'react';

interface LessonProgress {
  id: number;
  completed: boolean;
  watchTime: number;
  totalDuration: number;
}

interface CourseProgress {
  courseId: number;
  lessons: LessonProgress[];
  overallProgress: number;
  isCompleted: boolean;
}

export const useCourseProgress = (courseId: number, totalLessons: number) => {
  const [progress, setProgress] = useState<CourseProgress>({
    courseId,
    lessons: Array.from({ length: totalLessons }, (_, index) => ({
      id: index + 1,
      completed: index < 2, // First 2 lessons completed by default
      watchTime: 0,
      totalDuration: 0
    })),
    overallProgress: Math.round((2 / totalLessons) * 100),
    isCompleted: false
  });

  // Load saved progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`courseProgress_${courseId}`);
    if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      setProgress(parsedProgress);
    }
  }, [courseId]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`courseProgress_${courseId}`, JSON.stringify(progress));
  }, [progress, courseId]);

  const markLessonComplete = (lessonId: number) => {
    setProgress(prev => {
      const updatedLessons = prev.lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      );
      
      const completedCount = updatedLessons.filter(lesson => lesson.completed).length;
      const newOverallProgress = Math.round((completedCount / totalLessons) * 100);
      const isCompleted = completedCount === totalLessons;

      const updatedProgress = {
        ...prev,
        lessons: updatedLessons,
        overallProgress: newOverallProgress,
        isCompleted
      };

      // Trigger course completion event if just completed
      if (isCompleted && !prev.isCompleted) {
        // Dispatch custom event for course completion
        window.dispatchEvent(new CustomEvent('courseCompleted', { 
          detail: { courseId } 
        }));
      }

      return updatedProgress;
    });
  };

  const updateLessonWatchTime = (lessonId: number, watchTime: number, totalDuration: number) => {
    setProgress(prev => ({
      ...prev,
      lessons: prev.lessons.map(lesson =>
        lesson.id === lessonId 
          ? { ...lesson, watchTime, totalDuration }
          : lesson
      )
    }));

    // Mark lesson as complete if watched 90% or more
    if (watchTime / totalDuration >= 0.9) {
      markLessonComplete(lessonId);
    }
  };

  return {
    progress,
    markLessonComplete,
    updateLessonWatchTime
  };
};
