"use client"

import { ArrowLeft, Trophy, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock data - replace with actual API calls
const quizHistory = [
  {
    id: 1,
    name: "React Fundamentals Quiz",
    category: "Web Development",
    attempts: [
      {
        attemptNumber: 1,
        score: 92,
        totalQuestions: 10,
        correctAnswers: 9,
        passingScore: 70,
        passed: true,
        timeSpent: "12 min 34 sec",
        completedAt: "Jan 20, 2024 at 2:30 PM",
      },
    ],
    maxAttempts: 3,
    status: "completed",
  },
  {
    id: 2,
    name: "JavaScript Final Quiz",
    category: "JavaScript Fundamentals",
    attempts: [
      {
        attemptNumber: 2,
        score: 85,
        totalQuestions: 15,
        correctAnswers: 13,
        passingScore: 70,
        passed: true,
        timeSpent: "18 min 12 sec",
        completedAt: "Jan 19, 2024 at 4:15 PM",
      },
      {
        attemptNumber: 1,
        score: 65,
        totalQuestions: 15,
        correctAnswers: 10,
        passingScore: 70,
        passed: false,
        timeSpent: "15 min 45 sec",
        completedAt: "Jan 18, 2024 at 3:20 PM",
      },
    ],
    maxAttempts: 3,
    status: "completed",
  },
  {
    id: 3,
    name: "Database Design Quiz",
    category: "Database Management",
    attempts: [],
    maxAttempts: 3,
    status: "available",
  },
  {
    id: 4,
    name: "Advanced React Patterns",
    category: "Web Development",
    attempts: [],
    maxAttempts: 2,
    status: "available",
  },
]

export default function QuizHistoryPageComponent() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="flex-1">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link href="/student" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-foreground">Quiz History</h1>
              <p className="text-muted-foreground mt-1">View all your quiz attempts and scores</p>
            </div>

            {/* Quiz List */}
            <div className="space-y-6">
              {quizHistory.map((quiz) => (
                <Card key={quiz.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{quiz.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{quiz.category}</p>
                      </div>
                      <Badge variant={quiz.status === "completed" ? "default" : "secondary"}>
                        {quiz.status === "completed" ? "Completed" : "Not Attempted"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {quiz.attempts.length > 0 ? (
                      <div className="space-y-4">
                        {quiz.attempts.map((attempt) => (
                          <div key={attempt.attemptNumber} className="p-4 rounded-lg border border-border bg-muted/30">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                    attempt.passed
                                      ? "bg-green-100 dark:bg-green-900/20"
                                      : "bg-red-100 dark:bg-red-900/20"
                                  }`}
                                >
                                  {attempt.passed ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">Attempt {attempt.attemptNumber}</p>
                                  <p className="text-xs text-muted-foreground">{attempt.completedAt}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-foreground">{attempt.score}%</p>
                                <p
                                  className={`text-xs font-medium ${
                                    attempt.passed
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {attempt.passed ? "Passed" : "Failed"}
                                </p>
                              </div>
                            </div>

                            <div className="grid gap-3 md:grid-cols-3 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Trophy className="h-4 w-4" />
                                <span>
                                  {attempt.correctAnswers}/{attempt.totalQuestions} correct
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{attempt.timeSpent}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <AlertCircle className="h-4 w-4" />
                                <span>Passing: {attempt.passingScore}%</span>
                              </div>
                            </div>
                          </div>
                        ))}

                        {quiz.attempts.length < quiz.maxAttempts && (
                          <div className="flex items-center justify-between pt-2">
                            <p className="text-sm text-muted-foreground">
                              {quiz.maxAttempts - quiz.attempts.length} attempt(s) remaining
                            </p>
                            <Button variant="outline" asChild>
                              <Link href={`/quizzes/${quiz.id}/take`}>Retake Quiz</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                          <Trophy className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground mb-4">You haven't attempted this quiz yet</p>
                        <p className="text-sm text-muted-foreground mb-4">{quiz.maxAttempts} attempts available</p>
                        <Button asChild>
                          <Link href={`/quizzes/${quiz.id}/take`}>Start Quiz</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
