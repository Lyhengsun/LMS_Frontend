"use client";

import { ArrowLeft, BookOpen, Clock, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock data - replace with actual API calls
const courseHistory = [
  {
    id: 1,
    name: "React Advanced Concepts",
    category: "Web Development",
    progress: 65,
    thumbnail: "/react-logo-abstract.png",
    enrolledDate: "Jan 15, 2024",
    lastAccessed: "2 hours ago",
    totalLessons: 24,
    completedLessons: 16,
    nextLesson: "React Hooks Deep Dive",
    timeRemaining: "45 min",
    status: "in-progress",
  },
  {
    id: 2,
    name: "JavaScript ES6 Features",
    category: "JavaScript Fundamentals",
    progress: 80,
    thumbnail: "/javascript-code.png",
    enrolledDate: "Jan 10, 2024",
    lastAccessed: "5 hours ago",
    totalLessons: 18,
    completedLessons: 14,
    nextLesson: "Async/Await Pattern",
    timeRemaining: "30 min",
    status: "in-progress",
  },
  {
    id: 3,
    name: "Database Design Fundamentals",
    category: "Database Management",
    progress: 45,
    thumbnail: "/database-concept.png",
    enrolledDate: "Jan 5, 2024",
    lastAccessed: "1 day ago",
    totalLessons: 20,
    completedLessons: 9,
    nextLesson: "Normalization Techniques",
    timeRemaining: "60 min",
    status: "in-progress",
  },
  {
    id: 4,
    name: "HTML & CSS Basics",
    category: "Web Development",
    progress: 100,
    thumbnail: "/html-css-code.jpg",
    enrolledDate: "Dec 20, 2023",
    lastAccessed: "1 week ago",
    totalLessons: 15,
    completedLessons: 15,
    nextLesson: null,
    timeRemaining: null,
    status: "completed",
  },
];

export default function CourseHistoryPageComponent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="flex-1">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-foreground">
                Course History
              </h1>
              <p className="text-muted-foreground mt-1">
                View all your enrolled courses and track your progress
              </p>
            </div>

            {/* Course List */}
            <div className="space-y-6">
              {courseHistory.map((course) => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                      <img
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.name}
                        className="h-32 w-32 rounded-lg object-cover bg-muted shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-foreground mb-1">
                              {course.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {course.category}
                            </p>
                          </div>
                          <Badge
                            className={
                              course.status === "completed"
                                ? "bg-green-500 text-white py-1 px-2"
                                : "bg-orange-400 text-white py-1 px-2"
                            }
                          >
                            {course.status === "completed"
                              ? "Completed"
                              : "In Progress"}
                          </Badge>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                            <span>
                              {course.completedLessons}/{course.totalLessons}{" "}
                              lessons completed
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Last accessed {course.lastAccessed}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                              Progress
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              {course.progress}%
                            </span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>

                        {course.status === "in-progress" && (
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 mb-4">
                            <div className="flex items-center gap-2">
                              <PlayCircle className="h-5 w-5 text-primary" />
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  Next Lesson
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {course.nextLesson}
                                </p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {course.timeRemaining}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <Button asChild>
                            <Link href={`/student/courses/${course.id}`}>
                              {course.status === "completed"
                                ? "Review Course"
                                : "Continue Learning"}
                            </Link>
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Enrolled on {course.enrolledDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
