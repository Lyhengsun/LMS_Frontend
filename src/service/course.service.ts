import headerToken from "../app/api/headerToken";
import Course, { Lesson } from "../type/Course";
import { Pagination } from "../type/Pagination";

type CourseResponse = {
  id: number;
  courseName: string;
  courseImageName: string;
  courseDescription: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCE";
  maxPoints: number;
  duration: number;
  isPublic: boolean;
  isDeleted: boolean;
  category: CategoryResponse;
  author: Author;
  contents: Content[];
};

type Content = {
  id: number;
  courseContentName: string;
  courseContentIndex: number;
  videoFileName: string;
  durationMinutes: 3;
};

type Author = {
  id: number;
  fullName: string;
  email: string;
};

type CategoryResponse = {
  id: number;
  name: string;
};

export const getCourseService = async (page: number = 1, size: number = 10) => {
  const url = `${process.env.BASE_API_URL}/course?page=${page}&size=${size}`;
  try {
    const res = await fetch(url);
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
        students: 0,
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
  const url = `${process.env.BASE_API_URL}/course/${courseId}`;
  const header = await headerToken();
  try {
    const res = await fetch(url, {
      headers: header as any,
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
      students: 0,
      lessons: data.contents.sort((a, b) => b.courseContentIndex - a.courseContentIndex).map((i) => {
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
