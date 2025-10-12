"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Quiz } from "@/src/type/Quiz";
import { HelpCircle, Clock, Users, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const StudentQuizCardComponent = ({
  quiz,
  handleOnViewResult,
  handleOnTakeQuiz,
}: {
  quiz: Quiz;
  handleOnViewResult: (quizId: number) => void;
  handleOnTakeQuiz: (quizId: number) => void;
}) => {
  const router = useRouter();

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card key={quiz.id} className="p-6 w-full">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-semibold text-foreground">
              {quiz.quizName}
            </h3>
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 border-blue-200"
            >
              {quiz.category.name}
            </Badge>
            <Badge variant="outline" className={getLevelColor(quiz.level)}>
              {quiz.level}
            </Badge>
          </div>
          <p className="text-muted-foreground mb-4">{quiz.quizDescription}</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              <span>{quiz.questionCount} questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{quiz.durationMinutes} minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>
                {quiz.attemptCount}/{quiz.maxAttempts} attempts used
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {quiz.attemptCount > 0 && (
            <Button
              variant="outline"
              onClick={() => handleOnViewResult(quiz.id)}
            >
              View Results
            </Button>
          )}
          {quiz.attemptCount < quiz.maxAttempts ? (
            <Button onClick={() => handleOnTakeQuiz(quiz.id)}>
              {quiz.attemptCount > 0 ? "Retake Quiz" : "Take Quiz"}
            </Button>
          ) : (
            <Button disabled>No Attempts Left</Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StudentQuizCardComponent;
