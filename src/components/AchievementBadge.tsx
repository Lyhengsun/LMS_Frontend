
import { Trophy, Star, Award } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface AchievementBadgeProps {
  title: string;
  description: string;
  type: 'trophy' | 'star' | 'award';
}

export const AchievementBadge = ({ title, description, type }: AchievementBadgeProps) => {
  const icons = {
    trophy: <Trophy className="w-5 h-5 text-yellow-600" />,
    star: <Star className="w-5 h-5 text-purple-600" />,
    award: <Award className="w-5 h-5 text-green-600" />
  };

  const backgrounds = {
    trophy: 'bg-yellow-100',
    star: 'bg-purple-100',
    award: 'bg-green-100'
  };

  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', backgrounds[type])}>
        {icons[type]}
      </div>
      <div>
        <h4 className="font-medium text-gray-900 text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
};
