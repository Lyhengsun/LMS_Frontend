"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseCompletionConfetti } from "@/src/components/CourseCompletionConfetti";
import { useCourseProgressStore } from "@/src/components/CourseProgress";
import { EnhancedVideoPlayer } from "@/src/components/EnhancedVideoPlayer";
import { LessonCompletionCelebration } from "@/src/components/LessonCompletionCelebration";
import { LessonResources } from "@/src/components/LessonResources";
import { VideoComments } from "@/src/components/VideoComments";
import { useVideoProgress } from "@/src/lib/hooks/useVideoProgress";
import Course, { Lesson } from "@/src/type/Course";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  MessageCircle,
  Play,
  PlayCircle,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const CreateCourseDetailPageComponent = () => {
  const selectedCourse: Course = {
    id: 1,
    title: "React Development Masterclass",
    instructor: "Dr. Sarah Johnson",
    duration: 40,
    level: "Intermediate",
    students: 1250,
    category: "development",
    description: "test",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    lessons: [
      {
        id: 1,
        title: "Introduction to React",
        duration: 40,
        videoUrl:
          "http://localhost:8090/api/v1/files/video/502702aa-757a-428d-b1a7-2597b0f88b47",
        isCompleted: false,
        index: 1,
      },
      {
        id: 2,
        title: "Components and Props",
        duration: 40,
        videoUrl:
          "http://localhost:8090/api/v1/files/video/faef3f63-166a-4d3c-b6fc-2d08d3f0fe19",
        isCompleted: false,
        index: 2,
      },
      {
        id: 3,
        title: "State Management",
        duration: 40,
        videoUrl:
          "http://localhost:8090/api/v1/files/video/b1e9e194-0377-4c42-b5fc-cfe34d03cb18",
        isCompleted: false,
        index: 3,
      },
    ],
  };
  const { startCourse, completeLesson, getCourseProgress } =
    useCourseProgressStore();
  const [selectedVideo, setSelectedVideo] = useState<Lesson | null>(
    selectedCourse.lessons[0]
  );
  const courseProgress = getCourseProgress(selectedCourse.id);
  const router = useRouter();

  const videoProgress = useVideoProgress(
    selectedCourse?.id || 0,
    selectedVideo?.id || 0
  );

  const handleVideoProgress = (
    courseId: number,
    lessonId: number,
    currentTime: any,
    duration: any
  ) => {
    if (
      selectedCourse &&
      selectedVideo &&
      courseId === selectedCourse.id &&
      lessonId === selectedVideo?.id
    ) {
      videoProgress.updateProgress(currentTime, duration);
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
              <p className="text-sm text-gray-600">{selectedVideo?.title}</p>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="p-6">
          <EnhancedVideoPlayer
            src={selectedVideo?.videoUrl!}
            title={selectedVideo?.title}
            onProgress={(currentTime, duration) => {
              handleVideoProgress(
                selectedCourse.id,
                selectedVideo?.id!,
                currentTime,
                duration
              );
            }}
            onNext={() => {
              const currentIndex = selectedCourse.lessons.findIndex(
                (l: any) => l.id === selectedVideo?.id
              );
              if (currentIndex < selectedCourse.lessons.length - 1) {
                setSelectedVideo(selectedCourse.lessons[currentIndex + 1]);
              }
            }}
            onPrevious={() => {
              const currentIndex = selectedCourse.lessons.findIndex(
                (l: any) => l.id === selectedVideo?.id
              );
              if (currentIndex > 0) {
                setSelectedVideo(selectedCourse.lessons[currentIndex - 1]);
              }
            }}
            hasNext={
              selectedCourse.lessons.findIndex(
                (l: any) => l.id === selectedVideo?.id
              ) <
              selectedCourse.lessons.length - 1
            }
            hasPrevious={
              selectedCourse.lessons.findIndex(
                (l: any) => l.id === selectedVideo?.id
              ) > 0
            }
          />
        </div>

        {/* Course Content Tabs */}
        <div className="flex-1 bg-white">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-50 rounded-none border-b">
              <TabsTrigger
                value="overview"
                className="flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Resources</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {selectedVideo?.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        In this lesson, you'll learn the fundamentals of{" "}
                        {selectedVideo?.title.toLowerCase()}. This comprehensive
                        tutorial covers essential concepts, practical examples,
                        and best practices that will help you master this
                        important topic.
                      </p>
                      <h4 className="font-semibold mt-4 mb-2">
                        What you'll learn:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Core concepts and principles</li>
                        <li>Practical implementation techniques</li>
                        <li>Common patterns and best practices</li>
                        <li>Real-world examples and use cases</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="p-6">
              <LessonResources
                courseId={selectedCourse.id}
                lessonId={selectedVideo?.id!}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Course Content Sidebar */}
      <div className="w-80 bg-white border-l flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Course Content</h3>
          <p className="text-sm text-gray-600 mt-1">
            {courseProgress.completedLessons.length} of{" "}
            {selectedCourse.lessons.length} lessons completed
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {selectedCourse.lessons.map((lesson: any, index: number) => {
              const isCompleted = courseProgress.completedLessons.includes(
                lesson.id
              );
              const isCurrent = lesson.id === selectedVideo?.id;

              return (
                <div
                  key={lesson.id}
                  className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                    isCurrent
                      ? "bg-purple-50 border border-purple-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedVideo(lesson)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        isCurrent
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          isCurrent ? "text-purple-700" : "text-gray-900"
                        }`}
                      >
                        {lesson.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {lesson.duration}
                        </span>
                        {isCurrent && (
                          <PlayCircle className="w-3 h-3 text-purple-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Add New Lesson</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourseDetailPageComponent;
