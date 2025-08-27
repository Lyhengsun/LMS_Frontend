import React from "react";
import CourseDetailPageComponent from "./_component/CourseDetailPageComponent";
import Course from "@/src/type/Course";
import { notFound } from "next/navigation";
import { getCourseByIdService } from "@/src/service/course.service";

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
