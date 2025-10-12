"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Users, Eye, BookOpen } from "lucide-react";
import Link from "next/link";
import { InstructorDashboardCourse } from "@/src/type/Dashboard";
import { getInstructorCoursesAction } from "@/src/action/dashboardAction";
import { toast } from "sonner";
import CustomPaginationOnClick from "@/src/app/_components/CustomPaginationOnClick";
import { useRouter } from "next/navigation";

export function InstructorCourseDashboardComponent() {
  const router = useRouter();
  const [courses, setCourses] = useState<InstructorDashboardCourse[]>([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const loadCourses = async () => {
    const coursesRes = await getInstructorCoursesAction(page, 5);
    if (coursesRes.success) {
      setCourses(coursesRes.data?.items!);
      setMaxPage(coursesRes.data?.pagination.totalPages!);
    } else {
      toast.error("Failed to fetch courses for instructor");
    }
  };

  useEffect(() => {
    loadCourses();
  }, [page]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Pending Approval":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Course Management Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 grid grid-cols-2">
        {courses.map((course) => (
          <div
            key={course.courseId}
            className="flex flex-col md:flex-row gap-4 rounded-lg border border-border p-5 hover:bg-accent/50 transition-all hover:shadow-md"
          >
            <img
              src={`${process.env.BASE_API_URL}/files/preview-file/${course.thumbnailUrl}`}
              alt={course.courseName}
              className="w-full md:w-48 md:h-32 rounded-lg object-cover bg-muted flex-shrink-0"
            />
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg text-foreground">
                  {course.courseName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {course.categoryName}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={getStatusColor(course.status)} variant="secondary">
                    {course.status}
                  </Badge>
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="font-medium text-foreground">{course.enrollmentCount}</span> students enrolled
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    router.push(`/instructor/course/edit-course/${course.courseId}`)
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Link href={`/instructor/dashboard/courses/${course.courseId}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Students
                  </Button>
                </Link>
                {course.status === "Draft" && (
                  <Button size="sm" variant="default">
                    Publish
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        </div>

        {courses.length > 0 && (
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

        {courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="font-semibold text-foreground mb-1">
              No courses yet
            </h3>
            <p className="text-sm text-muted-foreground">
              You haven't created any courses yet. Start creating your first course!
            </p>
            <Button variant="default" className="mt-4" asChild>
              <Link href="/instructor/course">Create Course</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
