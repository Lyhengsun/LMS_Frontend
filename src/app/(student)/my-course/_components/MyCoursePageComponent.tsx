"use client";
import { CourseCompletionConfetti } from "@/src/components/CourseCompletionConfetti";
import { useCourseProgressStore } from "@/src/components/CourseProgress";
import { EnhancedVideoPlayer } from "@/src/components/EnhancedVideoPlayer";
import { LessonCompletionCelebration } from "@/src/components/LessonCompletionCelebration";
import { LessonResources } from "@/src/components/LessonResources";
import { Sidebar } from "@/src/components/Sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoComments } from "@/src/components/VideoComments";
import { useVideoProgress } from "@/src/lib/hooks/useVideoProgress";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Filter,
  MessageCircle,
  Play,
  PlayCircle,
  Search,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const MyCoursePageComponent = () => {
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

  const courses = [
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
        },
        {
          id: 2,
          title: "Components and Props",
          duration: 40,
          videoUrl:
            "http://localhost:8090/api/v1/files/video/faef3f63-166a-4d3c-b6fc-2d08d3f0fe19",
          isCompleted: false,
        },
        {
          id: 3,
          title: "State Management",
          duration: 40,
          videoUrl:
            "http://localhost:8090/api/v1/files/video/b1e9e194-0377-4c42-b5fc-cfe34d03cb18",
          isCompleted: false,
        },
        {
          id: 4,
          title: "Hooks in Depth",
          duration: 90,
          videoUrl:
            "http://localhost:8090/api/v1/files/video/faef3f63-166a-4d3c-b6fc-2d08d3f0fe19",
          isCompleted: false,
        },
        {
          id: 5,
          title: "Advanced Patterns",
          duration: 40,
          videoUrl:
            "http://localhost:8090/api/v1/files/video/faef3f63-166a-4d3c-b6fc-2d08d3f0fe19",
          isCompleted: false,
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
          title: "Python Basics",
          duration: 35,
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          isCompleted: false,
        },
        {
          id: 2,
          title: "NumPy and Pandas",
          duration: 28,
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          isCompleted: false,
        },
        {
          id: 3,
          title: "Data Visualization",
          duration: 25,
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          isCompleted: false,
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
          title: "Design Principles",
          duration: 18,
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          isCompleted: false,
        },
        {
          id: 2,
          title: "User Research",
          duration: 22,
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          isCompleted: false,
        },
      ],
    },
  ];

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
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-36 object-cover rounded-t-lg"
                  />
                  {courseProgress.progressPercentage > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                      <div className="flex items-center justify-between text-white text-xs mb-1">
                        <span>
                          {courseProgress.progressPercentage}% complete
                        </span>
                        <span>
                          {courseProgress.completedLessons.length}/
                          {course.lessons.length} lessons
                        </span>
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
