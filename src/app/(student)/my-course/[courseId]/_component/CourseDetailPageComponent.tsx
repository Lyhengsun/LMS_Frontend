"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  completeCourseContentForStudentAction,
  getCourseProgressByCourseIdForStudentAction,
} from "@/src/action/courseAction";
import { CourseCompletionConfetti } from "@/src/components/CourseCompletionConfetti";
import { useCourseProgressStore } from "@/src/components/CourseProgress";
import { EnhancedVideoPlayer } from "@/src/components/EnhancedVideoPlayer";
import { LessonCompletionCelebration } from "@/src/components/LessonCompletionCelebration";
import { useVideoProgress } from "@/src/lib/hooks/useVideoProgress";
import Course, { CourseProgressResponse, Lesson } from "@/src/type/Course";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CourseDetailPageComponent = ({
  selectedCourse,
}: {
  selectedCourse: Course;
}) => {
  const sortedLessons = selectedCourse.lessons.sort(
    (a, b) => a.index - b.index
  );
  const [selectedContent, setSelectedContent] = useState<Lesson | null>(
    sortedLessons[0]
  );
  const [courseProgressData, setCourseProgressData] =
    useState<CourseProgressResponse | null>(null);

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
      const firstIncompletedContentIndex = courseProgressDataRes?.data!.contentProgresses!.findIndex(c => !c.completed);
      setSelectedContent(sortedLessons[firstIncompletedContentIndex])
    }
  };

  useEffect(() => {
    loadCourseProgressData();
  }, []);

  const videoProgress = useVideoProgress(
    selectedCourse?.id || 0,
    selectedContent?.id || 0
  );

  const handleVideoClose = () => {
    setSelectedContent(null);
  };

  const handleVideoProgress = (
    courseId: number,
    lessonId: number,
    currentTime: any,
    duration: any
  ) => {
    if (
      selectedCourse &&
      selectedContent &&
      courseId === selectedCourse.id &&
      lessonId === selectedContent?.id
    ) {
      videoProgress.updateProgress(currentTime, duration);
    }
  };

  const handleLessonComplete = async (courseContentId: number) => {
    await completeCourseContentForStudentAction(courseContentId);
    await loadCourseProgressData();

    // Check if course is now complete
    const course = selectedCourse;

    if (
      course &&
      courseProgressData?.completedCourseContentCount! + 1 >=
        courseProgressData?.maxCourseContentCount!
    ) {
      // Course completed! Show course completion celebration
      setTimeout(() => {
        setShowCourseCompletion(true);
      }, 1000);
    } else {
      // Just lesson completed
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setShowCelebration(true);
    }
  };

  return (
    <div className="flex flex-1">
      {/* Video Player and Content */}
      <div className="flex-1 flex flex-col bg-gray-100">
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
              <p className="text-sm text-gray-600">{selectedContent?.title}</p>
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

        {/* Video Player */}
        <div className="p-6">
          <EnhancedVideoPlayer
            src={`${
              process.env.BASE_API_URL
            }/files/video/${selectedContent?.videoUrl!}`}
            title={selectedContent?.title}
            onProgress={(currentTime, duration) => {
              handleVideoProgress(
                selectedCourse.id,
                selectedContent?.id!,
                currentTime,
                duration
              );
            }}
            onEnded={() => handleLessonComplete(selectedContent!.id)}
            onNext={() => {
              const currentIndex = sortedLessons.findIndex(
                (l: any) => l.id === selectedContent?.id
              );
              if (currentIndex < sortedLessons.length - 1) {
                setSelectedContent(sortedLessons[currentIndex + 1]);
              }
            }}
            onPrevious={() => {
              const currentIndex = sortedLessons.findIndex(
                (l: any) => l.id === selectedContent?.id
              );
              if (currentIndex > 0) {
                setSelectedContent(sortedLessons[currentIndex - 1]);
              }
            }}
            hasNext={
              sortedLessons.findIndex(
                (l: any) => l.id === selectedContent?.id
              ) <
              sortedLessons.length - 1
            }
            hasPrevious={
              sortedLessons.findIndex(
                (l: any) => l.id === selectedContent?.id
              ) > 0
            }
          />
        </div>

        {/* Course Content Tabs */}
        <div className="flex-1 bg-white">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-1 bg-gray-50 rounded-none border-b">
              <TabsTrigger
                value="overview"
                className="flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              {/* <TabsTrigger
                value="resources"
                className="flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Resources</span>
              </TabsTrigger> */}
              {/* <TabsTrigger
                value="comments"
                className="flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Comments</span>
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="overview" className="p-6 space-y-6">
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="prose prose-sm max-w-none">
                      <h2 className="text-xl font-bold">
                        {selectedContent?.title}
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedCourse.description}
                      </p>
                      {/* <h4 className="font-semibold mt-4 mb-2">
                        What you'll learn:
                      </h4> */}
                      {/* <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Core concepts and principles</li>
                        <li>Practical implementation techniques</li>
                        <li>Common patterns and best practices</li>
                        <li>Real-world examples and use cases</li>
                      </ul> */}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Card className="p-4">
                      <h4 className="font-semibold">Lesson Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span>{selectedContent?.duration} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Progress:</span>
                          <span>{videoProgress.progressPercentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span
                            className={
                              videoProgress.progressPercentage === 100
                                ? "text-green-600"
                                : "text-orange-600"
                            }
                          >
                            {videoProgress.progressPercentage === 100
                              ? "Completed"
                              : "In Progress"}
                          </span>
                        </div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-semibold mb-2">Instructor</h4>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>
                            {selectedCourse.instructor
                              .split(" ")
                              .map((n: any) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">
                            {selectedCourse.instructor}
                          </p>
                          <p className="text-xs text-gray-600">
                            Course Instructor
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* <TabsContent value="resources" className="p-6">
              <LessonResources
                courseId={selectedCourse.id}
                lessonId={selectedVideo?.id!}
              />
            </TabsContent> */}

            {/* <TabsContent value="comments" className="p-6">
              <VideoComments
                courseId={selectedCourse.id}
                lessonId={selectedVideo?.id!}
              />
            </TabsContent> */}
          </Tabs>
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
            {sortedLessons.map((lesson: any, index: number) => {
              const isCompleted = courseProgress.completedLessons
                .map((c) => c.id)
                .includes(lesson.id);
              const isCurrent = lesson.id === selectedContent?.id;

              return (
                <div
                  key={lesson.id}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                    isCurrent
                      ? "bg-purple-50 border border-purple-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedContent(lesson)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex justify-between items-center">
                      <div>
                        <p
                          className={`text-sm font-medium line-clamp-1 ${
                            isCurrent ? "text-purple-700" : "text-gray-900"
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
                      {isCurrent && (
                        <PlayCircle className="w-5 h-5 text-purple-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
