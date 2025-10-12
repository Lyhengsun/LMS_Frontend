"use server";

import z, { success } from "zod";
import {
  approveCourseForAdminService,
  completeCourseContentForStudentService,
  createCourseContentService,
  createCourseService,
  deleteCourseByIdService,
  getCourseByAuthorService,
  getCourseForAdminService,
  getCourseForStudentService,
  getCourseProgressByCourseIdForStudentService,
  joinCourseByCourseIdService,
  submitDraftCourseForInstructorService,
} from "../service/course.service";
import {
  createCourseContentSchema,
  createCourseSchema,
} from "../lib/zod/courseSchema";
import { revalidateTag } from "next/cache";

export const getCourseForStudentAction = async (
  page: number = 1,
  size: number = 10,
  name: string | undefined = undefined,
  categoryId: number | undefined = undefined,
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCE" | undefined = undefined,
  courseProperty: "CREATED_AT" | "COURSE_NAME" = "CREATED_AT",
  direction: "ASC" | "DESC" = "ASC"
) => {
  try {
    const data = await getCourseForStudentService(
      page,
      size,
      name,
      categoryId,
      level,
      courseProperty,
      direction
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};


export const getCourseByAuthorAction = async (
  page: number = 1,
  size: number = 10,
  name: string | undefined = undefined,
  categoryId: number | undefined = undefined,
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCE" | undefined = undefined,
  courseProperty: "CREATED_AT" | "COURSE_NAME" = "CREATED_AT",
  direction: "ASC" | "DESC" = "ASC"
) => {
  try {
    const data = await getCourseByAuthorService(
      page,
      size,
      name,
      categoryId,
      level,
      courseProperty,
      direction
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

export const createCourseAction = async (
  course: z.infer<typeof createCourseSchema>,
  courseImageName: string | null
) => {
  try {
    const courseData = await createCourseService(course, courseImageName);
    if (courseData!.success) {
      revalidateTag("authorCourses");
      return { success: true, data: courseData!.payload };
    }
    return { success: false, message: courseData?.message };
  } catch (error) {
    // console.log("createCourseAction error : ", error);
    return { success: false, message: error };
  }
};

export const createCourseContentAction = async (
  courseContent: z.infer<typeof createCourseContentSchema>,
  courseContentIndex: number,
  videoFileName: string,
  courseDraftId: number
) => {
  try {
    const courseContentData = await createCourseContentService(
      courseContent,
      courseContentIndex,
      videoFileName,
      courseDraftId
    );
    if (courseContentData!.success) {
      revalidateTag("authorCourse");
      return { success: true, data: courseContentData!.payload };
    }
    return { success: false, message: courseContentData?.message };
  } catch (error) {
    // console.log("createCourseAction error : ", error);
    return { success: false, message: error };
  }
};

export const deleteCourseByIdAction = async (courseId: number) => {
  try {
    const courseDeletedData = await deleteCourseByIdService(courseId);
    // console.log("courseDeletedData : ", courseDeletedData);
    if (courseDeletedData?.success) {
      revalidateTag("authorCourse");
      return { success: true, message: courseDeletedData.message };
    }
    return { success: false, message: courseDeletedData?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const joinCourseByCourseIdAction = async (courseId: number) => {
  try {
    const joinedCourseData = await joinCourseByCourseIdService(courseId);
    if (joinedCourseData?.success) {
      return { success: true, message: joinedCourseData.message };
    }
    return { success: false, message: joinedCourseData?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const getCourseForAdminAction = async (
  page: number = 1,
  size: number = 10,
  name: string | undefined = undefined,
  isApproved: boolean | undefined = undefined,
  isRejected: boolean | undefined = undefined
) => {
  try {
    const data = await getCourseForAdminService(page, size,name, isApproved, isRejected);
    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
};

export const approveCourseForAdminAction = async (courseDraftId: number) => {
  try {
    const approveCourseData = await approveCourseForAdminService(courseDraftId);
    if (approveCourseData?.success) {
      return { success: true, message: approveCourseData.message };
    }
    return { success: false, message: approveCourseData?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};

export const completeCourseContentForStudentAction = async (courseContentId : number) => {
  try {
    const completeCourseContentData = await completeCourseContentForStudentService(courseContentId);
    if (completeCourseContentData?.success) {
      return { success: true, message: completeCourseContentData.message };
    }
    return { success: false, message: completeCourseContentData?.message };
  } catch (error) {
    return { success: false, message: error };
  }
}

export const getCourseProgressByCourseIdForStudentAction = async (courseId : number) => {
  try {
    const completeCourseContentData = await getCourseProgressByCourseIdForStudentService(courseId);
    if (completeCourseContentData?.success) {
      return { success: true, data: completeCourseContentData.payload};
    }
    return { success: false, message: completeCourseContentData?.message };
  } catch (error) {
    return { success: false, message: error };
  }
}

export const submitDraftCourseForInstructorAction = async (courseDraftId: number) => {
  try {
    const submitCourseData = await submitDraftCourseForInstructorService(courseDraftId);
    if (submitCourseData?.success) {
      revalidateTag("authorCourses");
      return { success: true, message: submitCourseData.message };
    }
    return { success: false, message: submitCourseData?.message };
  } catch (error) {
    return { success: false, message: error };
  }
};
