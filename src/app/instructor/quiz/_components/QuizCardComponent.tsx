"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Quiz } from "@/src/type/Quiz";
import { HelpCircle, Clock, Users, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const QuizCardComponent = ({ quiz }: { quiz: Quiz }) => {
  const router = useRouter();

  return (
    <div>
      <Link href={`/instructor/quiz/view-quiz/${quiz.id}`}>
        <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{quiz.quizName}</CardTitle>
                <p className="text-sm text-gray-600">
                  Description: {quiz.quizDescription}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <HelpCircle className="w-4 h-4" />
                  <span>{quiz.questionCount} questions</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{quiz.durationMinutes} minutes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{quiz.maxAttempts} max attempts</span>
                </div>
                {/* <div className="flex items-center space-x-1">
                <BarChart className="w-4 h-4" />
                <span>{quiz.averageScore}% avg</span>
              </div> */}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/instructor/quiz/view-quiz/${quiz.id}`);
                  }}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default QuizCardComponent;
