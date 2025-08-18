
import { useState } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ExploreCourses from '@/components/ExploreCourses';
import { CourseLessonView } from '@/components/CourseLessonView';

interface CourseSearchProps {
  onCourseSelect: (course: any) => void;
  onClose: () => void;
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  videoUrl: string;
}

export const CourseSearch = ({ onCourseSelect, onClose }: CourseSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleCourseStart = (course: any) => {
    const courseData = {
      id: course.id,
      title: course.title,
      instructor: course.instructor,
      videoUrl: course.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    };
    setSelectedCourse(courseData);
  };

  const handleCloseCourse = () => {
    setSelectedCourse(null);
  };

  if (selectedCourse) {
    return (
      <CourseLessonView
        course={selectedCourse}
        onClose={handleCloseCourse}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center space-x-2 hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to My Courses</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Explore Courses</h1>
              <p className="text-gray-600">Discover new cybersecurity skills</p>
            </div>
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search courses, instructors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="network">Network Security</SelectItem>
              <SelectItem value="ethical">Ethical Hacking</SelectItem>
              <SelectItem value="crypto">Cryptography</SelectItem>
              <SelectItem value="web">Web Security</SelectItem>
              <SelectItem value="incident">Incident Response</SelectItem>
              <SelectItem value="cloud">Cloud Security</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">Sort by</span>
        </div>
      </div>

      {/* Course Grid */}
      <main className="p-8">
        <ExploreCourses onCourseStart={handleCourseStart} />
      </main>
    </div>
  );
};
