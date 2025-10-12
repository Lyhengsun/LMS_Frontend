import z from "zod";
import headerToken from "../app/api/headerToken";
import Course, {
  DraftCourse,
  CourseDraftResponse,
  CourseProgressResponse,
  CourseResponse,
  Lesson,
} from "../type/Course";
import { Pagination } from "../type/Pagination";
import {
  createCourseContentSchema,
  createCourseSchema,
} from "../lib/zod/courseSchema";
import ApiResponse from "../type/ApiResponse";

export const getCourseForStudentService = async (
  page: number = 1,
  size: number = 10,
  name: string | undefined = undefined,
  categoryId: number | undefined = undefined,
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCE" | undefined = undefined,
  courseProperty: "CREATED_AT" | "COURSE_NAME" = "CREATED_AT",
  direction: "ASC" | "DESC" = "ASC"
) => {
  const url = `${process.env.BASE_API_URL}/courses?page=${page}&size=${size}`;
  let concatenatedUrl = url;

  if (name != undefined && name.trim().length > 0) {
    concatenatedUrl += `&name=${name}`;
  }
  if (categoryId != undefined) {
    concatenatedUrl += `&categoryId=${categoryId}`
  }
  if (level != undefined) {
    concatenatedUrl += `&level=${level}`;
  }
  if (courseProperty != undefined) {
    concatenatedUrl += `&courseProperty=${courseProperty}`;
  }
  if (direction != undefined) {
    concatenatedUrl += `&direction=${direction}`;
  }

  const header = await headerToken();
  try {
    const res = await fetch(concatenatedUrl, {
      headers: header as HeadersInit,
      next: {
        tags: ["courses"],
      },
    });
    const data = await res.json();

    const { items, pagination } = data.payload as {
      items: CourseResponse[];
      pagination: Pagination;
    };

    const mappedData: Course[] = items.map((i) => {
      const data: Course = {
        id: i.id,
        title: i.courseName,
        description: i.courseDescription,
        instructor: i.author.fullName,
        duration: i.duration,
        level: i.level,
        category: i.category.name,
        thumbnail: i.courseImageName,
        students: i.studentEnrolled ?? 0,
        lessons: i.contents.map((i) => {
          const mappedLesson: Lesson = {
            id: i.id,
            title: i.courseContentName,
            duration: i.durationMinutes,
            videoUrl: i.videoFileName,
            isCompleted: false,
            index: i.courseContentIndex,
          };
          return mappedLesson;
        }),
      };
      return data;
    });

    return { items: mappedData, pagination };
  } catch (error) {
    console.log(error);
  }
};

export const getCourseByAuthorService = async (
  page: number = 1,
  size: number = 10,
  name: string | undefined = undefined,
  categoryId: number | undefined = undefined,
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCE" | undefined = undefined,
  courseProperty: "CREATED_AT" | "COURSE_NAME" = "CREATED_AT",
  direction: "ASC" | "DESC" = "ASC"
) => {
  const url = `${process.env.BASE_API_URL}/instructors/courses?page=${page}&size=${size}`;
  let concatenatedUrl = url;

  if (name != undefined && name.trim().length > 0) {
    concatenatedUrl += `&name=${name}`;
  }
  if (categoryId != undefined) {
    concatenatedUrl += `&categoryId=${categoryId}`
  }
  if (level != undefined) {
    concatenatedUrl += `&level=${level}`;
  }
  if (courseProperty != undefined) {
    concatenatedUrl += `&courseProperty=${courseProperty}`;
  }
  if (direction != undefined) {
    concatenatedUrl += `&direction=${direction}`;
  }

  const header = await headerToken();
  try {
    const res = await fetch(concatenatedUrl, {
      headers: header as HeadersInit,
      next: {
        tags: ["authorCourses"],
      },
    });
    const data = await res.json();

    const { items, pagination } = data.payload as {
      items: CourseDraftResponse[];
      pagination: Pagination;
    };

    const mappedData: DraftCourse[] = items.map((i) => {
      const data: DraftCourse = {
        id: i.id,
        title: i.courseName,
        description: i.courseDescription,
        instructor: i.author.fullName,
        duration: i.duration,
        level: i.level,
        category: i.category.name,
        thumbnail: i.courseImageName,
        students: 0,
        isApproved: i.isApproved,
        isRejected: i.isRejected,
        isSubmitted: i.isSubmitted,
        createdAt: i.createdAt,
        lessons: i.contents.map((i) => {
          const mappedLesson: Lesson = {
            id: i.id,
            title: i.courseContentName,
            duration: i.durationMinutes,
            videoUrl: i.videoFileName,
            isCompleted: false,
            index: i.courseContentIndex,
          };
          return mappedLesson;
        }),
      };
      return data;
    });

    return { items: mappedData, pagination };
  } catch (error) {
    console.log(error);
  }
};

export const getCourseByIdService = async (courseId: number) => {
  const url = `${process.env.BASE_API_URL}/courses/${courseId}`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as any,
      next: {
        tags: ["course"],
      },
    });
    const jsonData = await res.json();
    const data: CourseResponse = jsonData.payload;
    const mappedData: Course = {
      id: data.id,
      title: data.courseName,
      description: data.courseDescription,
      instructor: data.author.fullName,
      duration: data.duration,
      level: data.level,
      category: data.category.name,
      thumbnail: data.courseImageName,
      students: data.studentEnrolled ?? 0,
      lessons: data.contents
        .sort((a, b) => b.courseContentIndex - a.courseContentIndex)
        .map((i) => {
          const mappedLesson: Lesson = {
            id: i.id,
            title: i.courseContentName,
            duration: i.durationMinutes,
            videoUrl: i.videoFileName,
            isCompleted: false,
            index: i.courseContentIndex,
          };
          return mappedLesson;
        }),
    };
    return mappedData;
  } catch (error) {
    console.log(error);
  }
};

export const getAuthorCourseByIdService = async (courseId: number) => {
  const url = `${process.env.BASE_API_URL}/instructors/courses/${courseId}`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as any,
      next: {
        tags: ["authorCourse"],
      },
    });
    const jsonData = await res.json();
    const data: CourseResponse = jsonData.payload;
    const mappedData: Course = {
      id: data.id,
      title: data.courseName,
      description: data.courseDescription,
      instructor: data.author.fullName,
      duration: data.duration,
      level: data.level,
      category: data.category.name,
      thumbnail: data.courseImageName,
      students: data.studentEnrolled ?? 0,
      lessons: data.contents
        .sort((a, b) => b.courseContentIndex - a.courseContentIndex)
        .map((i) => {
          const mappedLesson: Lesson = {
            id: i.id,
            title: i.courseContentName,
            duration: i.durationMinutes,
            videoUrl: i.videoFileName,
            isCompleted: false,
            index: i.courseContentIndex,
          };
          return mappedLesson;
        }),
    };
    return mappedData;
  } catch (error) {
    console.log(error);
  }
};

export const createCourseService = async (
  course: z.infer<typeof createCourseSchema>,
  courseImageName: string | null
) => {
  const url = `${process.env.BASE_API_URL}/instructors/courses`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: header as HeadersInit,
      body: JSON.stringify({
        ...course,
        courseImageName,
      }),
    });

    const data: ApiResponse<CourseResponse> = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const createCourseContentService = async (
  courseContent: z.infer<typeof createCourseContentSchema>,
  courseContentIndex: number,
  videoFileName: string,
  courseDraftId: number
) => {
  const url = `${process.env.BASE_API_URL}/instructors/courses/course-contents`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
      method: "POST",
      body: JSON.stringify({
        ...courseContent,
        courseContentIndex,
        videoFileName,
        courseDraftId: courseDraftId,
      }),
    });

    const data: ApiResponse<String> = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteCourseByIdService = async (courseId: number) => {
  const url = `${process.env.BASE_API_URL}/instructors/courses/${courseId}`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
      method: "DELETE",
    });

    const data: ApiResponse<null> = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const joinCourseByCourseIdService = async (courseId: number) => {
  const url = `${process.env.BASE_API_URL}/students/courses/${courseId}/joining`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
      method: "POST",
    });

    const data: ApiResponse<null> = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCourseForAdminService = async (
  page: number = 1,
  size: number = 10,
  name: string | undefined = undefined,
  isApproved: boolean | undefined = undefined,
  isRejected: boolean | undefined = undefined
) => {
  const url = `${process.env.BASE_API_URL}/admins/courses?page=${page}&size=${size}`;
  let concatenatedUrl = url;

  if (name != undefined && name.trim().length > 0) {
    concatenatedUrl += `&name=${name}`;
  }

  if (isApproved != undefined) {
    concatenatedUrl += `&isApproved=${isApproved}`;
  }

  if (isRejected != undefined) {
    concatenatedUrl += `&isRejected=${isRejected}`;
  }

  const header = await headerToken();
  try {
    const res = await fetch(concatenatedUrl, {
      headers: header as HeadersInit,
      next: {
        tags: ["adminCourses"],
      },
    });
    const data = await res.json();

    const { items, pagination } = data.payload as {
      items: CourseDraftResponse[];
      pagination: Pagination;
    };

    const mappedData: DraftCourse[] = items.map((i) => {
      const data: DraftCourse = {
        id: i.id,
        title: i.courseName,
        description: i.courseDescription,
        instructor: i.author.fullName,
        duration: i.duration,
        level: i.level,
        category: i.category.name,
        thumbnail: i.courseImageName,
        students: 0,
        isApproved: i.isApproved,
        isRejected: i.isRejected,
        isSubmitted: i.isSubmitted,
        createdAt: i.createdAt,
        lessons: i.contents.map((i) => {
          const mappedLesson: Lesson = {
            id: i.id,
            title: i.courseContentName,
            duration: i.durationMinutes,
            videoUrl: i.videoFileName,
            isCompleted: false,
            index: i.courseContentIndex,
          };
          return mappedLesson;
        }),
      };
      return data;
    });

    return { items: mappedData, pagination };
  } catch (error) {
    console.log(error);
  }
};

export const getCourseForAdminByIdService = async (courseDraftId: number) => {
  const url = `${process.env.BASE_API_URL}/admins/courses/${courseDraftId}`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as any,
      next: {
        tags: ["course"],
      },
    });
    const jsonData = await res.json();
    const data: CourseDraftResponse = jsonData.payload;

    const mappedData: DraftCourse = {
      id: data.id,
      title: data.courseName,
      description: data.courseDescription,
      instructor: data.author.fullName,
      duration: data.duration,
      level: data.level,
      category: data.category.name,
      thumbnail: data.courseImageName,
      isApproved: data.isApproved,
      isRejected: data.isRejected,
      students: 0,
      createdAt: data.createdAt,
      isSubmitted: data.isSubmitted,
      lessons: data.contents
        .sort((a, b) => b.courseContentIndex - a.courseContentIndex)
        .map((i) => {
          const mappedLesson: Lesson = {
            id: i.id,
            title: i.courseContentName,
            duration: i.durationMinutes,
            videoUrl: i.videoFileName,
            isCompleted: false,
            index: i.courseContentIndex,
          };
          return mappedLesson;
        }),
    };
    return mappedData;
  } catch (error) {
    console.log(error);
  }
};

export const approveCourseForAdminService = async (courseDraftId: number) => {
  const url = `${process.env.BASE_API_URL}/admins/courses/approval/${courseDraftId}`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as any,
      method: "PATCH",
    });
    const jsonData: ApiResponse<CourseResponse> = await res.json();
    const data: CourseResponse = jsonData.payload;
    const mappedData: Course = {
      id: data.id,
      title: data.courseName,
      description: data.courseDescription,
      instructor: data.author.fullName,
      duration: data.duration,
      level: data.level,
      category: data.category.name,
      thumbnail: data.courseImageName,
      students: data.studentEnrolled ?? 0,
      lessons: data.contents
        .sort((a, b) => b.courseContentIndex - a.courseContentIndex)
        .map((i) => {
          const mappedLesson: Lesson = {
            id: i.id,
            title: i.courseContentName,
            duration: i.durationMinutes,
            videoUrl: i.videoFileName,
            isCompleted: false,
            index: i.courseContentIndex,
          };
          return mappedLesson;
        }),
    };

    const mappedResponse: ApiResponse<Course> = {
      ...jsonData,
      payload: mappedData,
    };
    return mappedResponse;
  } catch (error) {
    console.log(error);
  }
};

export const completeCourseContentForStudentService = async (
  courseContentId: number
) => {
  const url = `${process.env.BASE_API_URL}/students/course-contents/${courseContentId}/complete`;

  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
      method: "POST",
    });

    const data: ApiResponse<null> = await res.json();
    console.log("completeCourseContentForStudentService : ", data);

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getCourseProgressByCourseIdForStudentService = async (
  courseId: number
) => {
  const url = `${process.env.BASE_API_URL}/students/courses/${courseId}/progress`;
  const header = await headerToken();

  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
    });
    const data: ApiResponse<CourseProgressResponse> = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const submitDraftCourseForInstructorService = async (
  courseDraftId: number
) => {
  const url = `${process.env.BASE_API_URL}/instructors/courses/${courseDraftId}/submit`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as HeadersInit,
      method: "PATCH",
    });
    const jsonData: ApiResponse<CourseDraftResponse> = await res.json();
    const data: CourseDraftResponse = jsonData.payload;

    const mappedData: DraftCourse = {
      id: data.id,
      title: data.courseName,
      description: data.courseDescription,
      instructor: data.author.fullName,
      duration: data.duration,
      level: data.level,
      category: data.category.name,
      thumbnail: data.courseImageName,
      isApproved: data.isApproved,
      isRejected: data.isRejected,
      isSubmitted: data.isSubmitted,
      students: 0,
      createdAt: data.createdAt,
      lessons: data.contents
        .sort((a, b) => b.courseContentIndex - a.courseContentIndex)
        .map((i) => {
          const mappedLesson: Lesson = {
            id: i.id,
            title: i.courseContentName,
            duration: i.durationMinutes,
            videoUrl: i.videoFileName,
            isCompleted: false,
            index: i.courseContentIndex,
          };
          return mappedLesson;
        }),
    };

    const mappedResponse: ApiResponse<DraftCourse> = {
      ...jsonData,
      payload: mappedData,
    };
    return mappedResponse;
  } catch (error) {
    console.log(error);
  }
};
