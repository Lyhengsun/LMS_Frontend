import React from "react";
import CourseDetailPageComponent from "./_component/CourseDetailPageComponent";
import Course from "@/src/type/Course";
import { notFound } from "next/navigation";

const CourseDetailPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const courses: Course[] = [
    {
      id: 1,
      title: "React Development Masterclass",
      instructor: "Dr. Sarah Johnson",
      duration: 40,
      level: "Intermediate",
      students: 1250,
      category: "development",
      description: "loremaoieg ajgaejgeajj aejgajgjga",
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
    },
    {
      id: 2,
      title: "Python for Data Science",
      instructor: "Prof. Michael Chen",
      duration: 40,
      level: "Beginner",
      students: 890,
      category: "data-science",
      description: "loremaoieg ajgaejgeajj aejgajgjga",
      thumbnail:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop",
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
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: "Emma Rodriguez",
      duration: 25,
      level: "Beginner",
      students: 2100,
      category: "design",
      description: "loremaoieg ajgaejgeajj aejgajgjga",
      thumbnail:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop",
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
    },
  ];

  const selectedCourse = courses.find((c) => c.id == parseInt(courseId));
  console.log("selectedCourse : ", selectedCourse);
  console.log("!selectedCourse : ", !selectedCourse);

  if (!selectedCourse) {
    notFound();
  }
  return <CourseDetailPageComponent selectedCourse={selectedCourse!} />;
};

export default CourseDetailPage;
