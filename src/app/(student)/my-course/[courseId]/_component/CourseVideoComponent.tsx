"use client";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedVideoPlayer } from "@/src/components/EnhancedVideoPlayer";
import { BookOpen } from "lucide-react";
import Course, { CourseProgressResponse, Lesson } from "@/src/type/Course";
import { useVideoProgress } from "@/src/lib/hooks/useVideoProgress";
import { completeCourseContentForStudentAction } from "@/src/action/courseAction";
import confetti from "canvas-confetti";

const CourseVideoComponent = ({
  selectedCourse,
  selectedContent,
  courseProgressData,
  sortedLessons,
  setSelectedContent,
  loadCourseProgressData,
  setShowCourseCompletion,
  setShowCelebration,
}: {
  selectedCourse: Course;
  selectedContent: Lesson | null;
  courseProgressData: CourseProgressResponse | null;
  sortedLessons: Lesson[];
  setSelectedContent: (selectedContent: Lesson) => void;
  loadCourseProgressData: () => void;
  setShowCourseCompletion: (value: boolean) => void;
  setShowCelebration: (value: boolean) => void;
}) => {
  const videoProgress = useVideoProgress(
    selectedCourse?.id || 0,
    selectedContent?.id || 0
  );

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
    <div>
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
            sortedLessons.findIndex((l: any) => l.id === selectedContent?.id) <
            sortedLessons.length - 1
          }
          hasPrevious={
            sortedLessons.findIndex((l: any) => l.id === selectedContent?.id) >
            0
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
  );
};

export default CourseVideoComponent;
