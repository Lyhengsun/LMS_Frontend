"use client";
import { useCourseProgressStore } from "@/src/components/CourseProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useVideoProgress } from "@/src/lib/hooks/useVideoProgress";
import {
  BookOpen,
  Clock,
  Filter,
  PlayCircle,
  Search,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Course from "@/src/type/Course";
import CourseCardComponent from "./CourseCardComponent";

const MyCoursePageComponent = ({ courses }: { courses: Course[] }) => {
  //   const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null as any);
  const [selectedVideo, setSelectedVideo] = useState(null as any);
  const router = useRouter();

  const { startCourse, completeLesson, getCourseProgress } =
    useCourseProgressStore();

  // Call useVideoProgress at top level with null safety
  const videoProgress = useVideoProgress(
    selectedCourse?.id || 0,
    selectedVideo?.id || 0
  );

  const handleStartLearning = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      const courseProgress = getCourseProgress(courseId);
      const nextLesson =
        course.lessons.find(
          (lesson) => !courseProgress.completedLessons.includes(lesson.id)
        ) || course.lessons[0];

      setSelectedCourse(course);
      setSelectedVideo(nextLesson);
      startCourse(courseId, course.lessons.length);
      router.push(`/my-course/${courseId}`);
    }
  };

  const categories = [
    "all",
    "development",
    "data-science",
    "design",
    "marketing",
  ];

  // const handleStartLearning = (courseId: number) => {
  //   const course = courses.find((c) => c.id === courseId);
  //   if (course) {
  //     const courseProgress = getCourseProgress(courseId);
  //     const nextLesson =
  //       course.lessons.find(
  //         (lesson) => !courseProgress.completedLessons.includes(lesson.id)
  //       ) || course.lessons[0];

  //     setSelectedCourse(course);
  //     setSelectedVideo(nextLesson);
  //     startCourse(courseId, course.lessons.length);
  //     router.push(`/my-course/${courseId}`);
  //   }
  // };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      (course.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (course.instructor?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );
    const matchesCategory =
      filterCategory === "all" || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === "all"
                    ? "All Categories"
                    : category
                        .replace("-", " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Cards - Udemy Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCourses.map((course) => {
            return (
              <CourseCardComponent
                key={course.id}
                course={course}
                handleStartLearning={handleStartLearning}
              />
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursePageComponent;
