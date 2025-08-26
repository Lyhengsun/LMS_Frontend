"use client";

import { Sidebar } from "@/src/components/Sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLeaderboard } from "@/src/lib/hooks/useLeaderboard";
import { Medal, Star, TrendingUp, Trophy } from "lucide-react";
import React from "react";

const StudentLeaderboardComponent = () => {
  const { leaderboardData, getCurrentUserStats } = useLeaderboard();
  const currentUserStats = getCurrentUserStats();

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-500" />;
    return <Star className="w-5 h-5 text-blue-500" />;
  };

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
            className={`px-4 py-2 text-lg ${getRankBadge(
              currentUserStats.rank
            )}`}
          >
            Rank #{currentUserStats.rank}
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
                  {currentUserStats.totalPoints}
                </div>
                <div className="text-gray-600">Total Points</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {currentUserStats.points}
                </div>
                <div className="text-gray-600">Course Points</div>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {currentUserStats.assignmentPoints}
                </div>
                <div className="text-gray-600">Assignment Points</div>
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
            <div className="space-y-4">
              {leaderboardData.map((student, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-6 rounded-xl transition-all duration-200 ${
                    student.isCurrentUser
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getRankBadge(
                        student.rank
                      )}`}
                    >
                      <span className="font-bold text-white">
                        #{student.rank}
                      </span>
                    </div>
                    {getRankIcon(student.rank)}
                  </div>

                  <Avatar className="w-12 h-12 ring-2 ring-blue-100">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                      {student.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {student.name}
                      </h3>
                      {student.isCurrentUser && (
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Course: {student.points} pts</span>
                      <span>Assignment: {student.assignmentPoints} pts</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {student.points + (student.assignmentPoints || 0)}
                    </div>
                    <div className="text-sm text-gray-500">Total Points</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentLeaderboardComponent;
