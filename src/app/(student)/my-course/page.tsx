import React from "react";
import MyCoursePageComponent from "./_components/MyCoursePageComponent";
import Course from "@/src/type/Course";
import { getCourseService } from "@/src/service/course.service";

const MyCoursePage = async () => {
  //  const courses : Course[] = [
  //   {
  //     id: 1,
  //     title: "React Development Masterclass",
  //     instructor: "Dr. Sarah Johnson",
  //     duration: 40,
  //     level: "Intermediate",
  //     students: 1250,
  //     category: "development",
  //     description: "loremaoieg ajgaejgeajj aejgajgjga",
  //     thumbnail:
  //       "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
  //   },
  //   {
  //     id: 2,
  //     title: "Python for Data Science",
  //     instructor: "Prof. Michael Chen",
  //     duration: 40,
  //     level: "Beginner",
  //     students: 890,
  //     category: "data-science",
  //     description: "loremaoieg ajgaejgeajj aejgajgjga",
  //     thumbnail:
  //       "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop",
  //   },
  //   {
  //     id: 3,
  //     title: "UI/UX Design Fundamentals",
  //     instructor: "Emma Rodriguez",
  //     duration: 25,
  //     level: "Beginner",
  //     students: 2100,
  //     category: "design",
  //     description: "loremaoieg ajgaejgeajj aejgajgjga",
  //     thumbnail:
  //       "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop",
  //   },
  // ];

  const res = await getCourseService();
  return <MyCoursePageComponent courses={res?.items ?? []} />;
};

export default MyCoursePage;
