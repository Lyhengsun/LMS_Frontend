"use client";
import { useCourseProgressStore } from "@/src/components/CourseProgress";
import Course from "@/src/type/Course";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  BookOpen,
  Clock,
  Edit,
  Eye,
  PlayCircle,
  Trash2,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const CourseCardComponent = ({
  course,
  handleStartLearning,
  role = "student",
  onDeleteClick = () => {},
}: {
  course: Course;
  handleStartLearning: any;
  role?: "student" | "instructor";
  onDeleteClick?: React.MouseEventHandler;
}) => {
  const router = useRouter();
  const { startCourse, completeLesson, getCourseProgress } =
    useCourseProgressStore();

  const [courseThumbnail, setCourseThumbnail] = useState(
    `${process.env.BASE_API_URL}/files/preview-file/${course.thumbnail}`
  );
  const courseProgress = getCourseProgress(course.id);
  const handleViewCourse = (
    courseId: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/instructor/course/view-course/${courseId}`);
  };

  const handleEditCourse = (
    courseId: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/instructor/course/edit-course/${courseId}`);
  };

  const linkHref =
    role == "instructor"
      ? `/instructor/course/view-course/${course.id}`
      : `/my-course/${course.id}`;
  return (
    <Link href={linkHref} className="relative h-full">
      <div className="hover:scale-105 transition-transform duration-150 h-full flex flex-col">
        <div className="relative">
          <div className="w-full h-36 relative">
            {" "}
            {/* Added this wrapper div */}
            <Image
              src={courseThumbnail}
              alt={course.title}
              fill // Use fill to make the image cover the parent div
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust sizes based on your layout
              className="object-cover rounded-t-lg"
              onError={(e) => {
                // Fallback to placeholder if the main image fails to load
                setCourseThumbnail("/images/no-image.jpg");
              }}
            />
          </div>

          {role == "student" && courseProgress.progressPercentage > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
              <div className="flex items-center justify-between text-white text-xs mb-1">
                <span>{courseProgress.progressPercentage}% complete</span>
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
          className="hover:shadow-lg transition-shadow rounded-t-none pt-3 flex flex-col justify-between flex-1"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2 line-clamp-2">
                  {course.title}
                </CardTitle>
                <p className="text-sm text-gray-600 h-10 line-clamp-2  ">
                  {course.description}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-2">
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
            {role == "student" && (
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleStartLearning(course.id);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                {courseProgress.progressPercentage > 0 ? "Continue" : "Start"}
              </Button>
            )}
            {role == "instructor" && (
              <div className="flex items-center justify-start space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleViewCourse(course.id, e)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleEditCourse(course.id, e)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDeleteClick(e);
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Link>
  );
};

export default CourseCardComponent;
