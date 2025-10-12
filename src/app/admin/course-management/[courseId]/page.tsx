import { getCourseForAdminByIdService } from "@/src/service/course.service";
import { redirect } from "next/navigation";
import React from "react";
import AdminViewCoursePageComponent from "../_components/AdminViewCoursePageComponent";

const AdminViewCoursePage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const selectedCourse = await getCourseForAdminByIdService(parseInt(courseId));
  if (selectedCourse == undefined) {
    redirect("/admin/course-management");
  }

  return <AdminViewCoursePageComponent selectedCourse={selectedCourse} />;
};

export default AdminViewCoursePage;
