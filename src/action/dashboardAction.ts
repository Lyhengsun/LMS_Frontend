"use server";

import {
  getContinueLearningForStudentService,
  getInstructorCoursesService,
  getQuizOverviewForStudentService,
  getStudentCourseProgressForInstructorDashboardByCourseIdService,
} from "../service/dashboard.service";

export const getContinueLearningForStudentAction = async (
  page: number,
  size: number
) => {
  try {
    const ContinueLearningResponse = await getContinueLearningForStudentService(
      page,
      size
    );
    if (ContinueLearningResponse?.success) {
      return { success: true, data: ContinueLearningResponse.payload };
    }
    return { success: false, message: ContinueLearningResponse?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const getQuizOverviewForStudentAction = async (
  page: number,
  size: number
) => {
  try {
    const QuizOverviewResponse = await getQuizOverviewForStudentService(
      page,
      size
    );
    if (QuizOverviewResponse?.success) {
      return { success: true, data: QuizOverviewResponse.payload };
    }
    return { success: false, message: QuizOverviewResponse?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const getInstructorCoursesAction = async (
  page: number,
  size: number
) => {
  try {
    const coursesResponse = await getInstructorCoursesService(page, size);
    if (coursesResponse?.success) {
      return { success: true, data: coursesResponse.payload };
    }
    return { success: false, message: coursesResponse?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const getStudentCourseProgressForInstructorDashboardByCourseIdAction =
  async (
    courseId: number,
    page: number = 1,
    size: number = 10,
    name: string | undefined = undefined
  ) => {
    try {
      const data =
        await getStudentCourseProgressForInstructorDashboardByCourseIdService(
          courseId,
          page,
          size,
          name
        );
      return { success: true, data };
    } catch (error) {
      return { success: false, error };
    }
  };
