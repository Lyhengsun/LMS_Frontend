"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllLeaderboardsAction } from "@/src/action/leaderboardAction";
import { useState, useEffect } from "react";
import { Medal, Star, TrendingUp, Trophy } from "lucide-react";
import React from "react";
import { Leaderboard } from "@/src/type/Leaderboard";
import StudentLeaderboardListComponent from "./StudentLeaderboardListComponent";
import { Badge } from "@/components/ui/badge";

const StudentLeaderboardComponent = ({
  currentUserLeaderboard,
  currentUserRank,
}: {
  currentUserLeaderboard: Leaderboard;
  currentUserRank: number;
}) => {
  // const currentUserLeaderboard = {
  //   quizPoints: 450,
  //   coursePoints: 380,
  //   assignmentPoints: 320,
  //   totalPoints: 1150,
  //   student: {
  //     id: "4  ",
  //     fullName: "Student",
  //     email: "sarah.johnson@example.com",
  //     bio: "Computer Science student passionate about web development",
  //     role: "ROLE_STUDENT",
  //     isVerified: true,
  //     isDisabled: false,
  //     isApproved: true,
  //     phoneNumber: "+1234567890",
  //     avatarUrl: "https://i.pravatar.cc/150?img=1",
  //     createdAt: "2024-01-15T08:00:00Z",
  //     editedAt: "2025-10-10T14:30:00Z",
  //   },
  // };

  const getRankBadge = (rank: number) => {
    if (rank === 1)
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (rank === 2)
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (rank === 3)
      return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
    return "bg-gradient-to-r from-blue-500 to-purple-600 text-white";
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <p className="text-gray-600 mt-1">
              See how you rank among your peers
            </p>
          </div>
          <Badge
            className={`px-4 py-2 text-lg ${getRankBadge(currentUserRank)}`}
          >
            {`Rank #${currentUserRank}`}
          </Badge>
        </div>
      </header>

      <main className="flex-1 p-8">
        {/* Your Performance */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <span>Your Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {currentUserLeaderboard.totalPoints}
                </div>
                <div className="text-gray-600">Total Points</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {currentUserLeaderboard.coursePoints}
                </div>
                <div className="text-gray-600">Course Points</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {currentUserLeaderboard.quizPoints}
                </div>
                <div className="text-gray-600">Quiz Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Students */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <span>Top Students</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StudentLeaderboardListComponent
              currentUserLeaderboard={currentUserLeaderboard}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentLeaderboardComponent;
