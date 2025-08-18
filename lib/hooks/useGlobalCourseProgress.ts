
import { useState, useEffect } from 'react';
import { useCourseProgressStore } from '@/components/CourseProgress';

interface CompletedLesson {
  id: number;
  courseId: number;
  lessonTitle: string;
  completedAt: string;
}

interface WatchedVideo {
  id: number;
  courseId: number;
  videoTitle: string;
  watchedAt: string;
  watchTime: number;
  totalDuration: number;
}

export const useGlobalCourseProgress = () => {
  const { courseProgress } = useCourseProgressStore();
  const [completedLessons, setCompletedLessons] = useState<CompletedLesson[]>([]);
  const [watchedVideos, setWatchedVideos] = useState<WatchedVideo[]>([]);

  // Generate completed lessons from course progress store
  useEffect(() => {
    const lessons: CompletedLesson[] = [];
    
    Object.entries(courseProgress).forEach(([courseId, progress]) => {
      progress.completedLessons.forEach(lessonId => {
        lessons.push({
          id: lessonId,
          courseId: parseInt(courseId),
          lessonTitle: `Lesson ${lessonId}`,
          completedAt: new Date().toISOString()
        });
      });
    });

    setCompletedLessons(lessons);
  }, [courseProgress]);

  // Generate watched videos (for now, use completed lessons as watched videos)
  useEffect(() => {
    const videos: WatchedVideo[] = completedLessons.map(lesson => ({
      id: lesson.id,
      courseId: lesson.courseId,
      videoTitle: lesson.lessonTitle,
      watchedAt: lesson.completedAt,
      watchTime: 300, // 5 minutes default
      totalDuration: 360 // 6 minutes default
    }));

    setWatchedVideos(videos);
  }, [completedLessons]);

  const getCompletedLessons = () => {
    return completedLessons;
  };

  const getWatchedVideos = () => {
    return watchedVideos;
  };

  return {
    getCompletedLessons,
    getWatchedVideos,
    completedLessons,
    watchedVideos
  };
};
