import React from "react";
import EditCourseDetailPageComponent from "./_components/EditCourseDetailPageComponent";
import Course from "@/src/type/Course";
import { getAuthorCourseByIdService } from "@/src/service/course.service";
import { redirect } from "next/navigation";
import CourseDetailPageComponent from "@/src/app/(student)/my-course/[courseId]/_component/CourseDetailPageComponent";

const EditCourseDetailPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const {courseId } = await params;
  const course = await getAuthorCourseByIdService(parseInt(courseId));
  if (course == undefined) {
    redirect("/instructor/course");
  }
  return <EditCourseDetailPageComponent selectedCourse={course} />;
};

export default EditCourseDetailPage;
