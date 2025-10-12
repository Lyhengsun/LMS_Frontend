"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { QuizDetails, TakeQuiz } from "@/src/type/Quiz";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { studentDeleteTakeQuizByIdAction, studentSubmitQuizAction } from "@/src/action/quizAction";

// Mock data for demonstration
const mockQuizData: QuizDetails = {
  id: 1,
  quizName: "JavaScript Fundamentals Quiz",
  quizDescription: "Test your knowledge of JavaScript basics",
  quizInstruction:
    "Choose the best answer for each question. You can change your answers before submitting.",
  level: "Intermediate",
  durationMinutes: 30,
  maxAttempts: 3,
  passingScore: 70,
  createdAt: "2024-01-15T10:00:00Z",
  editedAt: "2024-01-15T10:00:00Z",
  author: {
    id: "1",
    fullName: "Dr. Smith",
    email: "smith@example.com",
    role: "ROLE_STUDENT",
    isVerified: true,
    isDisabled: false,
    isApproved: true,
    createdAt: "2025-09-26 20:59:50.017000",
    editedAt: "2025-09-26 20:59:50.017000",
  },
  category: {
    id: 1,
    name: "Programming",
    createdAt: "2025-09-26 20:59:50.017000",
    editedAt: "2025-09-26 20:59:50.017000",
  },
  questions: [
    {
      id: 1,
      content: "What is the correct way to declare a variable in JavaScript?",
      questionType: "MULTIPLE_CHOICE",
      score: 10,
      createdAt: "2024-01-15T10:00:00Z",
      editedAt: "2024-01-15T10:00:00Z",
      answers: [
        {
          id: 1,
          content: "variable x = 5;",
          isCorrect: false,
          createdAt: "2024-01-15T10:00:00Z",
          editedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: 2,
          content: "let x = 5;",
          isCorrect: true,
          createdAt: "2024-01-15T10:00:00Z",
          editedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: 3,
          content: "x := 5;",
          isCorrect: false,
          createdAt: "2024-01-15T10:00:00Z",
          editedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: 4,
          content: "declare x = 5;",
          isCorrect: false,
          createdAt: "2024-01-15T10:00:00Z",
          editedAt: "2024-01-15T10:00:00Z",
        },
      ],
    },
    {
      id: 2,
      content: "JavaScript is a statically typed language.",
      questionType: "TRUE_FALSE",
      trueFalseAnswer: false,
      score: 5,
      createdAt: "2024-01-15T10:00:00Z",
      editedAt: "2024-01-15T10:00:00Z",
      answers: [
        {
          id: 5,
          content: "True",
          isCorrect: false,
          createdAt: "2024-01-15T10:00:00Z",
          editedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: 6,
          content: "False",
          isCorrect: true,
          createdAt: "2024-01-15T10:00:00Z",
          editedAt: "2024-01-15T10:00:00Z",
        },
      ],
    },
    {
      id: 3,
      content:
        "Which of the following is used to add an element to the end of an array?",
      questionType: "MULTIPLE_CHOICE",
      score: 10,
      createdAt: "2024-01-15T10:00:00Z",
      editedAt: "2024-01-15T10:00:00Z",
      answers: [
        {
          id: 7,
          content: "array.add()",
          isCorrect: false,
          createdAt: "2024-01-15T10:00:00Z",
          editedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: 8,
          content: "array.append()",
          isCorrect: false,
          createdAt: "2024-01-15T10:00:00Z",
          editedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: 9,
          content: "array.push()",
          isCorrect: true,
          createdAt: "2024-01-15T10:00:00Z",
          editedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: 10,
          content: "array.insert()",
          isCorrect: false,
          createdAt: "2024-01-15T10:00:00Z",
          editedAt: "2024-01-15T10:00:00Z",
        },
      ],
    },
    {
      id: 4,
      content: "The === operator checks for both value and type equality.",
      questionType: "TRUE_FALSE",
      trueFalseAnswer: true,
      score: 5,
      createdAt: "2024-01-15T10:00:00Z",
      editedAt: "2024-01-15T10:00:00Z",
      answers: [
        {
          id: 11,
          content: "True",
          isCorrect: true,
          createdAt: "2024-01-15T10:00:00Z",
          editedAt: "2024-01-15T10:00:00Z",
        },
        {
          id: 12,
          content: "False",
          isCorrect: false,
          createdAt: "2024-01-15T10:00:00Z",
          editedAt: "2024-01-15T10:00:00Z",
        },
      ],
    },
  ],
};

export default function TakeQuizPageComponent({
  takeQuiz,
  quizDetail,
}: {
  takeQuiz: TakeQuiz;
  quizDetail: QuizDetails;
}) {
  const router = useRouter();
  const [quiz] = useState<QuizDetails>(quizDetail);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(quiz.durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showAbandonDialog, setShowAbandonDialog] = useState(false);

  const handleContinueQuiz = async () => {
    setShowAbandonDialog(false);
  };

  const handleAbandonQuiz = async () => {
    await studentDeleteTakeQuizByIdAction(takeQuiz.id);
    router.push("/quiz");
    toast.info("The Quiz has been abandoned");
  };

  const handleBackClick = () => {
    if (!isSubmitted) {
      setShowAbandonDialog(true);
    } else {
      router.push("/quiz");
    }
  };

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleAnswerSelect = (answerId: number, questionId: number) => {
    const question = quiz.questions.find((q) => q.id === questionId);
    if (!question) return;

    setSelectedAnswers((prev) => {
      // Get all answer IDs for this question
      const questionAnswerIds = question.answers?.map((a) => a.id) || [];

      // Remove any existing answers for this question
      const filteredAnswers = prev.filter(
        (id) => !questionAnswerIds.includes(id)
      );

      // Add the new answer (no duplicates possible since we filtered)
      return [...filteredAnswers, answerId];
    });
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    // Here you would typically send the selectedAnswers array to your backend
    console.log("[v0] Submitted answers:", selectedAnswers);
    await studentSubmitQuizAction(takeQuiz.id, selectedAnswers);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const answeredCount = quiz.questions.filter((q) => {
    const questionAnswerIds = q.answers?.map((a) => a.id) || [];
    return questionAnswerIds.some((id) => selectedAnswers.includes(id));
  }).length;

  const progress = (answeredCount / quiz.questions.length) * 100;

  console.log("isSubmitted : ", isSubmitted)

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="border-b bg-card px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              onClick={handleBackClick}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Quiz Page
            </div>
            <div className="h-4 w-px bg-border" />
            <h2 className="text-lg font-semibold">{quiz.quizName}</h2>
          </div>

          <div className="flex space-x-4 items-center">
            <Progress
              value={progress}
              className="h-2 w-[25dvw] bg-blue-200 [&>[data-slot=progress-indicator]]:bg-blue-600"
            />
            <span className="text-2xl font-bold">{Math.round(progress)}%</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span
                className={
                  timeRemaining < 300
                    ? "text-destructive font-semibold"
                    : "text-foreground"
                }
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
            <Badge variant="outline">{quiz.level}</Badge>
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <div className="p-8 max-w-5xl mx-auto">
        {/* Progress Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Quiz Progress</h3>
              <p className="text-sm text-muted-foreground">
                {answeredCount} of {quiz.questions.length} questions answered
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-blue-200 [&>[data-slot=progress-indicator]]:bg-blue-600"
          />
        </Card>

        {/* Instructions */}
        {!isSubmitted && (
          <Card className="p-6 mb-6 bg-muted/50">
            <h3 className="font-semibold mb-2">Instructions</h3>
            <p className="text-sm text-muted-foreground">
              {quiz.quizInstruction}
            </p>
          </Card>
        )}

        {/* Questions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Quiz - All Questions</h2>

          {quiz.questions.map((question, index) => {
            const questionAnswerIds = question.answers?.map((a) => a.id) || [];
            const selectedAnswerId = selectedAnswers.find((id) =>
              questionAnswerIds.includes(id)
            );

            return (
              <Card key={question.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg">
                    {index + 1}. {question.content}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="bg-blue-600 font-semibold p-2"
                  >
                    {question.score} points
                  </Badge>
                </div>

                <div className="space-y-2">
                  {question.answers?.map((answer) => {
                    const isSelected = selectedAnswerId === answer.id;

                    return (
                      <button
                        key={answer.id}
                        onClick={() =>
                          !isSubmitted &&
                          handleAnswerSelect(answer.id, question.id)
                        }
                        disabled={isSubmitted}
                        className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-background hover:border-primary/50 hover:bg-accent"
                        } ${
                          isSubmitted
                            ? "cursor-not-allowed opacity-60"
                            : "cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-muted-foreground"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                            )}
                          </div>
                          <span>{answer.content}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {question.questionType === "TRUE_FALSE" && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Select True or False
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        {/* Submit Button */}
        {!isSubmitted && (
          <div className="mt-8 flex justify-end gap-4">
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={answeredCount !== quiz.questions.length}
            >
              Submit Quiz
            </Button>
          </div>
        )}

        {/* Submitted Message */}
        {isSubmitted && (
          <Card className="p-6 mt-8 bg-primary/10 border-primary">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">
                    Quiz Submitted Successfully!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your answers have been recorded. You can view your results
                    once the instructor grades your submission.
                  </p>
                </div>
              </div>
              <Button className="cursor-pointer" onClick={
                () => {
                  router.push("/quiz")
                }
              }>Back to Quiz</Button>
            </div>
          </Card>
        )}
      </div>
      <Dialog open={showAbandonDialog} onOpenChange={setShowAbandonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Abandon Quiz?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to leave this quiz? Your progress will not
              be saved.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleContinueQuiz}
              className="cursor-pointer"
            >
              Continue Quiz
            </Button>
            <Button
              variant="destructive"
              onClick={handleAbandonQuiz}
              className="cursor-pointer"
            >
              Abandon Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// const LeaveQuizPageDialog = ()
