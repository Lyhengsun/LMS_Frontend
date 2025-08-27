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

  const categories = [
    "all",
    "development",
    "data-science",
    "design",
    "marketing",
  ];

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
            const courseProgress = getCourseProgress(course.id);
            return (
              <div key={course.id}>
                <div className="relative">
                  <img
                    src={`${process.env.BASE_API_URL}/files/preview-file/${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-36 object-cover rounded-t-lg"
                  />
                  {courseProgress.progressPercentage > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                      <div className="flex items-center justify-between text-white text-xs mb-1">
                        <span>
                          {courseProgress.progressPercentage}% complete
                        </span>
                        <span>{courseProgress.completedLessons.length}/</span>
                      </div>
                      <Progress
                        value={courseProgress.progressPercentage}
                        className="h-1 bg-gray-600"
                      />
                    </div>
                  )}
                </div>
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-shadow rounded-t-none pt-3"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {course.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mb-3 h-10">
                          {course.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{course.students} students</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.lessons.length} lessons</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration} minutes</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleStartLearning(course.id)}
                      className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {courseProgress.progressPercentage > 0
                        ? "Continue"
                        : "Start"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
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
