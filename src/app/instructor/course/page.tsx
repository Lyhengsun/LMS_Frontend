import React from "react";
import InstructorCoursePageComponent from "./_components/InstructorCoursePageComponent";
import Course from "@/src/type/Course";
import { getCategoryService } from "@/src/service/category.service";

const InstructorCoursePage = async () => {
  const categoriesData = await getCategoryService();

  return (
    <InstructorCoursePageComponent categories={categoriesData?.payload ?? []} />
  );
};

export default InstructorCoursePage;
