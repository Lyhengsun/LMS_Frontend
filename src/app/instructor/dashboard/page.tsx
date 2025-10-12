import React from "react";
import InstructorDashboardPageComponent from "./_components/InstructorDashboardPageComponent";
import {
  getCourseStatusForInstructorDashboardService,
  getQuizAttemptsOverTimeForInstructorDashboardService,
  getQuizPerformanceForInstructorDashboardService,
  getSummaryStatsForInstructorService,
} from "@/src/service/dashboard.service";

const InstructorDashboardPage = async () => {
  const instructorSummaryStatResponse =
    await getSummaryStatsForInstructorService();
  const courseStatusResponse =
    await getCourseStatusForInstructorDashboardService();
  const quizPerformanceResponse =
    await getQuizPerformanceForInstructorDashboardService();
  const quizAttemptsOverTimeResponse =
    await getQuizAttemptsOverTimeForInstructorDashboardService(90);

  return (
    <InstructorDashboardPageComponent
      instructorSummaryStat={instructorSummaryStatResponse?.payload!}
      courseStatus={courseStatusResponse?.payload!}
      quizPerformance={quizPerformanceResponse?.payload!}
      quizAttemptsOverTime={quizAttemptsOverTimeResponse?.payload!}
    />
  );
};

export default InstructorDashboardPage;
