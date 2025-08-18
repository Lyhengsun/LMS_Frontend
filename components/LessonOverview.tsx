
import { Clock, Users, BookOpen, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LessonOverviewProps {
  title: string;
  description?: string;
  duration: string;
}

export const LessonOverview = ({ title, description, duration }: LessonOverviewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        
        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>1,247 students</span>
          </div>
        </div>
      </div>

      <Card className="border border-blue-100 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Learning Tip</h3>
              <p className="text-blue-800 text-sm">
                Complete at least 90% of the video to automatically mark this lesson as finished! 
                Take notes and practice the examples shown to get the most out of this lesson.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Lesson Overview</h3>
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">
            {description || `In this lesson, we'll dive deep into ${title.toLowerCase()} and understand how it works behind the scenes. You'll learn about key concepts, best practices, and how to apply this knowledge in real-world scenarios.`}
          </p>
          
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">What you'll learn:</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Core concepts and fundamental principles</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Practical implementation techniques</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Best practices and common pitfalls to avoid</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <span>Real-world examples and use cases</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
