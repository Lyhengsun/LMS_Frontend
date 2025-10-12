"use client";
import React, { useEffect, useState } from "react";

import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContinueLearning } from "@/src/type/Dashboard";
import { getContinueLearningForStudentAction } from "@/src/action/dashboardAction";
import { toast } from "sonner";
import CustomPaginationOnClick from "@/src/app/_components/CustomPaginationOnClick";
import { useRouter } from "next/navigation";

// const continueLearning = [
//   {
//     id: 1,
//     name: "React Advanced Concepts",
//     category: "Web Development",
//     progress: 65,
//     thumbnail: "/react-logo-abstract.png",
//     nextLesson: "React Hooks Deep Dive",
//     timeRemaining: "45 min",
//   },
//   {
//     id: 2,
//     name: "JavaScript ES6 Features",
//     category: "JavaScript Fundamentals",
//     progress: 80,
//     thumbnail: "/javascript-code.png",
//     nextLesson: "Async/Await Pattern",
//     timeRemaining: "30 min",
//   },
//   {
//     id: 3,
//     name: "Database Design Fundamentals",
//     category: "Database Management",
//     progress: 45,
//     thumbnail: "/database-concept.png",
//     nextLesson: "Normalization Techniques",
//     timeRemaining: "60 min",
//   },
// ];

const ContinueLearningComponent = () => {
  const router = useRouter();
  const [continueLearning, setContinueLearning] = useState<ContinueLearning[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const loadContinueLearnings = async () => {
    const continueLearningRes = await getContinueLearningForStudentAction(
      page,
      3
    );
    if (continueLearningRes.success) {
      setContinueLearning(continueLearningRes.data?.items!);
      setMaxPage(continueLearningRes.data?.pagination.totalPages!);
    } else {
      toast.error("Failed to fetch unfinish course for student");
    }
  };

  useEffect(() => {
    loadContinueLearnings();
  }, [page]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Continue Learning
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          {/* <Link
            href="/dashboard/course-history"
            className="flex items-center gap-1"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link> */}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {continueLearning.map((course) => (
          <Link
            href={`/my-course/${course.courseId}`}
            key={course.courseId}
            className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
          >
            <img
              src={`${process.env.BASE_API_URL}/files/preview-file/${course.thumbnailUrl}`}
              alt={course.courseName}
              className="h-16 w-16 rounded-lg object-cover bg-muted cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate hover:underline cursor-pointer">
                {course.courseName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {course.categoryName}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={course.progress} className="flex-1 h-2" />
                <span className="text-sm font-medium text-muted-foreground min-w-[3rem] text-right">
                  {course.progress}%
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{course.timeRemainingInMinutes} remaining</span>
                <span className="mx-1">•</span>
                <span>Next: {course.nextContent.courseContentName}</span>
              </div>
            </div>
            <Button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/my-course/${course.courseId}`);
              }}
            >
              Continue
            </Button>
          </Link>
        ))}

        {continueLearning.length > 0 && (
          <CustomPaginationOnClick
            currentPage={page}
            maxPage={maxPage}
            nextOnClick={() => {
              if (page < maxPage) {
                setPage((p) => p + 1);
              }
            }}
            previousOnClick={() => {
              if (page > 1) {
                setPage((p) => p - 1);
              }
            }}
          />
        )}
        {continueLearning.length == 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="font-semibold text-foreground mb-1">
              No courses in progress
            </h3>
            <p className="text-sm text-muted-foreground">
              You haven't started a new course yet. Browse available courses to
              begin learning!
            </p>
          <Button variant="default" className="mt-4" asChild>
              <Link href="/my-course">Browse Courses</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContinueLearningComponent;
