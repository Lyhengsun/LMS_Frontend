import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, PlayCircle, BookOpen, Award, TrendingUp } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  duration: string;
  students: number;
  rating: number;
  level: string;
  category: string;
  image: string;
  lessons: number;
  progress: number;
  isNew: boolean;
  videoUrl?: string;
}

interface ExploreCourseProps {
  onCourseStart?: (course: Course) => void;
  onClose?: () => void;
}

const ExploreCourses = ({ onCourseStart, onClose }: ExploreCourseProps) => {
  const courses = [
    {
      id: 1,
      title: 'Network Security Fundamentals',
      instructor: 'Dr. Sarah Johnson',
      description: 'Learn the fundamentals of network security, including firewalls, VPNs, and intrusion detection systems.',
      duration: '8h 30m',
      students: 2450,
      rating: 4.8,
      level: 'Beginner',
      category: 'Network Security',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=225&fit=crop&q=80',
      lessons: 24,
      progress: 0,
      isNew: true,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: 2,
      title: 'Ethical Hacking & Penetration Testing',
      instructor: 'Michael Chen',
      description: 'Master ethical hacking techniques and penetration testing methodologies used by security professionals.',
      duration: '12h 15m',
      students: 1890,
      rating: 4.7,
      level: 'Advanced',
      category: 'Ethical Hacking',
      image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&h=225&fit=crop&q=80',
      lessons: 36,
      progress: 0,
      isNew: false,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      id: 3,
      title: 'Cryptography and Data Protection',
      instructor: 'Prof. Alex Rivera',
      description: 'Understand encryption algorithms, digital signatures, and data protection techniques.',
      duration: '6h 45m',
      students: 1650,
      rating: 4.9,
      level: 'Intermediate',
      category: 'Cryptography',
      image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&h=225&fit=crop&q=80',
      lessons: 18,
      progress: 0,
      isNew: false,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
      id: 4,
      title: 'Web Security',
      instructor: 'Dr. David Kumar',
      description: 'Learn web application security, including OWASP top 10 vulnerabilities and mitigation techniques.',
      duration: '9h 20m',
      students: 1543,
      rating: 4.6,
      level: 'Intermediate',
      category: 'Web Security',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=225&fit=crop&q=80',
      lessons: 28,
      progress: 0,
      isNew: true,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    },
    {
      id: 5,
      title: 'Incident Response',
      instructor: 'Prof. Lisa Wang',
      description: 'Master incident response procedures, forensics, and recovery strategies for cybersecurity incidents.',
      duration: '10h 30m',
      students: 967,
      rating: 4.5,
      level: 'Advanced',
      category: 'Incident Response',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=225&fit=crop&q=80',
      lessons: 32,
      progress: 0,
      isNew: false,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    },
    {
      id: 6,
      title: 'Cloud Security',
      instructor: 'Dr. James Miller',
      description: 'Learn cloud security best practices, AWS security, and cloud compliance frameworks.',
      duration: '11h 15m',
      students: 734,
      rating: 4.7,
      level: 'Advanced',
      category: 'Cloud Security',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop&q=80',
      lessons: 26,
      progress: 0,
      isNew: true,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Network Security': return 'bg-blue-100 text-blue-800';
      case 'Ethical Hacking': return 'bg-purple-100 text-purple-800';
      case 'Cryptography': return 'bg-indigo-100 text-indigo-800';
      case 'Web Security': return 'bg-orange-100 text-orange-800';
      case 'Incident Response': return 'bg-pink-100 text-pink-800';
      case 'Cloud Security': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartCourse = (course: Course) => {
    if (onCourseStart) {
      onCourseStart(course);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Explore Courses</h2>
          <p className="text-gray-600">Discover new cybersecurity skills</p>
        </div>
        <Button variant="outline" className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4" />
          <span>View All Courses</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="relative">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-40 object-cover rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"
                />
                <div className="absolute top-2 left-2 flex space-x-2">
                  <Badge className={getCategoryColor(course.category)}>
                    {course.category}
                  </Badge>
                  {course.isNew && (
                    <Badge className="bg-yellow-500 text-white">
                      New
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <PlayCircle className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getLevelColor(course.level)} variant="secondary">
                    {course.level}
                  </Badge>
                </div>
                <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </CardTitle>
                <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.lessons} lessons</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleStartCourse(course)}
                >
                  Start
                </Button>
                <Button variant="outline" size="sm" className="px-3">
                  <Award className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExploreCourses;
