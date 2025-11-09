type Course = {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: string;
  category: string;
  thumbnail: string;
  students: number;
  price: number;
  courseAvailability: CourseAvailability;
  isAccessible: boolean;
  lessons: Lesson[];
};

export type DraftCourse = Course & {
  isApproved: boolean,
  isRejected: boolean,
  isSubmitted: boolean,
  createdAt: string
}

export type Lesson = {
  id: number;
  title: string;
  duration: number;
  videoUrl: string;
  isCompleted: boolean;
  index: number;
  points: number;
  requirePayment: boolean;
};

export type CourseDraftResponse = {
  id: number;
  courseName: string;
  courseImageName: string;
  courseDescription: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCE";
  maxPoints: number;
  duration: number;
  isApproved: boolean;
  isRejected: boolean;
  isSubmitted: boolean;
  category: CategoryResponse;
  author: Author;
  price: number;
  courseAvailability: CourseAvailability;
  isAccessible: boolean;
  contents: Content[];
  createdAt: string;
};

export type Content = {
  id: number;
  courseContentName: string;
  courseContentIndex: number;
  videoFileName: string;
  durationMinutes: number;
  points: number;
  requirePayment: boolean;
};

export type Author = {
  id: number;
  fullName: string;
  email: string;
};

export type CategoryResponse = {
  id: number;
  name: string;
};

export type CourseResponse = {
  id: number;
  courseName: string;
  courseImageName: string;
  courseDescription: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCE";
  maxPoints: number;
  duration: number;
  isPublic: boolean;
  isDeleted: boolean;
  studentEnrolled: number | undefined;
  category: CategoryResponse;
  author: Author;
  price: number;
  courseAvailability: CourseAvailability;
  isAccessible: boolean;
  contents: Content[];
};

export type ContentProgress = {
  createdAt: string;
  editedAt: string;
  id: number;
  courseContentName: string;
  courseContentIndex: number;
  videoFileName: string;
  durationMinutes: number;
  points: number;
  completed: boolean;
};

export type CourseProgressResponse = {
  course: CourseResponse;
  maxCourseContentCount: number;
  completedCourseContentCount: number;
  contentProgresses: ContentProgress[];
};

export type CourseAvailability = "FREE" | "PAID" | "PARTIAL";

export default Course;
