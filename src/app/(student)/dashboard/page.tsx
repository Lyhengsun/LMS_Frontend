import React from "react";
import StudentDashboardPageComponent from "./_components/StudentDashboardPageComponent";
import {
  getLearningInsightForStudentService,
  getSummaryStatsForStudentService,
} from "@/src/service/dashboard.service";

const StudentDashboardPage = async () => {
  const summaryStatResponse = await getSummaryStatsForStudentService();
  const learningInsightsResponse = await getLearningInsightForStudentService();

  return (
    <StudentDashboardPageComponent
      summaryStats={summaryStatResponse?.payload!}
      learningInsights={learningInsightsResponse?.payload!}
    />
  );
};

export default StudentDashboardPage;
