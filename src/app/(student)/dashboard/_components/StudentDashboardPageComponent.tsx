"use client";
import { useCourseProgressStore } from "@/src/components/CourseProgress";
import { Sidebar } from "@/src/components/Sidebar";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useLearningStats } from "@/src/lib/hooks/useLearningStats";
import {
  Badge,
  Bell,
  BookOpen,
  Calendar,
  Clock,
  Play,
  Target,
  Trophy,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const StudentDashboardPageComponent = () => {
  const router = useRouter();

  const { stats } = useLearningStats();
  const [continueLearningData, setContinueLearningData] = useState([]);
  const { courseProgress } = useCourseProgressStore();

  const quickStats = [
    {
      title: "Active Courses",
      value: stats.inProgressCourses.toString(),
      icon: BookOpen,
      color: "hsl(var(--student-primary))",
      change: `${stats.totalCourses} total courses`,
    },
    {
      title: "Assignments Due",
      value: "3",
      icon: Target,
      color: "hsl(var(--student-primary))",
      change: "2 due this week",
    },
    {
      title: "Quiz Average",
      value: "87%",
      icon: Trophy,
      color: "hsl(var(--student-primary))",
      change: "+5% improvement",
    },
  ];

  const getContinueLearningItems = () => {
    if (continueLearningData.length === 0) {
      return [
        {
          id: 1,
          title: "React Advanced Concepts",
          course: "Web Development",
          progress: 65,
          nextLesson: "React Hooks Deep Dive",
          timeRemaining: "45 min",
          thumbnail: "/placeholder.svg",
        },
        {
          id: 2,
          title: "JavaScript ES6 Features",
          course: "JavaScript Fundamentals",
          progress: 80,
          nextLesson: "Async/Await Pattern",
          timeRemaining: "30 min",
          thumbnail: "/placeholder.svg",
        },
      ];
    }

    return continueLearningData.map((course: any) => {
      const progress = courseProgress[course.id];
      const progressPercentage = progress
        ? (progress.completedLessons.length / progress.totalLessons) * 100
        : 0;

      return {
        id: course.id,
        title: course.title,
        course: course.category || "General",
        progress: Math.round(progressPercentage),
        nextLesson: `Lesson ${(progress?.completedLessons.length || 0) + 1}`,
        timeRemaining: "30-60 min",
        thumbnail: course.image || "/placeholder.svg",
      };
    });
  };

  const upcomingDeadlines = [
    {
      title: "React Project Submission",
      course: "Web Development",
      dueDate: "Dec 28",
      priority: "high",
      type: "assignment",
    },
    {
      title: "JavaScript Final Quiz",
      course: "JavaScript Fundamentals",
      dueDate: "Dec 30",
      priority: "medium",
      type: "quiz",
    },
    {
      title: "Database Design Paper",
      course: "Database Management",
      dueDate: "Jan 5",
      priority: "low",
      type: "assignment",
    },
  ];

  return (
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Student Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, Alex! Ready to continue your learning journey?
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow bg-white"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {stat.value}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {stat.change}
                        </p>
                      </div>
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: "hsl(var(--student-accent))",
                        }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: stat.color }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Continue Learning */}
            <div className="lg:col-span-2">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play
                      className="w-5 h-5 mr-2"
                      style={{ color: "hsl(var(--student-primary))" }}
                    />
                    Continue Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getContinueLearningItems().map((item, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => router.push("/my-courses")}
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className="w-16 h-16 rounded-lg flex items-center justify-center"
                            style={{
                              backgroundColor: "hsl(var(--student-accent))",
                            }}
                          >
                            <BookOpen
                              className="w-8 h-8"
                              style={{ color: "hsl(var(--student-primary))" }}
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.course}
                            </p>
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {item.timeRemaining}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Target className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">
                                  {item.nextLesson}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-gray-600">
                                {item.progress}%
                              </span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="text-white"
                            style={{
                              backgroundColor: "hsl(var(--student-primary))",
                            }}
                            onClick={() => {
                              if (item.id) {
                                // Navigate to specific course if it has an ID
                                router.push(`/my-courses?courseId=${item.id}`);
                                // Or using URLSearchParams for more complex state:
                                const params = new URLSearchParams({
                                  courseId: item.id.toString(),
                                  title: item.title,
                                  progress: item.progress.toString(),
                                });
                                router.push(`/my-courses?${params.toString()}`);
                              } else {
                                // Navigate to My Courses page
                                router.push("/my-courses");
                              }
                            }}
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Content */}
            <div className="space-y-6">
              {/* Upcoming Deadlines */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar
                      className="w-5 h-5 mr-2"
                      style={{ color: "hsl(var(--student-primary))" }}
                    />
                    Upcoming Deadlines
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 text-sm">
                              {deadline.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {deadline.course}
                            </p>
                          </div>
                          <Badge
                            className={`text-xs ${
                              deadline.priority === "high"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : deadline.priority === "medium"
                                ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                : "bg-green-50 text-green-700 border-green-200"
                            }`}
                          >
                            {deadline.dueDate}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            {deadline.type}
                          </Badge>
                          <div
                            className={`w-2 h-2 rounded-full ${
                              deadline.priority === "high"
                                ? "bg-red-500"
                                : deadline.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
  );
};

export default StudentDashboardPageComponent;
