import React from "react";
import InstructorCourseDetailPageComponent from "../../_components/InstructorCourseDetailPageComponent";
import { getAuthorCourseByIdService } from "@/src/service/course.service";
import { redirect } from "next/navigation";

const ViewCourseDetailPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const course = await getAuthorCourseByIdService(parseInt(courseId));
  if (course == undefined) {
    redirect("/instructor/course");
  }
  return (
    <InstructorCourseDetailPageComponent selectedCourse={course} mode="view" />
  );
};

export default ViewCourseDetailPage;
