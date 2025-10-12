"use client";

import { BookOpen, Trophy, Target, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  StudentLearningInsight,
  StudentSummaryStats,
} from "@/src/type/Dashboard";
import LearningInsightComponent from "./LearningInsightComponent";
import ContinueLearningComponent from "./ContinueLearningComponent";
import QuizOverviewComponent from "./QuizOverviewComponent";
import { useUserStore } from "@/src/store/useUserStore";

export default function StudentDashboardPageComponent({
  summaryStats,
  learningInsights,
}: {
  summaryStats: StudentSummaryStats;
  learningInsights: StudentLearningInsight;
}) {
  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <div className="min-h-screen">
      <div className="flex">
        <div className="flex-1">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                Student Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {currentUser?.fullName} ! Ready to continue your learning journey?
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Enrolled Courses
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {summaryStats.enrolledCourses}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Active enrollments
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Course Progress
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {summaryStats.courseProgress}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Average completion
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Quizzes Taken
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {summaryStats.quizzesTaken}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total attempts
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Quiz Performance
                      </p>
                      <p className="text-3xl font-bold mt-2">
                        {summaryStats.quizPerformance}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Average completion
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main Content Area - Continue Learning & Recent Activity */}
              <div className="lg:col-span-2 space-y-8">
                <LearningInsightComponent learningInsights={learningInsights}/>

                <ContinueLearningComponent />
              </div>

              {/* Quiz Overview Sidebar */}
              <QuizOverviewComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
