import { useState, useEffect } from 'react';
import { ArrowLeft, Play, CheckCircle, Clock, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { UdemyVideoPlayer } from '@/components/UdemyVideoPlayer';
import { LessonTabs } from '@/components/LessonTabs';
import { LessonCompletionCelebration } from '@/components/LessonCompletionCelebration';
import { useCourseProgressStore } from '@/components/CourseProgress';
import { useVideoProgress } from '@/hooks/useVideoProgress';
import { CourseCompletionCongrats } from '@/components/CourseCompletionCongrats';

interface CourseLessonViewProps {
  course: {
    id: number;
    title: string;
    instructor: string;
    videoUrl: string;
  };
  onClose: () => void;
}

export const CourseLessonView = ({ course, onClose }: CourseLessonViewProps) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showLessonCelebration, setShowLessonCelebration] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const { getCourseProgress, startCourse, completeLesson, unCompleteLesson } = useCourseProgressStore();

  const lessons = [
    { 
      id: 1, 
      title: 'Introduction to Cybersecurity', 
      duration: '8:30',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'Learn the fundamental concepts of cybersecurity and why it\'s crucial in today\'s digital world.'
    },
    { 
      id: 2, 
      title: 'Common Security Threats', 
      duration: '12:45',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      description: 'Explore the most common cybersecurity threats and how they impact organizations and individuals.'
    },
    { 
      id: 3, 
      title: 'Security Best Practices', 
      duration: '15:20',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      description: 'Discover essential security practices to protect systems and data from cyber attacks.'
    },
    { 
      id: 4, 
      title: 'Network Security Fundamentals', 
      duration: '18:15',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      description: 'Understand the basics of network security and how to secure network infrastructure.'
    },
    { 
      id: 5, 
      title: 'Advanced Security Concepts', 
      duration: '22:10',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      description: 'Dive deep into advanced cybersecurity concepts and emerging security technologies.'
    }
  ];

  const resources = [
    {
      id: 1,
      name: 'Cybersecurity Fundamentals Guide',
      type: 'PDF',
      size: '2.3 MB',
      description: 'Comprehensive guide covering cybersecurity basics and best practices',
      downloadUrl: '#',
      pdfUrl: 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKEN5YmVyc2VjdXJpdHkgRnVuZGFtZW50YWxzKQovQ3JlYXRvciAoQ3liZXIgU2VjdXJpdHkgVGVhbSkKL1Byb2R1Y2VyIChMZWFybmluZyBNYW5hZ2VtZW50IFN5c3RlbSkKL0NyZWF0aW9uRGF0ZSAoRDoyMDI0MDEwMTAwMDAwMCkKPj4KZW5kb2JqCgoyIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAzIDAgUgo+PgplbmRvYmoKCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKPJ4KZW5kb2JqCgo0IDAgb2JqCjw8Ci9UeXBlIC9QYWdlCi9QYXJlbnQgMyAwIFIKL01lZGlhQm94IFswIDAgNjEyIDc5Ml0KL0NvbnRlbnRzIDUgMCBSCj4+CmVuZG9iagoKNSAwIG9iago8PAovTGVuZ3RoIDUyCj4+CnN0cmVhbQpCVAovRjEgMTIgVGYKMTAwIDcwMCBUZAooQ3liZXJzZWN1cml0eSBGdW5kYW1lbnRhbHMpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKCnhyZWYKMCA2CjAwMDAwMDAwMDAwIDAwMDAwIG4KMDAwMDAwMDAxMCAwMDAwMCBuCjAwMDAwMDAxODMgMDAwMDAgbgowMDAwMDAwMjMyIDAwMDAwIG4KMDAwMDAwMDI4OSAwMDAwMCBuCjAwMDAwMDAzOTAgMDAwMDAgbgp0cmFpbGVyCjw8Ci9TaXplIDYKL1Jvb3QgMiAwIFIKPj4Kc3RhcnR4cmVmCjQ4NgolJUVPRgo='
    },
    {
      id: 2,
      name: 'Network Security Toolkit',
      type: 'PDF',
      size: '1.8 MB',
      description: 'Essential tools and techniques for network security professionals',
      downloadUrl: '#',
      pdfUrl: 'data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKE5ldHdvcmsgU2VjdXJpdHkgVG9vbGtpdCkKL0NyZWF0b3IgKEN5YmVyIFNlY3VyaXR5IFRlYW0pCi9Qcm9kdWNlciAoRXRoaWNhbCBIYWNraW5nIERvY3VtZW50YXRpb24pCi9DcmVhdGlvbkRhdGUgKEQ6MjAyNDAxMDEwMDAwMDApCj4+CmVuZG9iagoKMiAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMyAwIFIKPj4KZW5kb2JqCgozIDAgb2JqCjw8Ci9UeXBlIC9QYWdlcwovS2lkcyBbNCAwIFJdCi9Db3VudCAxCj4+CmVuZG9iagoKNCAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjUgMCBvYmoKPDwKL0xlbmd0aCA0OAo+PgpzdHJlYW0KQVQKL0YxIDEyIFRmCjEwMCA3MDAgVGQKKE5ldHdvcmsgU2VjdXJpdHkgVG9vbGtpdCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCAwMDAwMCBuCjAwMDAwMDAwMTAgMDAwMDAgbgowMDAwMDAwMTgzIDAwMDAwIG4KMDAwMDAwMDIzMiAwMDAwMCBuCjAwMDAwMDAyODkgMDAwMDAgbgowMDAwMDAwMzkwIDAwMDAwIG4KdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDIgMCBSCj4+CnN0YXJ0eHJlZgo0ODYKKSVFT0YK'
    }
  ];

  const courseProgress = getCourseProgress(course.id);
  const currentLesson = lessons[currentLessonIndex];
  const isLessonCompleted = courseProgress.completedLessons.includes(currentLesson.id);
  
  const videoProgress = useVideoProgress(course.id, currentLesson.id);

  useEffect(() => {
    startCourse(course.id, lessons.length);
  }, [course.id, lessons.length]);

  useEffect(() => {
    if (courseProgress.isCompleted && !showCongrats) {
      setShowCongrats(true);
    }
  }, [courseProgress.isCompleted]);

  useEffect(() => {
    const handleLessonCompleted = (event: CustomEvent) => {
      if (event.detail.courseId === course.id && event.detail.lessonId === currentLesson.id) {
        setShowLessonCelebration(true);
      }
    };

    window.addEventListener('lessonCompleted', handleLessonCompleted as EventListener);
    return () => window.removeEventListener('lessonCompleted', handleLessonCompleted as EventListener);
  }, [course.id, currentLesson.id]);

  const handleLessonComplete = () => {
    completeLesson(course.id, currentLesson.id);
  };

  const handleLessonUncomplete = () => {
    unCompleteLesson(course.id, currentLesson.id);
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleLessonSelect = (index: number) => {
    setCurrentLessonIndex(index);
  };

  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
  };

  if (showCongrats) {
    return (
      <CourseCompletionCongrats
        courseName={course.title}
        instructor={course.instructor}
        onContinue={() => {
          setShowCongrats(false);
          onClose();
        }}
      />
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="flex items-center space-x-2 hover:bg-blue-50 hover:text-blue-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Courses</span>
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-sm text-gray-600">by {course.instructor}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Progress: {courseProgress.progressPercentage}%
              </div>
              <div className="w-32">
                <Progress value={courseProgress.progressPercentage} className="h-2" />
              </div>
              <Badge variant={courseProgress.isCompleted ? "default" : "secondary"}>
                {courseProgress.isCompleted ? "100% Complete" : `${courseProgress.progressPercentage}% Complete`}
              </Badge>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Main Content */}
          <div className="flex-1">
            {/* Video Player Section */}
            <div className="bg-black relative">
              {showVideoPlayer ? (
                <UdemyVideoPlayer
                  videoUrl={currentLesson.videoUrl}
                  title={currentLesson.title}
                  onClose={handleCloseVideoPlayer}
                  onVideoProgress={(currentTime, duration) => {
                    videoProgress.updateProgress(currentTime, duration);
                  }}
                />
              ) : (
                <div className="aspect-video bg-black flex items-center justify-center relative group">
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:bg-opacity-30"
                    onClick={() => setShowVideoPlayer(true)}
                  >
                    <div className="bg-white bg-opacity-20 rounded-full p-8 hover:bg-opacity-30 transition-all duration-300 hover:scale-110">
                      <Play className="w-20 h-20 text-white" />
                    </div>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=450&fit=crop&q=80" 
                    alt={currentLesson.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Progress indicator */}
                  {videoProgress.progressPercentage > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-75 p-2">
                      <div className="flex items-center justify-between text-white text-sm mb-1">
                        <span>Progress: {videoProgress.progressPercentage}%</span>
                        <span>Resume from {Math.floor(videoProgress.lastPosition / 60)}:{Math.floor(videoProgress.lastPosition % 60).toString().padStart(2, '0')}</span>
                      </div>
                      <Progress value={videoProgress.progressPercentage} className="h-1" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Lesson Info and Controls */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{currentLesson.title}</h2>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{currentLesson.duration}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      Lesson {currentLessonIndex + 1} of {lessons.length}
                    </span>
                    <Badge variant={isLessonCompleted ? "default" : "secondary"}>
                      {isLessonCompleted ? "Completed" : "In Progress"}
                    </Badge>
                    {videoProgress.progressPercentage > 0 && (
                      <div className="text-sm text-gray-600">
                        {videoProgress.progressPercentage}% watched
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => setShowVideoPlayer(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Watch Video
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={isLessonCompleted ? handleLessonUncomplete : handleLessonComplete}
                    className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
                  >
                    {isLessonCompleted ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Mark Undone
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Complete
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousLesson}
                  disabled={currentLessonIndex === 0}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Button>
                
                <Button
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === lessons.length - 1}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                >
                  <span>Next Lesson</span>
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tabbed Content Section */}
            <div className="p-6">
              <LessonTabs
                courseId={course.id}
                lessonId={currentLesson.id}
                lessonTitle={currentLesson.title}
                lessonDescription={currentLesson.description}
                duration={currentLesson.duration}
                resources={resources}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
              <div className="space-y-2">
                {lessons.map((lesson, index) => {
                  const isCompleted = courseProgress.completedLessons.includes(lesson.id);
                  const isCurrent = index === currentLessonIndex;
                  
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonSelect(index)}
                      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        isCurrent
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isCompleted
                            ? 'bg-green-100 text-green-700'
                            : isCurrent
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            isCurrent ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-600">{lesson.duration}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Completion Celebration */}
      <LessonCompletionCelebration
        lessonTitle={currentLesson.title}
        show={showLessonCelebration}
        onContinue={() => setShowLessonCelebration(false)}
      />
    </>
  );
};
