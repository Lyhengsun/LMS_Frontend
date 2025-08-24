
import { Calendar } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface DeadlineItemProps {
  title: string;
  course: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

export const DeadlineItem = ({ title, course, date, priority }: DeadlineItemProps) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-blue-100 text-blue-700', 
    low: 'bg-gray-100 text-gray-700'
  };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{course}</p>
        <div className="flex items-center space-x-1 mt-2 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{date}</span>
        </div>
      </div>
      <span className={cn('px-2 py-1 rounded-full text-xs font-medium', priorityColors[priority])}>
        {priority}
      </span>
    </div>
  );
};
