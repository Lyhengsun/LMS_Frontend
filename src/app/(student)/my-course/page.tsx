import React from "react";
import MyCoursePageComponent from "./_components/MyCoursePageComponent";
import Course from "@/src/type/Course";
import { getCourseForStudentService } from "@/src/service/course.service";
import { getCategoryService } from "@/src/service/category.service";

const MyCoursePage = async () => {

  // const res = await getCourseForStudentService();
  // const categoryRes = await getCategoryService();
  return <MyCoursePageComponent />;
};

export default MyCoursePage;
