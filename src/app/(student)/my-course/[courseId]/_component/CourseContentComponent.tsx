"use client"
import Course, { ContentProgress, Lesson } from "@/src/type/Course";
import { CheckCircle, Clock, PlayCircle, Lock } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const CourseContentComponent = ({
  index,
  selectedCourse,
  selectedContent,
  lesson,
  courseProgress,
  setSelectedContent,
}: {
  index: number;
  selectedCourse: Course;
  selectedContent: Lesson | null;
  lesson: Lesson;
  courseProgress: any;
  setSelectedContent: (selectedContent: Lesson) => void;
}) => {
  const isLocked = !selectedCourse.isAccessible && lesson.requirePayment;
  const isCompleted = courseProgress.completedLessons
    .map((c : ContentProgress) => c.id)
    .includes(lesson.id);
  const isCurrent = lesson.id === selectedContent?.id;

  const handleClick = () => {
    if (!isLocked) {
      setSelectedContent(lesson);
    } else {
        toast.info("You need to pay for this lesson")
    }
  };

  return (
    <div
      key={lesson.id}
      className={`p-3 rounded-lg mb-2 transition-colors cursor-pointer ${
        isLocked ? "grayscale " : "hover:bg-gray-50"
      } ${
        isCurrent && !isLocked ? "bg-purple-50 border border-purple-200" : ""
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
            isCompleted
              ? "bg-green-500 text-white"
              : isCurrent && !isLocked
              ? "bg-purple-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
        </div>
        <div className="flex-1 min-w-0 flex justify-between items-center">
          <div>
            <p
              className={`text-sm font-medium line-clamp-1 ${
                isCurrent && !isLocked ? "text-purple-700" : "text-gray-900"
              }`}
            >
              {lesson.title}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {lesson.duration} minutes
              </span>
            </div>
          </div>
          {isLocked ? (
            <Lock className="w-5 h-5 text-gray-400" />
          ) : (
            isCurrent && <PlayCircle className="w-5 h-5 text-purple-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseContentComponent;
