"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedVideoPlayer } from "@/src/components/EnhancedVideoPlayer";
import { LessonResources } from "@/src/components/LessonResources";
import Course, { Lesson } from "@/src/type/Course";
import { ArrowLeft, BookOpen, Clock, PlayCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CreateCourseContentFormComponent from "./CreateCourseContentFormComponent";

const InstructorCourseDetailPageComponent = ({
  selectedCourse,
  mode = "view",
}: {
  selectedCourse: Course;
  mode?: "view" | "edit";
}) => {
  const [isAddLessonDialogOpen, setIsAddLessonDialogOpen] = useState(false);
  const [isSubmittingContent, setIsSubmittingContent] = useState(false);
  const sortedLessons = selectedCourse.lessons.sort(
    (a, b) => a.index - b.index
  );
  const [selectedContent, setSelectedContent] = useState<Lesson | null>(
    sortedLessons.length > 0 ? sortedLessons[0] : null
  );
  const router = useRouter();

  return (
    <div className="flex flex-1">
      {/* Video Player and Content */}
      <div className="flex-1 flex flex-col bg-gray-100 h-dvh overflow-y-scroll no-scrollbar">
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
        </div>

        {/* Video Player */}
        <div className="p-6">
          {selectedContent != null ? (
            <EnhancedVideoPlayer
              src={`${
                process.env.BASE_API_URL
              }/files/video/${selectedContent?.videoUrl!}`}
              title={selectedContent?.title}
              onProgress={(currentTime, duration) => {}}
              onNext={() => {
                const currentIndex = selectedCourse.lessons.findIndex(
                  (l: any) => l.id === selectedContent?.id
                );
                if (currentIndex < selectedCourse.lessons.length - 1) {
                  setSelectedContent(selectedCourse.lessons[currentIndex + 1]);
                }
              }}
              onPrevious={() => {
                const currentIndex = selectedCourse.lessons.findIndex(
                  (l: any) => l.id === selectedContent?.id
                );
                if (currentIndex > 0) {
                  setSelectedContent(selectedCourse.lessons[currentIndex - 1]);
                }
              }}
              hasNext={
                selectedCourse.lessons.findIndex(
                  (l: any) => l.id === selectedContent?.id
                ) <
                selectedCourse.lessons.length - 1
              }
              hasPrevious={
                selectedCourse.lessons.findIndex(
                  (l: any) => l.id === selectedContent?.id
                ) > 0
              }
            />
          ) : (
            <div className="relative bg-black aspect-video rounded-lg overflow-hidden group"></div>
          )}
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
            </TabsList>

            <TabsContent value="overview" className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">
                  {selectedContent?.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-3">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedCourse.description}
                      </p>
                      {/* <p className="text-gray-700 leading-relaxed">
                        In this lesson, you'll learn the fundamentals of{" "}
                        {selectedContent?.title.toLowerCase()}. This
                        comprehensive tutorial covers essential concepts,
                        practical examples, and best practices that will help
                        you master this important topic.
                      </p>
                      <h4 className="font-semibold mt-4 mb-2">
                        What you'll learn:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Core concepts and principles</li>
                        <li>Practical implementation techniques</li>
                        <li>Common patterns and best practices</li>
                        <li>Real-world examples and use cases</li>
                      </ul> */}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="resources" className="p-6">
              <LessonResources
                courseId={selectedCourse.id}
                lessonId={selectedContent?.id!}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Course Content Sidebar */}
      <div className="w-80 bg-white border-l flex flex-col h-dvh overflow-y-scroll no-scrollbar">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Course Content</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {sortedLessons.map((lesson: any, index: number) => {
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
                        isCurrent
                          ? "bg-purple-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {index + 1}
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
          <div className="p-4 border-t border-gray-200">
            {mode == "edit" && (
              <Dialog
                open={isAddLessonDialogOpen}
                onOpenChange={setIsAddLessonDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium text-md py-6 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    disabled={isSubmittingContent}
                  >
                    <Plus className="w-5 h-5" />
                    <span>
                      {isSubmittingContent ? "Uploading..." : "Add New Lesson"}
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add a new lesson</DialogTitle>
                  </DialogHeader>
                  <CreateCourseContentFormComponent
                    courseId={selectedCourse.id}
                    courseContentIndex={sortedLessons.length + 1}
                    onOpenChange={setIsAddLessonDialogOpen}
                    isSubmitting={isSubmittingContent}
                    setIsSubmitting={setIsSubmittingContent}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseDetailPageComponent;
