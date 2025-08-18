"use client";
import { CourseCompletionConfetti } from "@/components/CourseCompletionConfetti";
import { useCourseProgressStore } from "@/components/CourseProgress";
import { EnhancedVideoPlayer } from "@/components/EnhancedVideoPlayer";
import { LessonCompletionCelebration } from "@/components/LessonCompletionCelebration";
import { LessonResources } from "@/components/LessonResources";
import { Sidebar } from "@/components/Sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoComments } from "@/components/VideoComments";
import { useVideoProgress } from "@/lib/hooks/useVideoProgress";
import confetti from "canvas-confetti";
import { ArrowLeft, BookOpen, CheckCircle, Clock, Filter, MessageCircle, Play, PlayCircle, Search, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

const MyCoursePageComponent = () => {
  //   const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null as any);
  const [selectedVideo, setSelectedVideo] = useState(null as any);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showCourseCompletion, setShowCourseCompletion] = useState(false);

  const { startCourse, completeLesson, getCourseProgress } =
    useCourseProgressStore();

  // Call useVideoProgress at top level with null safety
  const videoProgress = useVideoProgress(
    selectedCourse?.id || 0,
    selectedVideo?.id || 0
  );

  const courses = [
    {
      id: 1,
      title: "React Development Masterclass",
      instructor: "Dr. Sarah Johnson",
      duration: "40 hours",
      level: "Intermediate",
      rating: 4.8,
      studentsEnrolled: 1250,
      category: "development",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
      lessons: [
        {
          id: 1,
          title: "Introduction to React",
          duration: "15:30",
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          isCompleted: false,
        },
        {
          id: 2,
          title: "Components and Props",
          duration: "22:45",
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          isCompleted: false,
        },
        {
          id: 3,
          title: "State Management",
          duration: "18:20",
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          isCompleted: false,
        },
        {
          id: 4,
          title: "Hooks in Depth",
          duration: "25:10",
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          isCompleted: false,
        },
        {
          id: 5,
          title: "Advanced Patterns",
          duration: "30:15",
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          isCompleted: false,
        },
      ],
    },
    {
      id: 2,
      title: "Python for Data Science",
      instructor: "Prof. Michael Chen",
      duration: "35 hours",
      level: "Beginner",
      rating: 4.6,
      studentsEnrolled: 890,
      category: "data-science",
      thumbnail:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop",
      lessons: [
        {
          id: 1,
          title: "Python Basics",
          duration: "20:30",
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          isCompleted: false,
        },
        {
          id: 2,
          title: "NumPy and Pandas",
          duration: "28:45",
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          isCompleted: false,
        },
        {
          id: 3,
          title: "Data Visualization",
          duration: "25:20",
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          isCompleted: false,
        },
      ],
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      instructor: "Emma Rodriguez",
      duration: "25 hours",
      level: "Beginner",
      rating: 4.9,
      studentsEnrolled: 2100,
      category: "design",
      thumbnail:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop",
      lessons: [
        {
          id: 1,
          title: "Design Principles",
          duration: "18:30",
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          isCompleted: false,
        },
        {
          id: 2,
          title: "User Research",
          duration: "22:15",
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
          isCompleted: false,
        },
      ],
    },
    {
      id: 4,
      title: "Machine Learning Basics",
      instructor: "Dr. Alex Kumar",
      duration: "45 hours",
      level: "Advanced",
      rating: 4.7,
      studentsEnrolled: 750,
      category: "data-science",
      thumbnail:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop",
      lessons: [
        {
          id: 1,
          title: "ML Introduction",
          duration: "24:30",
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          isCompleted: false,
        },
      ],
    },
    {
      id: 5,
      title: "Digital Marketing Strategy",
      instructor: "Lisa Thompson",
      duration: "30 hours",
      level: "Intermediate",
      rating: 4.5,
      studentsEnrolled: 1450,
      category: "marketing",
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop",
      lessons: [
        {
          id: 1,
          title: "Marketing Fundamentals",
          duration: "19:45",
          videoUrl:
            "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
          isCompleted: false,
        },
      ],
    },
  ];

  const categories = [
    "all",
    "development",
    "data-science",
    "design",
    "marketing",
  ];

  useEffect(() => {
    // Initialize course progress
    courses.forEach((course) => {
      startCourse(course.id, course.lessons.length);
    });
  }, [startCourse]);

  useEffect(() => {
    const handleLessonCompleted = (event: any) => {
      setShowCelebration(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    };

    window.addEventListener("lessonCompleted", handleLessonCompleted);
    return () => {
      window.removeEventListener("lessonCompleted", handleLessonCompleted);
    };
  }, []);

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
      lessonId === selectedVideo.id
    ) {
      videoProgress.updateProgress(currentTime, duration);
    }
  };

  const handleLessonComplete = (courseId: number, lessonId: number) => {
    completeLesson(courseId, lessonId);

    // Check if course is now complete
    const courseProgress = getCourseProgress(courseId);
    const course = courses.find((c) => c.id === courseId);

    if (
      course &&
      courseProgress.completedLessons.length + 1 >= course.lessons.length
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

  const handleVideoClose = () => {
    setSelectedVideo(null);
    setSelectedCourse(null);
  };

  const handleStartLearning = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      const courseProgress = getCourseProgress(courseId);
      const nextLesson =
        course.lessons.find(
          (lesson) => !courseProgress.completedLessons.includes(lesson.id)
        ) || course.lessons[0];

      setSelectedCourse(course);
      setSelectedVideo(nextLesson);
      startCourse(courseId, course.lessons.length);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      (course.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (course.instructor?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      );
    const matchesCategory =
      filterCategory === "all" || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Enhanced Course Learning Interface - keeps navigation visible
  if (selectedVideo && selectedCourse) {
    const courseProgress = getCourseProgress(selectedCourse.id);

    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex flex-1">
          {/* Video Player and Content */}
          <div className="flex-1 flex flex-col bg-gray-100">
            {/* Header with Navigation */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVideoClose}
                  className="flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Courses
                </Button>
                <div>
                  <h1 className="text-lg font-semibold">
                    {selectedCourse.title}
                  </h1>
                  <p className="text-sm text-gray-600">{selectedVideo.title}</p>
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
                src={selectedVideo.videoUrl}
                title={selectedVideo.title}
                onProgress={(currentTime, duration) => {
                  handleVideoProgress(
                    selectedCourse.id,
                    selectedVideo.id,
                    currentTime,
                    duration
                  );
                }}
                onEnded={() =>
                  handleLessonComplete(selectedCourse.id, selectedVideo.id)
                }
                onNext={() => {
                  const currentIndex = selectedCourse.lessons.findIndex(
                    (l: any) => l.id === selectedVideo.id
                  );
                  if (currentIndex < selectedCourse.lessons.length - 1) {
                    setSelectedVideo(selectedCourse.lessons[currentIndex + 1]);
                  }
                }}
                onPrevious={() => {
                  const currentIndex = selectedCourse.lessons.findIndex(
                    (l: any) => l.id === selectedVideo.id
                  );
                  if (currentIndex > 0) {
                    setSelectedVideo(selectedCourse.lessons[currentIndex - 1]);
                  }
                }}
                hasNext={
                  selectedCourse.lessons.findIndex(
                    (l: any) => l.id === selectedVideo.id
                  ) <
                  selectedCourse.lessons.length - 1
                }
                hasPrevious={
                  selectedCourse.lessons.findIndex(
                    (l: any) => l.id === selectedVideo.id
                  ) > 0
                }
              />
            </div>

            {/* Course Content Tabs */}
            <div className="flex-1 bg-white">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-50 rounded-none border-b">
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
                  <TabsTrigger
                    value="comments"
                    className="flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Comments</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">
                      {selectedVideo.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 leading-relaxed">
                            In this lesson, you'll learn the fundamentals of{" "}
                            {selectedVideo.title.toLowerCase()}. This
                            comprehensive tutorial covers essential concepts,
                            practical examples, and best practices that will
                            help you master this important topic.
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
                      <div className="space-y-4">
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">Lesson Details</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Duration:</span>
                              <span>{selectedVideo.duration}</span>
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
                                  .map((n : any) => n[0])
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

                <TabsContent value="resources" className="p-6">
                  <LessonResources
                    courseId={selectedCourse.id}
                    lessonId={selectedVideo.id}
                  />
                </TabsContent>

                <TabsContent value="comments" className="p-6">
                  <VideoComments
                    courseId={selectedCourse.id}
                    lessonId={selectedVideo.id}
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
                {selectedCourse.lessons.map((lesson : any, index : number) => {
                  const isCompleted = courseProgress.completedLessons.includes(
                    lesson.id
                  );
                  const isCurrent = lesson.id === selectedVideo.id;

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
            </div>
          </div>

          <LessonCompletionCelebration
            show={showCelebration}
            lessonTitle={selectedVideo.title}
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
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
            <p className="text-gray-600">Continue your learning journey</p>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Course Cards - Udemy Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCourses.map((course) => {
              const courseProgress = getCourseProgress(course.id);
              return (
                <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white overflow-hidden">
                  <div className="relative">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-full h-36 object-cover"
                    />
                    {courseProgress.progressPercentage > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                        <div className="flex items-center justify-between text-white text-xs mb-1">
                          <span>{courseProgress.progressPercentage}% complete</span>
                          <span>{courseProgress.completedLessons.length}/{course.lessons.length} lessons</span>
                        </div>
                        <Progress value={courseProgress.progressPercentage} className="h-1 bg-gray-600" />
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-3">
                    <h3 className="font-bold text-sm text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem]">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-2">{course.instructor}</p>
                    
                    <div className="flex items-center mb-2 text-xs text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{course.studentsEnrolled.toLocaleString()} students</span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        {course.level}
                      </Badge>
                    </div>

                    <Button 
                      onClick={() => handleStartLearning(course.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {courseProgress.progressPercentage > 0 ? 'Continue' : 'Start'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCoursePageComponent;
