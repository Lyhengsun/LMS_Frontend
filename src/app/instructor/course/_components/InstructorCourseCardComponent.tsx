"use client";
import { DraftCourse } from "@/src/type/Course";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  BookOpen,
  Clock,
  Edit,
  Eye,
  Trash2,
  Users,
  Calendar,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const InstructorCourseCardComponent = ({
  course,
  onDeleteClick = () => {},
  onSubmitClick = () => {},
}: {
  course: DraftCourse;
  onDeleteClick?: React.MouseEventHandler;
  onSubmitClick?: React.MouseEventHandler;
}) => {
  const router = useRouter();

  const [courseThumbnail, setCourseThumbnail] = useState(
    `${process.env.BASE_API_URL}/files/preview-file/${course.thumbnail}`
  );

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

  // Determine draft status badge
  const getStatusBadge = () => {
    if (course.isApproved) {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      );
    } else if (course.isRejected) {
      return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
    } else if (course.isSubmitted) {
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">
          Pending Review
        </Badge>
      );
    } else {
      return <Badge className="bg-gray-500 hover:bg-gray-600">Draft</Badge>;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Check if course can be submitted (only draft courses that haven't been submitted)
  const canSubmit =
    !course.isSubmitted && !course.isApproved && !course.isRejected;

  return (
    <Link
      href={`/instructor/course/view-course/${course.id}`}
      className="relative h-full"
    >
      <div className="hover:scale-105 transition-transform duration-150 h-full flex flex-col">
        <div className="relative">
          <div className="w-full h-36 relative">
            <Image
              src={courseThumbnail}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-t-lg"
              onError={(e) => {
                setCourseThumbnail("/images/no-image.jpg");
              }}
            />
          </div>
          {/* Status badge overlay */}
          <div className="absolute top-2 right-2">{getStatusBadge()}</div>
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
                <p className="text-sm text-gray-600 h-10 line-clamp-2">
                  {course.description}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                {/* <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students} students</span>
                </div> */}

                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons.length} lessons</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration} minutes</span>
                </div>
              </div>

              {/* Created date */}
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                <span>Created: {formatDate(course.createdAt)}</span>
              </div>
            </div>

            {/* Submit button - only shown for draft courses */}
            {canSubmit && (
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mb-3"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSubmitClick(e);
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit for Approval
              </Button>
            )}

            {/* Instructor action buttons */}
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
          </CardContent>
        </Card>
      </div>
    </Link>
  );
};

export default InstructorCourseCardComponent;
