import React from "react";
import InstructorCoursePageComponent from "./_components/InstructorCoursePageComponent";
import Course from "@/src/type/Course";

const InstructorCoursePage = () => {
  const course: Course = {
    id: 1,
    title: "React Development Masterclass",
    instructor: "Dr. Sarah Johnson",
    duration: 40,
    level: "Intermediate",
    students: 1250,
    category: "development",
    description: "test",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    lessons: [
      {
        id: 1,
        title: "Introduction to React",
        duration: 40,
        videoUrl:
          "http://localhost:8090/api/v1/files/video/502702aa-757a-428d-b1a7-2597b0f88b47",
        isCompleted: false,
        index: 1,
      },
      {
        id: 2,
        title: "Components and Props",
        duration: 40,
        videoUrl:
          "http://localhost:8090/api/v1/files/video/faef3f63-166a-4d3c-b6fc-2d08d3f0fe19",
        isCompleted: false,
        index: 2,
      },
      {
        id: 3,
        title: "State Management",
        duration: 40,
        videoUrl:
          "http://localhost:8090/api/v1/files/video/b1e9e194-0377-4c42-b5fc-cfe34d03cb18",
        isCompleted: false,
        index: 3,
      },
    ],
  };
  return <InstructorCoursePageComponent />;
};

export default InstructorCoursePage;
