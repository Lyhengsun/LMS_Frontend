
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Clock, 
  Users, 
  CheckCircle,
  BookOpen
} from 'lucide-react';
import { useCourseProgressStore } from '@/src/components/CourseProgress';

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  level: string;
  students: number;
  nextLesson: string;
  image: string;
  videoUrl: string;
  category: string;
}

interface ModernCourseCardProps {
  course: Course;
  onStartLearning: (course: Course) => void;
}

export const ModernCourseCard = ({ course, onStartLearning }: ModernCourseCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { getCourseProgress } = useCourseProgressStore();
  
  const courseProgress = getCourseProgress(course.id);
  const hasStarted = courseProgress.hasStarted;
  const isCompleted = courseProgress.isCompleted;
  const actualProgress = courseProgress.progressPercentage;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCyberSecurityImage = (category: string) => {
    const images = {
      'Network Security': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop&q=80',
      'Ethical Hacking': 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=225&fit=crop&q=80',
      'Cryptography': 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=225&fit=crop&q=80',
      'Incident Response': 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop&q=80',
      'Cloud Security': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop&q=80',
      'Web Security': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop&q=80',
      'General': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=225&fit=crop&q=80'
    };
    return images[category as keyof typeof images] || images.General;
  };

  const getActionButton = () => {
    if (isCompleted) {
      return (
        <Button 
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold transition-all duration-200 hover:scale-105"
          onClick={() => onStartLearning(course)}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Completed
        </Button>
      );
    } else {
      return (
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 hover:scale-105"
          onClick={() => onStartLearning(course)}
        >
          <Play className="w-4 h-4 mr-2" />
          Start
        </Button>
      );
    }
  };

  return (
    <Card 
      className="group hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 hover:border-blue-200 bg-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        {/* Course Image */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={getCyberSecurityImage(course.category)} 
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-4 left-4 right-4">
            <Badge className={`${getLevelColor(course.level)} font-medium mb-2`}>
              {course.level}
            </Badge>
            <Badge variant="secondary" className="bg-black/50 text-white border-white/20 mb-2 ml-2">
              {course.category}
            </Badge>
            
            {isCompleted && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-500 text-white border-green-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Course Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">by {course.instructor}</p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Progress</span>
                <span className="font-semibold">{actualProgress}%</span>
              </div>
              <div className="relative w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${actualProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>{course.totalLessons} lessons</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-green-500" />
                <span>{course.duration}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-purple-500" />
              <span>{course.students.toLocaleString()}</span>
            </div>
          </div>

          {/* Action Button */}
          {getActionButton()}
        </div>
      </CardContent>
    </Card>
  );
};
