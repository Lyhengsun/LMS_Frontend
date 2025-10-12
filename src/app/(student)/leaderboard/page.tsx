import React from "react";
import StudentLeaderboardComponent from "./_components/StudentLeaderboardComponent";
import { getCurrentStudentLeaderboardService, getCurrentStudentRankLeaderboardService } from "@/src/service/leaderboard.service";

const LeaderboardPage = async () => {
  const currentStudentLeaderboardResponse = await getCurrentStudentLeaderboardService();
  const currentStudentRankResponse = await getCurrentStudentRankLeaderboardService();
  return (
    <StudentLeaderboardComponent
      currentUserLeaderboard={currentStudentLeaderboardResponse?.payload!}
      currentUserRank={currentStudentRankResponse?.payload!}
    />
  );
};

export default LeaderboardPage;
