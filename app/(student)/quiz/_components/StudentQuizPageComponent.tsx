"use client";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/lib/hooks/use-toast";
import { useQuizStore } from "@/lib/hooks/useQuizStore";
import {
  Brain,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  FileText,
  Play,
  Search,
  Target,
  Trophy,
  X,
} from "lucide-react";
import React, { useState } from "react";

const StudentQuizPageComponent = () => {
  const {
    quizzes,
    getStudentQuizAttempt,
    startQuizAttempt,
    submitQuizAttempt,
  } = useQuizStore();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleCloseResults = () => {
    setShowResults(false);
    setActiveQuiz(null);
    setAnswers({});
    setQuizResults(null);
  };

  const getQuizStatus = (quiz: any) => {
    const attempt = getStudentQuizAttempt("kong-keat", quiz.id);
    if (attempt?.status === "completed") {
      return (
        <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
          Completed
        </Badge>
      );
    }
    if (attempt?.status === "in-progress") {
      return (
        <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50">
          In Progress
        </Badge>
      );
    }
    return (
      <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50">
        Available
      </Badge>
    );
  };

  const handleStartQuiz = (quiz: any) => {
    const attempt = startQuizAttempt("kong-keat", "Kong KEAT", quiz.id);
    setActiveQuiz({ ...quiz, attemptId: attempt.id });
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setQuizResults(null);
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Quiz Results Dialog
  const QuizResultsDialog = () => (
    <Dialog open={showResults} onOpenChange={setShowResults}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Trophy
              className="w-6 h-6 mr-2"
              style={{ color: "hsl(var(--student-primary))" }}
            />
            Quiz Results: {activeQuiz?.title}
          </DialogTitle>
        </DialogHeader>

        {quizResults && (
          <div className="space-y-6">
            {/* Overall Score */}
            <div
              className={`p-6 rounded-xl border-2 ${
                quizResults.passed
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-4xl font-bold mb-2 ${
                    quizResults.passed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {quizResults.score}/{quizResults.totalPoints}
                </div>
                <div
                  className={`text-2xl font-semibold mb-4 ${
                    quizResults.passed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {quizResults.percentage}%
                </div>
                <div className="text-lg text-gray-700">
                  {quizResults.correctAnswers} out of{" "}
                  {quizResults.totalQuestions} questions correct
                </div>
                <div
                  className={`text-xl font-semibold mt-2 ${
                    quizResults.passed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {quizResults.passed ? "🎉 Passed!" : "❌ Not Passed"}
                </div>
              </div>
            </div>

            {/* Question by Question Results */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Question Review</h3>
              <div className="space-y-4">
                {quizResults.questionResults.map(
                  (result: any, index: number) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        result.isCorrect
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            result.isCorrect ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {result.isCorrect ? (
                            <Check className="w-4 h-4 text-white" />
                          ) : (
                            <X className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-2">
                            Question {index + 1}: {result.question}
                          </p>
                          <div className="space-y-1 text-sm">
                            <p
                              className={`${
                                result.isCorrect
                                  ? "text-green-700"
                                  : "text-red-700"
                              }`}
                            >
                              Your answer: {result.userAnswer}
                            </p>
                            {!result.isCorrect && (
                              <p className="text-green-700">
                                Correct answer: {result.correctAnswer}
                              </p>
                            )}
                            <p className="text-gray-600">
                              Points: {result.isCorrect ? result.points : 0}/
                              {result.points}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button
                onClick={handleCloseResults}
                className="text-white"
                style={{ backgroundColor: "hsl(var(--student-primary))" }}
              >
                Close Results
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const handleSubmitQuiz = () => {
    if (activeQuiz) {
      // Calculate results
      let correctAnswers = 0;
      let totalQuestions = activeQuiz.questions.length;
      let score = 0;

      const questionResults = activeQuiz.questions.map((question: any) => {
        const userAnswer = answers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) {
          correctAnswers++;
          score += question.points;
        }
        return {
          question: question.question,
          userAnswer,
          correctAnswer: question.correctAnswer,
          isCorrect,
          points: question.points,
        };
      });

      const results = {
        score,
        totalPoints: activeQuiz.totalPoints,
        correctAnswers,
        totalQuestions,
        percentage: Math.round((score / activeQuiz.totalPoints) * 100),
        questionResults,
        passed: score / activeQuiz.totalPoints >= 0.6, // 60% pass rate
      };

      setQuizResults(results);
      submitQuizAttempt(activeQuiz.attemptId, answers);
      setShowResults(true);

      toast({
        title: results.passed ? "Quiz Completed!" : "Quiz Completed",
        description: `You scored ${score}/${activeQuiz.totalPoints} points (${results.percentage}%)`,
        variant: results.passed ? "default" : "destructive",
      });
    }
  };

  if (activeQuiz && !showResults) {
    const question = activeQuiz.questions[currentQuestion];
    const isLastQuestion = currentQuestion === activeQuiz.questions.length - 1;
    const progress =
      ((currentQuestion + 1) / activeQuiz.questions.length) * 100;

    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeQuiz.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  Question {currentQuestion + 1} of{" "}
                  {activeQuiz.questions.length}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-2">Progress</div>
                <Progress value={progress} className="w-32" />
              </div>
            </div>
          </header>

          <main className="flex-1 p-8">
            <Card className="max-w-4xl mx-auto shadow-lg">
              <CardHeader
                className="rounded-t-lg"
                style={{ backgroundColor: "hsl(var(--student-accent))" }}
              >
                <CardTitle className="flex items-center text-gray-900">
                  <Brain
                    className="w-6 h-6 mr-2"
                    style={{ color: "hsl(var(--student-primary))" }}
                  />
                  Question {currentQuestion + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <p className="text-xl text-gray-900 leading-relaxed">
                    {question.question}
                  </p>
                </div>

                {question.type === "multiple-choice" && (
                  <RadioGroup
                    value={answers[question.id]?.toString()}
                    onValueChange={(value) =>
                      setAnswers({ ...answers, [question.id]: value })
                    }
                    className="space-y-4"
                  >
                    {question.options?.map((option: string, index: any) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label
                          htmlFor={`option-${index}`}
                          className="text-lg cursor-pointer flex-1"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === "true-false" && (
                  <RadioGroup
                    value={answers[question.id]?.toString()}
                    onValueChange={(value) =>
                      setAnswers({ ...answers, [question.id]: value })
                    }
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="true" id="true" />
                      <Label
                        htmlFor="true"
                        className="text-lg cursor-pointer flex-1"
                      >
                        True
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="false" id="false" />
                      <Label
                        htmlFor="false"
                        className="text-lg cursor-pointer flex-1"
                      >
                        False
                      </Label>
                    </div>
                  </RadioGroup>
                )}

                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                    disabled={currentQuestion === 0}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Previous
                  </Button>

                  {isLastQuestion ? (
                    <Button
                      onClick={handleSubmitQuiz}
                      className="text-white shadow-lg"
                      style={{ backgroundColor: "hsl(var(--student-primary))" }}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Submit Quiz
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestion(currentQuestion + 1)}
                      className="text-white"
                      style={{ backgroundColor: "hsl(var(--student-primary))" }}
                    >
                      Next Question
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>

        <QuizResultsDialog />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Quizzes</h1>
              <p className="text-gray-600 mt-1">
                Test your knowledge and track your progress
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                {quizzes.length} Available
              </Badge>
              <Badge className="bg-green-50 text-green-700 border-green-200">
                {
                  quizzes.filter(
                    (q) =>
                      getStudentQuizAttempt("kong-keat", q.id)?.status ===
                      "completed"
                  ).length
                }{" "}
                Completed
              </Badge>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:ring-2 shadow-sm"
                style={
                  { "--tw-ring-color": "hsl(var(--student-primary))" } as any
                }
              />
            </div>
          </div>

          {/* Quizzes List */}
          <div className="space-y-6">
            {filteredQuizzes.map((quiz) => {
              const attempt = getStudentQuizAttempt("kong-keat", quiz.id);
              const isCompleted = attempt?.status === "completed";

              return (
                <Card
                  key={quiz.id}
                  className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div
                            className="p-2 rounded-lg"
                            style={{
                              backgroundColor: "hsl(var(--student-accent))",
                            }}
                          >
                            <Brain
                              className="w-5 h-5"
                              style={{ color: "hsl(var(--student-primary))" }}
                            />
                          </div>
                          <h3 className="font-semibold text-xl text-gray-900">
                            {quiz.title}
                          </h3>
                          {getQuizStatus(quiz)}
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due: {new Date(quiz.dueDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {quiz.duration} minutes
                          </span>
                          <span className="flex items-center font-medium">
                            {quiz.totalPoints} points
                          </span>
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {quiz.questions.length} questions
                          </span>
                        </div>

                        <p className="text-gray-700 mb-6 leading-relaxed">
                          {quiz.description}
                        </p>

                        {isCompleted && attempt && (
                          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                Completed - Score: {attempt.score}/
                                {quiz.totalPoints} points (
                                {Math.round(
                                  (attempt.score / quiz.totalPoints) * 100
                                )}
                                %)
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="ml-6">
                        {!isCompleted && quiz.status === "active" && (
                          <Button
                            onClick={() => handleStartQuiz(quiz)}
                            className="text-white shadow-lg"
                            style={{
                              backgroundColor: "hsl(var(--student-primary))",
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Start Quiz
                          </Button>
                        )}
                        {isCompleted && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setQuizResults({
                                score: attempt?.score || 0,
                                totalPoints: quiz.totalPoints,
                                percentage: Math.round(
                                  ((attempt?.score || 0) / quiz.totalPoints) *
                                    100
                                ),
                                passed:
                                  (attempt?.score || 0) / quiz.totalPoints >=
                                  0.6,
                              });
                              setShowResults(true);
                              setActiveQuiz(quiz);
                            }}
                            className="border-gray-300 hover:bg-gray-50"
                            style={{ color: "hsl(var(--student-primary))" }}
                          >
                            <Trophy className="w-4 h-4 mr-2" />
                            View Results
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredQuizzes.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-lg">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No quizzes found
                </h3>
                <p className="text-gray-500">
                  Check back later for new quizzes!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <QuizResultsDialog />
    </div>
  );
};

export default StudentQuizPageComponent;
