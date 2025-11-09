"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  getCourseProgressByCourseIdForStudentAction,
} from "@/src/action/courseAction";
import { CourseCompletionConfetti } from "@/src/components/CourseCompletionConfetti";
import { LessonCompletionCelebration } from "@/src/components/LessonCompletionCelebration";
import Course, { CourseProgressResponse, Lesson } from "@/src/type/Course";
import {
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CourseVideoComponent from "./CourseVideoComponent";
import { CourseIntroductionComponent } from "./CourseIntroductionComponent";
import CourseContentComponent from "./CourseContentComponent";

const CourseDetailPageComponent = ({
  selectedCourse,
}: {
  selectedCourse: Course;
}) => {
  const sortedLessons = selectedCourse.lessons.sort(
    (a, b) => a.index - b.index
  );
  const [selectedContent, setSelectedContent] = useState<Lesson | null>(null);
  const [courseProgressData, setCourseProgressData] =
    useState<CourseProgressResponse | null>(null);

  console.log("selectedCourse: ");
  console.log(selectedCourse);

  const courseProgress = courseProgressData
    ? {
        hasStarted: true,
        completedLessons: courseProgressData?.contentProgresses.filter(
          (c) => c.completed
        ),
        totalLessons: courseProgressData?.contentProgresses.length,
        isCompleted:
          courseProgressData?.completedCourseContentCount ==
          courseProgressData?.maxCourseContentCount,
        progressPercentage:
          (courseProgressData?.completedCourseContentCount! /
            courseProgressData?.maxCourseContentCount!) *
          100,
      }
    : {
        hasStarted: true,
        completedLessons: [],
        totalLessons: 0,
        isCompleted: false,
        progressPercentage: 0,
      };

  const router = useRouter();
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCourseCompletion, setShowCourseCompletion] = useState(false);

  const loadCourseProgressData = async () => {
    const courseProgressDataRes =
      await getCourseProgressByCourseIdForStudentAction(selectedCourse.id);

    if (courseProgressDataRes.success) {
      setCourseProgressData(courseProgressDataRes.data!);
      const firstIncompletedContentIndex =
        courseProgressDataRes?.data!.contentProgresses!.findIndex(
          (c) => !c.completed
        );

      if (firstIncompletedContentIndex > 0) {
        const nextLesson = sortedLessons[firstIncompletedContentIndex];
        if (selectedCourse.isAccessible || !nextLesson.requirePayment) {
          setSelectedContent(nextLesson);
        }
      }
    }
  };

  useEffect(() => {
    loadCourseProgressData();
  }, []);

  const handleVideoClose = () => {
    setSelectedContent(null);
  };

  return (
    <div className="flex flex-1 overflow-y-hidden">
      {/* Video Player and Content */}
      <div className="flex-1 flex flex-col bg-gray-100 h-dvh overflow-scroll">
        {/* Header with Navigation */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{selectedCourse.title}</h1>
              <p className="text-sm text-gray-600">
                {selectedContent ? selectedContent?.title : "Introduction"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Progress: {courseProgress.progressPercentage}%
            </div>
            <Progress
              value={courseProgress.progressPercentage}
              className="w-32"
            />
          </div>
        </div>

        <div>
          {selectedContent != null ? (
            <CourseVideoComponent
              selectedCourse={selectedCourse}
              selectedContent={selectedContent}
              courseProgressData={courseProgressData}
              sortedLessons={sortedLessons}
              setSelectedContent={setSelectedContent}
              loadCourseProgressData={loadCourseProgressData}
              setShowCourseCompletion={setShowCourseCompletion}
              setShowCelebration={setShowCelebration}
            />
          ) : (
            <CourseIntroductionComponent
              course={selectedCourse}
              onStartCourse={() => {
                console.log("start course");
              }}
            />
          )}
        </div>
      </div>

      {/* Course Content Sidebar */}
      <div className="w-80 bg-white border-l flex flex-col h-dvh overflow-y-scroll">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Course Content</h3>
          <p className="text-sm text-gray-600 mt-1">
            {courseProgress.completedLessons.length} of {sortedLessons.length}{" "}
            lessons completed
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {
              sortedLessons.map((lesson : Lesson, index:number) => 
                <CourseContentComponent 
                  key={lesson.id}
                  index={index}
                  selectedCourse={selectedCourse}
                  selectedContent={selectedContent}
                  lesson={lesson}
                  courseProgress={courseProgress}
                  setSelectedContent={setSelectedContent}
                />
              )
            }
          </div>
        </div>
      </div>

      <LessonCompletionCelebration
        show={showCelebration}
        lessonTitle={selectedContent?.title!}
        onContinue={() => setShowCelebration(false)}
      />

      <CourseCompletionConfetti
        show={showCourseCompletion}
        courseName={selectedCourse.title}
        onClose={() => setShowCourseCompletion(false)}
        onContinue={() => {
          setShowCourseCompletion(false);
          handleVideoClose();
        }}
      />
    </div>
  );
};

export default CourseDetailPageComponent;
