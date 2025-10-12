import { number } from "zod";
import headerToken from "../app/api/headerToken";
import ApiResponse from "../type/ApiResponse";
import {
  ContinueLearning,
  CourseStatusCounts,
  DailyAttempt,
  InstructorDashboardCourse,
  InstructorStatsData,
  QuizDistribution,
  QuizOverview,
  StudentLearningInsight,
  StudentSummaryStats,
} from "../type/Dashboard";
import { Pagination } from "../type/Pagination";

export const getSummaryStatsForStudentService = async () => {
  const url = `${process.env.BASE_API_URL}/students/dashboard/summary-stat`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
    });
    const data: ApiResponse<StudentSummaryStats> = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getLearningInsightForStudentService = async () => {
  const url = `${process.env.BASE_API_URL}/students/dashboard/learning-insights`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
    });
    const data: ApiResponse<StudentLearningInsight> = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getContinueLearningForStudentService = async (
  page: number,
  size: number
) => {
  const url = `${process.env.BASE_API_URL}/students/dashboard/continue-learnings?page=${page}&size=${size}`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
    });
    const data: ApiResponse<{
      items: ContinueLearning[];
      pagination: Pagination;
    }> = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getQuizOverviewForStudentService = async (
  page: number,
  size: number
) => {
  const url = `${process.env.BASE_API_URL}/students/dashboard/quiz-overview?page=${page}&size=${size}`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
    });
    const data: ApiResponse<{
      items: QuizOverview[];
      pagination: Pagination;
    }> = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getSummaryStatsForInstructorService = async () => {
  const url = `${process.env.BASE_API_URL}/instructors/dashboard/summary-stat`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
    });
    const data: ApiResponse<InstructorStatsData> = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getInstructorCoursesService = async (
  page: number,
  size: number
) => {
  const url = `${process.env.BASE_API_URL}/instructors/dashboard/courses?page=${page}&size=${size}`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
    });
    const data: ApiResponse<{
      items: InstructorDashboardCourse[];
      pagination: Pagination;
    }> = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCourseStatusForInstructorDashboardService = async () => {
  const url = `${process.env.BASE_API_URL}/instructors/dashboard/course-status-distribution`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
    });

    const data: ApiResponse<CourseStatusCounts> = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getQuizPerformanceForInstructorDashboardService = async () => {
  const url = `${process.env.BASE_API_URL}/instructors/dashboard/quiz-performance-distribution`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
    });
    const data: ApiResponse<QuizDistribution> = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getQuizAttemptsOverTimeForInstructorDashboardService = async (days : number) => {
  const url = `${process.env.BASE_API_URL}/instructors/dashboard/quiz-attempts-over-time?days=${days}`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      headers: header as HeadersInit
    })
    const data : ApiResponse<{
      dailyAttempts: DailyAttempt[]
    }> = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}
