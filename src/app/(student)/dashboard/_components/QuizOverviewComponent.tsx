"use client";

import React, { useEffect, useState } from "react";

import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { QuizOverview } from "@/src/type/Dashboard";
import { studentTakeQuizAction } from "@/src/action/quizAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { getQuizOverviewForStudentAction } from "@/src/action/dashboardAction";
import CustomPaginationOnClick from "@/src/app/_components/CustomPaginationOnClick";

const QuizOverviewComponent = () => {
  const router = useRouter();
  const [quizOverview, setQuizOverview] = useState<QuizOverview[]>([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const loadQuizOverview = async () => {
    const quizOverviewRes = await getQuizOverviewForStudentAction(page, 4);
    if (quizOverviewRes.success) {
      setQuizOverview(quizOverviewRes.data?.items!);
      setMaxPage(quizOverviewRes.data?.pagination.totalPages!);
    } else {
      toast.error("Failed to fetch taken course for student");
    }
  };

  useEffect(() => {
    loadQuizOverview();
  }, [page]);

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Quiz Overview
          </CardTitle>
          {/* <Button variant="ghost" size="sm" asChild>
                      <Link href="/dashboard/quiz-history" className="flex items-center gap-1"> 
                        View All
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button> */}
        </CardHeader>
        <CardContent className="space-y-3">
          {quizOverview.map((quiz) => (
            <div
              key={quiz.quizId}
              className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex flex-col space-y-1">
                  <h4 className="font-semibold text-sm text-foreground leading-tight hover:underline cursor-pointer">
                    {quiz.quizName}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    {quiz.categoryName}
                  </p>
                </div>
                <Badge className="bg-green-500 text-white py-1 px-2">
                  Completed
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Best Score:</span>
                  <span
                    className={
                      quiz.bestScore >= quiz.maxScore / 2
                        ? "font-semibold text-green-600 dark:text-green-400"
                        : "font-semibold text-red-600 dark:text-red-400"
                    }
                  >
                    {quiz.bestScore}/{quiz.maxScore}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Attempts:</span>
                  <span>
                    {quiz.attempts}/{quiz.maxAttempts}
                  </span>
                </div>
                {/* {quiz.attempts > quiz.maxAttempts && ( */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2 bg-transparent"
                    onClick={async () => {
                      const takeQuizResponse = await studentTakeQuizAction(
                        quiz.quizId
                      );

                      if (takeQuizResponse.success) {
                        toast.success("Quiz started");
                        router.push(`/quiz/${takeQuizResponse.data?.id}`);
                      }
                    }}
                  >
                    Retake Quiz
                  </Button>
                {/* )} */}
              </div>
            </div>
          ))}

          {quizOverview.length > 0 && (
            <CustomPaginationOnClick
              currentPage={page}
              maxPage={maxPage}
              nextOnClick={() => {
                if (page < maxPage) {
                  setPage((p) => p + 1);
                }
              }}
              previousOnClick={() => {
                if (page > 1) {
                  setPage((p) => p - 1);
                }
              }}
            />
          )}

          {quizOverview.length == 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Trophy className="h-16 w-16 text-muted-foreground/40 mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Quizzes Taken Yet
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                You haven't taken any quizzes yet. Start taking quizzes to track
                your progress and see your scores here.
              </p>
              <Button asChild variant="default" className="mt-2">
                <Link href="/quiz">Browse Available Quizzes</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizOverviewComponent;
