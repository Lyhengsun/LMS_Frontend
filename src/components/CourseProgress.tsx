
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CourseProgressState {
  courseProgress: Record<number, {
    hasStarted: boolean;
    completedLessons: number[];
    totalLessons: number;
    isCompleted: boolean;
  }>;
  startCourse: (courseId: number, totalLessons: number) => void;
  completeLesson: (courseId: number, lessonId: number) => void;
  unCompleteLesson: (courseId: number, lessonId: number) => void;
  completeCourse: (courseId: number) => void;
  getCourseProgress: (courseId: number) => {
    hasStarted: boolean;
    completedLessons: number[];
    totalLessons: number;
    isCompleted: boolean;
    progressPercentage: number;
  };
}

export const useCourseProgressStore = create<CourseProgressState>()(
  persist(
    (set, get) => ({
      courseProgress: {},
      
      startCourse: (courseId: number, totalLessons: number) => {
        set((state) => ({
          courseProgress: {
            ...state.courseProgress,
            [courseId]: {
              hasStarted: true,
              completedLessons: state.courseProgress[courseId]?.completedLessons || [],
              totalLessons,
              isCompleted: false,
            },
          },
        }));
      },
      
      completeLesson: (courseId: number, lessonId: number) => {
        set((state) => {
          const current = state.courseProgress[courseId] || {
            hasStarted: true,
            completedLessons: [],
            totalLessons: 5,
            isCompleted: false,
          };
          
          const updatedCompletedLessons = current.completedLessons.includes(lessonId)
            ? current.completedLessons
            : [...current.completedLessons, lessonId];
          
          const isCompleted = updatedCompletedLessons.length >= current.totalLessons;
          
          return {
            courseProgress: {
              ...state.courseProgress,
              [courseId]: {
                ...current,
                completedLessons: updatedCompletedLessons,
                isCompleted,
              },
            },
          };
        });
      },

      unCompleteLesson: (courseId: number, lessonId: number) => {
        set((state) => {
          const current = state.courseProgress[courseId];
          if (!current) return state;
          
          const updatedCompletedLessons = current.completedLessons.filter(id => id !== lessonId);
          
          return {
            courseProgress: {
              ...state.courseProgress,
              [courseId]: {
                ...current,
                completedLessons: updatedCompletedLessons,
                isCompleted: false, // Reset completion status when uncompleting a lesson
              },
            },
          };
        });
      },
      
      completeCourse: (courseId: number) => {
        set((state) => ({
          courseProgress: {
            ...state.courseProgress,
            [courseId]: {
              ...state.courseProgress[courseId],
              isCompleted: true,
            },
          },
        }));
      },
      
      getCourseProgress: (courseId: number) => {
        const progress = get().courseProgress[courseId] || {
          hasStarted: false,
          completedLessons: [],
          totalLessons: 5,
          isCompleted: false,
        };
        
        const progressPercentage = progress.totalLessons > 0 
          ? Math.round((progress.completedLessons.length / progress.totalLessons) * 100)
          : 0;
        
        return {
          ...progress,
          progressPercentage,
        };
      },
    }),
    {
      name: 'course-progress-storage',
    }
  )
);
