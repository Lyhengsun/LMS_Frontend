"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Star, CheckCircle, Sparkles, Medal } from "lucide-react";
import confetti from "canvas-confetti";

interface LessonCompletionCelebrationProps {
  lessonTitle: string;
  onContinue: () => void;
  show: boolean;
}

export const LessonCompletionCelebration = ({
  lessonTitle,
  onContinue,
  show,
}: LessonCompletionCelebrationProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (show) {
      setShowAnimation(true);

      // Confetti celebration
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = {
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 9999,
        colors: [
          "#FFD700",
          "#FF6B6B",
          "#4ECDC4",
          "#45B7D1",
          "#96CEB4",
          "#FFEAA7",
        ],
      };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti(
          Object.assign({}, defaults, {
            particleCount: particleCount * 0.5,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          })
        );

        confetti(
          Object.assign({}, defaults, {
            particleCount: particleCount * 0.5,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          })
        );
      }, 250);

      return () => clearInterval(interval);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        className={`max-w-md w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 border-2 border-yellow-200 shadow-2xl transition-all duration-700 ${
          showAnimation ? "animate-scale-in" : "scale-95 opacity-0"
        }`}
      >
        <CardContent className="p-8 text-center space-y-6">
          {/* Trophy Icon */}
          <div className="relative">
            <div
              className={`w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-xl transition-all duration-700 ${
                showAnimation ? "animate-bounce" : "scale-0"
              }`}
            >
              <Trophy className="w-10 h-10 text-white" />
            </div>
            {showAnimation && (
              <>
                <Star className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
                <Medal className="absolute -bottom-2 -left-2 w-6 h-6 text-orange-500 animate-pulse" />
              </>
            )}
          </div>

          {/* Completion Text */}
          <div
            className={`space-y-3 transition-all duration-700 delay-300 ${
              showAnimation
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Lesson Complete!
            </h2>
            <p className="text-gray-700">
              🎉 Great job! You've successfully completed:
            </p>
            <h3 className="text-lg font-bold text-gray-900">{lessonTitle}</h3>
          </div>

          {/* Progress Indicator */}
          <div
            className={`bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border border-blue-200 rounded-xl p-4 transition-all duration-700 delay-500 ${
              showAnimation
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-600">
                Lesson Progress Updated!
              </span>
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={onContinue}
            className={`w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 ${
              showAnimation ? "animate-pulse" : ""
            }`}
          >
            <Star className="w-5 h-5 mr-2" />
            Continue Learning
            <Trophy className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
