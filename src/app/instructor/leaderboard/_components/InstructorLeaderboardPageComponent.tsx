"use client";
import { Sidebar } from "@/src/components/Sidebar";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import {
  Award,
  Medal,
  Search,
  Star,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const InstructorLeaderboardPageComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah Chen",
      avatar: "SC",
      points: 892,
      coursesCompleted: 8,
      averageScore: 96,
      badges: ["Top Performer", "Course Master", "Quiz Champion"],
    },
    {
      rank: 2,
      name: "Alex Rivera",
      avatar: "AR",
      points: 756,
      coursesCompleted: 7,
      averageScore: 94,
      badges: ["Consistent Learner", "Discussion Leader"],
    },
    {
      rank: 3,
      name: "Emily Wang",
      avatar: "EW",
      points: 634,
      coursesCompleted: 6,
      averageScore: 92,
      badges: ["Fast Learner", "Assignment Ace"],
    },
    {
      rank: 4,
      name: "Mike Johnson",
      avatar: "MJ",
      points: 589,
      coursesCompleted: 5,
      averageScore: 88,
      badges: ["Rising Star"],
    },
    {
      rank: 5,
      name: "Lisa Park",
      avatar: "LP",
      points: 523,
      coursesCompleted: 4,
      averageScore: 85,
      badges: ["Steady Progress"],
    },
  ];

  const filteredData = leaderboardData.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-bold">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Leaderboard
              </h1>
              <p className="text-gray-600 mt-1">
                Track student performance and achievements
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users
                    className="w-8 h-8"
                    style={{ color: "hsl(var(--instructor-primary))" }}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Total Students
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {leaderboardData.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp
                    className="w-8 h-8"
                    style={{ color: "hsl(var(--instructor-primary))" }}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Avg. Score
                    </p>
                    <p className="text-2xl font-bold text-gray-900">91%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Star
                    className="w-8 h-8"
                    style={{ color: "hsl(var(--instructor-primary))" }}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Top Performer
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      Sarah Chen
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy
                  className="w-5 h-5 mr-2"
                  style={{ color: "hsl(var(--instructor-primary))" }}
                />
                Student Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredData.map((student) => (
                  <div
                    key={student.rank}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12">
                        {getRankIcon(student.rank)}
                      </div>
                      <Avatar className="w-12 h-12">
                        <AvatarFallback
                          className="text-white font-semibold"
                          style={{
                            backgroundColor: "hsl(var(--instructor-primary))",
                          }}
                        >
                          {student.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {student.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {student.points} points
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          {student.coursesCompleted}
                        </p>
                        <p className="text-xs text-gray-500">Courses</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900">
                          {student.averageScore}%
                        </p>
                        <p className="text-xs text-gray-500">Avg Score</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {student.badges.slice(0, 2).map((badge, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {badge}
                          </Badge>
                        ))}
                        {student.badges.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{student.badges.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default InstructorLeaderboardPageComponent;
