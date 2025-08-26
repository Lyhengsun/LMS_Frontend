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
import {
  Activity,
  Bell,
  BookOpen,
  Clock,
  FileText,
  HelpCircle,
} from "lucide-react";

import React from "react";
const InstructorDashboardPageComponent = () => {
  const dashboardStats = [
    {
      title: "Pending Courses",
      value: "5",
      icon: BookOpen,
      color: "hsl(var(--instructor-primary))",
      change: "3 awaiting approval",
    },
    {
      title: "Pending Assignment",
      value: "12",
      icon: FileText,
      color: "hsl(var(--instructor-primary))",
      change: "8 due this week",
    },
    {
      title: "Pending Quiz",
      value: "7",
      icon: HelpCircle,
      color: "hsl(var(--instructor-primary))",
      change: "4 need review",
    },
  ];

  const recentActivity = [
    {
      student: "Sarah Johnson",
      action: "Submitted React Project Assignment",
      time: "2 hours ago",
      type: "assignment",
      status: "pending",
    },
    {
      student: "Mike Chen",
      action: "Completed JavaScript Quiz",
      time: "4 hours ago",
      type: "quiz",
      status: "completed",
    },
    {
      student: "Emma Wilson",
      action: "Asked question in Discussion",
      time: "1 day ago",
      type: "discussion",
      status: "active",
    },
    {
      student: "David Brown",
      action: "Enrolled in Advanced React Course",
      time: "2 days ago",
      type: "enrollment",
      status: "completed",
    },
  ];

  const coursePerformance = [
    { course: "React Development", students: 42, completion: 78, rating: 4.9 },
    {
      course: "JavaScript Fundamentals",
      students: 65,
      completion: 85,
      rating: 4.7,
    },
    { course: "Node.js Backend", students: 28, completion: 72, rating: 4.8 },
    { course: "Database Design", students: 35, completion: 80, rating: 4.6 },
  ];

  const upcomingTasks = [
    {
      title: "Grade React Projects",
      course: "React Development",
      deadline: "Dec 28",
      priority: "high",
      count: 24,
    },
    {
      title: "Prepare Quiz Questions",
      course: "JavaScript Fundamentals",
      deadline: "Dec 30",
      priority: "medium",
      count: 12,
    },
    {
      title: "Review Discussion Posts",
      course: "Node.js Backend",
      deadline: "Jan 2",
      priority: "low",
      count: 8,
    },
  ];

  const quickActions = [
    {
      title: "Create Course",
      icon: BookOpen,
      path: "/instructor-courses",
      description: "Add new course",
    },
    {
      title: "New Assignment",
      icon: FileText,
      path: "/instructor-assignments",
      description: "Create assignment",
    },
    {
      title: "Create Quiz",
      icon: HelpCircle,
      path: "/instructor-quizzes",
      description: "Design quiz",
    },
    {
      title: "Send Message",
      icon: Bell,
      path: "/instructor-notifications",
      description: "Notify students",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Instructor Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, Dr. Smith! Manage your courses and track student
              progress.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* <div className="relative">
                <Bell className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div> */}
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow bg-white"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: "hsl(var(--instructor-accent))",
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8">
          {/* Upcoming Tasks */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock
                  className="w-5 h-5 mr-2"
                  style={{ color: "hsl(var(--instructor-primary))" }}
                />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingTasks.map((task, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {task.title}
                        </h4>
                        <p className="text-sm text-gray-600">{task.course}</p>
                      </div>
                      <Badge
                        className={`text-xs ${
                          task.priority === "high"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : task.priority === "medium"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {task.deadline}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {task.count} items
                      </span>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          task.priority === "high"
                            ? "bg-red-500"
                            : task.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8 bg-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity
                className="w-5 h-5 mr-2"
                style={{ color: "hsl(var(--instructor-primary))" }}
              />
              Recent Student Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarFallback
                      className="text-white font-semibold text-sm"
                      style={{
                        backgroundColor: "hsl(var(--instructor-primary))",
                      }}
                    >
                      {activity.student
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">
                        {activity.student}
                      </p>
                      <span className="text-xs text-gray-500">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.action}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge
                        className={`text-xs ${
                          activity.type === "assignment"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : activity.type === "quiz"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : activity.type === "discussion"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}
                      >
                        {activity.type}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          activity.status === "pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : activity.status === "completed"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {activity.status}
                      </Badge>
                    </div>
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

export default InstructorDashboardPageComponent;
