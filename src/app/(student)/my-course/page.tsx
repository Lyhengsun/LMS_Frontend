import React from "react";
import MyCoursePageComponent from "./_components/MyCoursePageComponent";
import Course from "@/src/type/Course";
import { getCourseService } from "@/src/service/course.service";

const MyCoursePage = async () => {

  const res = await getCourseService();
  return <MyCoursePageComponent courses={res?.items!} />;
};

export default MyCoursePage;
