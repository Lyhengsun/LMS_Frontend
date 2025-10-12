"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Eye, Download, TrendingUp } from "lucide-react"
import Link from "next/link"

// Mock data - in a real app, this would come from a database based on the quiz ID
const quizData = {
  id: 1,
  title: "React Hooks Quiz",
  course: "React Development",
  totalAttempts: 234,
  avgScore: 85,
  passRate: 92,
}

const attempts = [
  {
    id: 1,
    studentName: "Sarah Johnson",
    studentEmail: "sarah.j@example.com",
    score: 95,
    totalQuestions: 20,
    correctAnswers: 19,
    timeSpent: "12 min",
    completedAt: "2 hours ago",
    status: "Passed",
    avatar: "/diverse-students-studying.png",
  },
  {
    id: 2,
    studentName: "Mike Chen",
    studentEmail: "mike.chen@example.com",
    score: 88,
    totalQuestions: 20,
    correctAnswers: 17,
    timeSpent: "15 min",
    completedAt: "4 hours ago",
    status: "Passed",
    avatar: "/diverse-students-studying.png",
  },
  {
    id: 3,
    studentName: "Emily Rodriguez",
    studentEmail: "emily.r@example.com",
    score: 72,
    totalQuestions: 20,
    correctAnswers: 14,
    timeSpent: "18 min",
    completedAt: "1 day ago",
    status: "Passed",
    avatar: "/diverse-students-studying.png",
  },
  {
    id: 4,
    studentName: "James Wilson",
    studentEmail: "j.wilson@example.com",
    score: 55,
    totalQuestions: 20,
    correctAnswers: 11,
    timeSpent: "22 min",
    completedAt: "1 day ago",
    status: "Failed",
    avatar: "/diverse-students-studying.png",
  },
  {
    id: 5,
    studentName: "Lisa Anderson",
    studentEmail: "lisa.a@example.com",
    score: 100,
    totalQuestions: 20,
    correctAnswers: 20,
    timeSpent: "10 min",
    completedAt: "2 days ago",
    status: "Passed",
    avatar: "/diverse-students-studying.png",
  },
  {
    id: 6,
    studentName: "David Kim",
    studentEmail: "david.kim@example.com",
    score: 82,
    totalQuestions: 20,
    correctAnswers: 16,
    timeSpent: "14 min",
    completedAt: "2 days ago",
    status: "Passed",
    avatar: "/diverse-students-studying.png",
  },
]

export default function DashboardQuizDetailPageComponent() {
  return (
      <main className="flex-1">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{quizData.title}</h1>
                <p className="text-muted-foreground mt-1">
                  {quizData.course} • {quizData.totalAttempts} total attempts
                </p>
              </div>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Attempts</div>
                <div className="text-2xl font-bold mt-1">{quizData.totalAttempts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Average Score</div>
                <div className="text-2xl font-bold mt-1 flex items-center gap-2">
                  {quizData.avgScore}%
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Pass Rate</div>
                <div className="text-2xl font-bold mt-1 text-green-600">{quizData.passRate}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Failed</div>
                <div className="text-2xl font-bold mt-1 text-red-600">
                  {Math.round(quizData.totalAttempts * (1 - quizData.passRate / 100))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attempts List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Quiz Attempts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attempts.map((attempt) => (
                  <div
                    key={attempt.id}
                    className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-lg border border-border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={attempt.avatar || "/placeholder.svg"} alt={attempt.studentName} />
                        <AvatarFallback>
                          {attempt.studentName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">{attempt.studentName}</h3>
                        <p className="text-sm text-muted-foreground">{attempt.studentEmail}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          <Badge
                            className={
                              attempt.status === "Passed" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }
                            variant="secondary"
                          >
                            {attempt.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {attempt.correctAnswers}/{attempt.totalQuestions} correct
                          </span>
                          <span className="text-xs text-muted-foreground">Time: {attempt.timeSpent}</span>
                          <span className="text-xs text-muted-foreground">{attempt.completedAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold ${attempt.score >= 70 ? "text-green-600" : "text-red-600"}`}
                        >
                          {attempt.score}%
                        </div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
  )
}
