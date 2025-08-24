
import { useState, useEffect } from 'react';
import { useCourseProgressStore } from '@/src/components/CourseProgress';

interface VideoProgressData {
  courseId: number;
  lessonId: number;
  watchTime: number;
  totalDuration: number;
  isCompleted: boolean;
  lastWatchPosition: number;
}

export const useVideoProgress = (courseId: number, lessonId: number) => {
  const [watchTime, setWatchTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { completeLesson, getCourseProgress } = useCourseProgressStore();

  const progressKey = `video_progress_${courseId}_${lessonId}`;

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(progressKey);
    if (savedProgress) {
      const progress: VideoProgressData = JSON.parse(savedProgress);
      setWatchTime(progress.watchTime);
      setLastPosition(progress.lastWatchPosition);
      setIsCompleted(progress.isCompleted);
    }
  }, [progressKey]);

  // Save progress when values change
  useEffect(() => {
    if (totalDuration > 0) {
      const progressData: VideoProgressData = {
        courseId,
        lessonId,
        watchTime,
        totalDuration,
        isCompleted,
        lastWatchPosition: lastPosition
      };
      localStorage.setItem(progressKey, JSON.stringify(progressData));
    }
  }, [progressKey, courseId, lessonId, watchTime, totalDuration, isCompleted, lastPosition]);

  const updateProgress = (currentTime: number, duration: number) => {
    setWatchTime(currentTime);
    setTotalDuration(duration);
    setLastPosition(currentTime);

    // Mark as completed if watched 90% or more
    const completionThreshold = 0.9;
    const watchedPercentage = currentTime / duration;
    
    if (watchedPercentage >= completionThreshold && !isCompleted) {
      setIsCompleted(true);
      completeLesson(courseId, lessonId);
      
      // Trigger completion celebration
      window.dispatchEvent(new CustomEvent('lessonCompleted', {
        detail: { courseId, lessonId }
      }));
    }
  };

  const resetProgress = () => {
    setWatchTime(0);
    setLastPosition(0);
    setIsCompleted(false);
    localStorage.removeItem(progressKey);
  };

  const getProgressPercentage = () => {
    return totalDuration > 0 ? Math.round((watchTime / totalDuration) * 100) : 0;
  };

  return {
    watchTime,
    totalDuration,
    lastPosition,
    isCompleted,
    progressPercentage: getProgressPercentage(),
    updateProgress,
    resetProgress
  };
};
