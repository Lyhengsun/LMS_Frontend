"use server";

import z from "zod";
import {
  createCourseContentService,
  createCourseService,
  getCourseByAuthorService,
} from "../service/course.service";
import {
  createCourseContentSchema,
  createCourseSchema,
} from "../lib/zod/courseSchema";
import { revalidateTag } from "next/cache";

export const getCourseByAuthorAction = async (page: number, size: number) => {
  try {
    const data = await getCourseByAuthorService(page, size);
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
  courseId: number
) => {
  try {
    const courseContentData = await createCourseContentService(
      courseContent,
      courseContentIndex,
      videoFileName,
      courseId
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
