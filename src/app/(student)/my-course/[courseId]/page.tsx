import React from "react";
import CourseDetailPageComponent from "./_component/CourseDetailPageComponent";
import { getCourseByIdService, getCourseProgressByCourseIdForStudentService } from "@/src/service/course.service";

const CourseDetailPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;

  const selectedCourse = await getCourseByIdService(parseInt(courseId));
  return <CourseDetailPageComponent selectedCourse={selectedCourse!} />;
};

export default CourseDetailPage;
