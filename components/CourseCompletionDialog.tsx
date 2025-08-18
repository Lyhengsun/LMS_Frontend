
import { useEffect } from 'react';
import { CheckCircle, Star, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CourseCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseName: string;
  instructor: string;
  completionTime: string;
  onContinueLearning?: () => void;
}

export const CourseCompletionDialog = ({
  open,
  onOpenChange,
  courseName,
  instructor,
  completionTime,
  onContinueLearning
}: CourseCompletionDialogProps) => {
  
  useEffect(() => {
    if (open) {
      // Trigger confetti animation when dialog opens
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Left side confetti
        confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        }));

        // Right side confetti
        confetti(Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        }));
      }, 250);

      // Cleanup interval on unmount
      return () => clearInterval(interval);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm sm:max-w-md max-h-[90vh] overflow-y-auto text-center animate-scale-in">
        <DialogHeader>
          <div className="mx-auto mb-3">
            <div className="relative animate-bounce">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Trophy className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 animate-ping">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            🎉 Congratulations! 🎉
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="animate-fade-in">
            <p className="text-gray-600 mb-2 text-sm sm:text-base">You've successfully completed</p>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{courseName}</h3>
            <p className="text-sm text-gray-600">by {instructor}</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg p-4 border-2 border-gradient-to-r from-blue-200 to-purple-200 animate-fade-in">
            <div className="flex items-center justify-center space-x-3 text-sm mb-2">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500 animate-spin" />
                <span className="font-semibold">Course Completed!</span>
              </div>
            </div>
            <p className="text-xs text-gray-600">Completed in {completionTime}</p>
            <div className="mt-2 flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className="w-3 h-3 text-yellow-400 fill-current animate-pulse" 
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>

          <div className="text-left bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border animate-fade-in">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center text-sm">
              <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
              What's Next?
            </h4>
            <ul className="text-xs text-gray-700 space-y-1.5">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Explore more courses in your field
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Join discussions with fellow learners
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></span>
                Check your progress on the leaderboard
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                Get personalized help from our AI Assistant
              </li>
            </ul>
          </div>

          <Button 
            onClick={onContinueLearning}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg transform hover:scale-105 transition-all duration-200 shadow-lg text-sm"
          >
            Continue Your Learning Journey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
