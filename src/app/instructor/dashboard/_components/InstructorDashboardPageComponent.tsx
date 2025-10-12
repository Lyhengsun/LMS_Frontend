"use client";
import React from "react";
import { DashboardHeaderComponent } from "./DashboardHeaderComponent";
import { InstructorStatsCardComponent } from "./InstructorStatsCardComponent";
import { InstructorCourseDashboardComponent } from "./InstructorCourseDashboardComponent";
import { InstuctorQuizDashboardComponent } from "./InstuctorQuizDashboardComponent";
import { CourseStatusCounts, DailyAttempt, InstructorStatsData, QuizDistribution } from "@/src/type/Dashboard";
import { CourseStatusPieChart } from "./CourseStatusPieChart";
import { QuizPerformancePieChart } from "./QuizPerformancePieChart";
import { QuizAttemptsLineChart } from "./QuizAttemptsLineChart";
const InstructorDashboardPageComponent = ({
  instructorSummaryStat,
  courseStatus,
  quizPerformance,
  quizAttemptsOverTime
}: {
  instructorSummaryStat: InstructorStatsData;
  courseStatus: CourseStatusCounts,
  quizPerformance: QuizDistribution,
  quizAttemptsOverTime: {
    dailyAttempts : DailyAttempt[]
  }
}) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <DashboardHeaderComponent />

      <main className="flex-1 px-8 mt-8 space-y-8">
        {/* Stats Cards */}
        <InstructorStatsCardComponent
          instructorSummaryStat={instructorSummaryStat}
        />

        {/* Pie Charts Section */}
        <div className="grid grid-cols-2 lg:grid-cols-7 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <CourseStatusPieChart
              statusCounts={courseStatus}
            />
          </div>

          <div className="col-span-1 lg:col-span-2">
          <QuizPerformancePieChart
            passCount={quizPerformance.passed}
            failCount={quizPerformance.failed}
          />
          </div>

        <div className="col-span-2 lg:col-span-3">
            <QuizAttemptsLineChart
              dailyAttempts={quizAttemptsOverTime.dailyAttempts}
              title="Quiz Activity Analytics"
              defaultDays={14}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <InstructorCourseDashboardComponent />

        {/* Recent Activity */}
        <InstuctorQuizDashboardComponent />
      </main>
    </div>
  );
};

export default InstructorDashboardPageComponent;
