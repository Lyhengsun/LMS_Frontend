import { useEffect, useState } from 'react';
import { Trophy, Star, Gift, X } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import confetti from 'canvas-confetti';

interface CourseCompletionConfettiProps {
  show: boolean;
  courseName: string;
  onClose: () => void;
  onContinue: () => void;
}

export const CourseCompletionConfetti = ({ 
  show, 
  courseName, 
  onClose, 
  onContinue 
}: CourseCompletionConfettiProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (show) {
      setShowAnimation(true);
      
      // Trigger multiple confetti animations
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        // Left side
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2
          }
        });

        // Right side  
        confetti({
          particleCount,
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2
          }
        });
      }, 250);

      // Cleanup
      return () => clearInterval(interval);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2 z-10 hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>
        
        <CardContent className="p-8 text-center relative">
          {/* Animated decorations */}
          <div className={`absolute inset-0 transition-opacity duration-1000 ${showAnimation ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-4 left-4 text-yellow-400 animate-bounce delay-100">
              <Star className="w-6 h-6" />
            </div>
            <div className="absolute top-8 right-6 text-purple-400 animate-bounce delay-300">
              <Gift className="w-5 h-5" />
            </div>
            <div className="absolute bottom-8 left-6 text-pink-400 animate-bounce delay-500">
              <Star className="w-4 h-4" />
            </div>
            <div className="absolute bottom-4 right-4 text-blue-400 animate-bounce delay-700">
              <Gift className="w-6 h-6" />
            </div>
          </div>

          {/* Main content */}
          <div className={`relative z-10 transition-all duration-1000 ${showAnimation ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="mb-6">
              <div className="relative">
                <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 drop-shadow-lg animate-bounce" />
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl scale-150"></div>
              </div>
            </div>

            <Badge className="bg-green-500 text-white mb-4 px-3 py-1 text-sm">
              🎉 Course Completed!
            </Badge>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Congratulations!
            </h2>
            
            <p className="text-gray-700 mb-6 leading-relaxed">
              You've successfully completed <span className="font-semibold text-purple-700">"{courseName}"</span>! 
              Your dedication to learning is truly inspiring.
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-white/60 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center justify-center space-x-2 text-purple-700">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-medium">Course Achievement Unlocked</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/40 rounded-lg p-2">
                  <div className="text-lg font-bold text-purple-600">100%</div>
                  <div className="text-xs text-gray-600">Completion</div>
                </div>
                <div className="bg-white/40 rounded-lg p-2">
                  <div className="text-lg font-bold text-green-600">✓</div>
                  <div className="text-xs text-gray-600">Certified</div>
                </div>
                <div className="bg-white/40 rounded-lg p-2">
                  <div className="text-lg font-bold text-blue-600">🏆</div>
                  <div className="text-xs text-gray-600">Achievement</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={onContinue}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3"
              >
                Continue Learning Journey
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onClose}
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};