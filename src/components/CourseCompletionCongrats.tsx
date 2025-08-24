
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Trophy, Star, Medal, Sparkles, Crown, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CourseCompletionCongratsProps {
  courseName: string;
  instructor: string;
  onContinue: () => void;
}

export const CourseCompletionCongrats = ({ 
  courseName, 
  instructor, 
  onContinue 
}: CourseCompletionCongratsProps) => {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    // Check if this is the first time completing this course
    const completionKey = `course_completed_${courseName.replace(/\s+/g, '_').toLowerCase()}`;
    const hasCompletedBefore = localStorage.getItem(completionKey);
    
    if (!hasCompletedBefore) {
      setIsFirstTime(true);
      localStorage.setItem(completionKey, 'true');
      
      // Start animation after component mounts
      setTimeout(() => setShowAnimation(true), 300);
      
      // Enhanced confetti animation for first-time completion
      const duration = 4000;
      const animationEnd = Date.now() + duration;
      const defaults = { 
        startVelocity: 30, 
        spread: 360, 
        ticks: 60, 
        zIndex: 9999,
        colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      // Multi-burst confetti effect
      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Left side burst
        confetti(Object.assign({}, defaults, { 
          particleCount: particleCount * 0.6, 
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        
        // Right side burst
        confetti(Object.assign({}, defaults, { 
          particleCount: particleCount * 0.6, 
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
        
        // Center burst
        confetti(Object.assign({}, defaults, { 
          particleCount: particleCount * 0.4, 
          origin: { x: randomInRange(0.4, 0.6), y: Math.random() - 0.1 } 
        }));
      }, 250);

      // Additional celebration burst after 1 second
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF4500']
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [courseName]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-indigo-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-20 left-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl transition-all duration-1000 ${showAnimation ? 'animate-pulse scale-150' : 'scale-0'}`} />
        <div className={`absolute top-40 right-32 w-24 h-24 bg-purple-400/20 rounded-full blur-xl transition-all duration-1000 delay-300 ${showAnimation ? 'animate-pulse scale-150' : 'scale-0'}`} />
        <div className={`absolute bottom-32 left-32 w-40 h-40 bg-blue-400/20 rounded-full blur-xl transition-all duration-1000 delay-500 ${showAnimation ? 'animate-pulse scale-150' : 'scale-0'}`} />
        <div className={`absolute bottom-20 right-20 w-28 h-28 bg-green-400/20 rounded-full blur-xl transition-all duration-1000 delay-700 ${showAnimation ? 'animate-pulse scale-150' : 'scale-0'}`} />
      </div>

      <Card className={`max-w-lg w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 border-2 border-yellow-200 shadow-2xl transition-all duration-700 ${showAnimation ? 'animate-scale-in' : 'scale-95 opacity-0'}`}>
        <CardContent className="p-8 text-center space-y-6 relative overflow-hidden">
          {/* Floating decoration elements */}
          <div className="absolute top-4 left-4">
            <Star className={`w-6 h-6 text-yellow-500 transition-all duration-1000 delay-500 ${showAnimation ? 'animate-pulse' : 'opacity-0'}`} />
          </div>
          <div className="absolute top-4 right-4">
            <Sparkles className={`w-6 h-6 text-purple-500 transition-all duration-1000 delay-700 ${showAnimation ? 'animate-pulse' : 'opacity-0'}`} />
          </div>
          <div className="absolute bottom-4 left-4">
            <Zap className={`w-6 h-6 text-blue-500 transition-all duration-1000 delay-900 ${showAnimation ? 'animate-pulse' : 'opacity-0'}`} />
          </div>

          {/* Main Trophy Icon */}
          <div className="relative">
            <div className={`w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl transition-all duration-700 ${showAnimation ? 'animate-bounce' : 'scale-0'}`}>
              <Trophy className="w-12 h-12 text-white" />
            </div>
            {isFirstTime && showAnimation && (
              <>
                <Crown className="absolute -top-3 -right-3 w-8 h-8 text-yellow-500 animate-pulse" />
                <Medal className="absolute -bottom-3 -left-3 w-8 h-8 text-orange-500 animate-pulse" />
                <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-yellow-400/50 animate-ping" />
              </>
            )}
          </div>

          {/* Congratulations Text */}
          <div className={`space-y-3 transition-all duration-700 delay-300 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Medal className="w-7 h-7 text-yellow-600" />
              Congratulations!
            </h2>
            <p className="text-gray-700 text-lg">
              {isFirstTime ? "🎉 Amazing! You've successfully completed your first cyber security course!" : "🎊 Great job! You've completed another course!"}
            </p>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
              {courseName}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              by {instructor}
            </p>
          </div>

          {/* Enhanced Achievement Stats */}
          <div className={`bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 space-y-4 transition-all duration-700 delay-500 ${showAnimation ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Course Progress</span>
              <span className="font-bold text-green-600 text-lg">100% Complete! 🎯</span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div className={`bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 h-4 rounded-full transition-all duration-1000 delay-700 ${showAnimation ? 'w-full' : 'w-0'}`} />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
            
            {isFirstTime && (
              <div className="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  <span className="text-yellow-800 font-semibold text-sm">First Course Completed!</span>
                  <Sparkles className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Continue Button */}
          <Button 
            onClick={onContinue}
            className={`w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg ${showAnimation ? 'animate-pulse' : ''}`}
          >
            <Zap className="w-5 h-5 mr-2" />
            Continue Your Cyber Security Journey
            <Star className="w-5 h-5 ml-2" />
          </Button>

          <p className={`text-sm text-gray-500 transition-all duration-700 delay-700 ${showAnimation ? 'opacity-100' : 'opacity-0'}`}>
            {isFirstTime ? "🚀 You're now ready for advanced cyber security challenges!" : "🎯 Keep building your expertise!"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
