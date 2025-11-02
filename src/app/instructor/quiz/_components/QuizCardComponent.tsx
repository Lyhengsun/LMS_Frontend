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
