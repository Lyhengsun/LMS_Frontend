import React from "react";
import InstructorCourseDetailPageComponent from "../../_components/InstructorCourseDetailPageComponent";
import Course from "@/src/type/Course";
import { getAuthorCourseByIdService } from "@/src/service/course.service";
import { redirect } from "next/navigation";

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
  return <InstructorCourseDetailPageComponent selectedCourse={course} mode="edit"/>;
};

export default EditCourseDetailPage;
