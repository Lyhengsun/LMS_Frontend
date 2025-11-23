"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Quiz } from "@/src/type/Quiz";
import { HelpCircle, Clock, Users, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { deleteQuizByIdForInstructorAction } from "@/src/action/quizAction";
import { toast } from "sonner";
import CustomYesNoPopUp from "@/src/app/_components/CustomYesNoPopUp";
import { Badge } from "@/components/ui/badge";

const QuizCardComponent = ({ quiz }: { quiz: Quiz }) => {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteQuiz = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteQuizByIdForInstructorAction(quiz.id);

      if (result.success) {
        toast.success(
          (result.message as string) || "Quiz deleted successfully"
        );
        router.refresh();
      } else {
        toast.error((result.message as string) || "Failed to delete quiz");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the quiz");
    } finally {
      setIsDeleting(false);
    }
  };

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
    <div>
      <Link href={`/instructor/quiz/view-quiz/${quiz.id}`}>
        <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-foreground line-clamp-1 text-ellipsis">
                    {quiz.quizName}
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-800 border-blue-200 mt-1"
                  >
                    {quiz.category.name}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${getLevelColor(quiz.level)} mt-1`}
                  >
                    {quiz.level}
                  </Badge>
                </div>
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
                    setDeleteDialogOpen(true);
                  }}
                  disabled={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      <CustomYesNoPopUp
        title="Delete Quiz"
        description={`Are you sure you want to delete "${quiz.quizName}"? This action cannot be undone.`}
        viewDialogOpenState={deleteDialogOpen}
        setViewDialogOpenState={setDeleteDialogOpen}
        onClickYes={handleDeleteQuiz}
        onClickNo={() => {}}
      />
    </div>
  );
};

export default QuizCardComponent;
