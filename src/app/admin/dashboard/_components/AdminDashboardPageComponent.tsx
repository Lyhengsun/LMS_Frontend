"use client";
import { Sidebar } from "@/src/components/Sidebar";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { BookOpen, Clock, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

const AdminDashboardPageComponent = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCourses: 0,
    pendingApprovals: 0,
  });

  useEffect(() => {
    // Calculate real stats from localStorage
    const adminUsers = JSON.parse(localStorage.getItem("adminUsers") || "[]");
    const approvedCourses = JSON.parse(
      localStorage.getItem("approvedCourses") || "[]"
    );
    const pendingCourses = JSON.parse(
      localStorage.getItem("pendingCourses") || "[]"
    );
    const pendingRegistrations = JSON.parse(
      localStorage.getItem("pendingRegistrations") || "[]"
    );

    const pendingCoursesCount = pendingCourses.filter(
      (course: any) => course.status === "pending"
    ).length;
    const pendingRegistrationsCount = pendingRegistrations.filter(
      (reg: any) => reg.status === "pending"
    ).length;

    setStats({
      totalUsers: adminUsers.length + 3, // +3 for default demo users
      activeCourses: approvedCourses.length,
      pendingApprovals: pendingCoursesCount + pendingRegistrationsCount,
    });
  }, []);

  const systemStats = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      icon: Users,
      color: "hsl(var(--admin-primary))",
      change: `${
        stats.totalUsers > 3 ? "+" + (stats.totalUsers - 3) : "0"
      } created`,
    },
    {
      title: "Active Courses",
      value: stats.activeCourses.toString(),
      icon: BookOpen,
      color: "hsl(var(--admin-primary))",
      change: `${
        stats.activeCourses > 0 ? "+" + stats.activeCourses : "0"
      } approved`,
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals.toString(),
      icon: Clock,
      color: "hsl(var(--admin-primary))",
      change: `${
        stats.pendingApprovals > 0
          ? stats.pendingApprovals + " pending"
          : "None pending"
      }`,
    },
  ];

  const pendingApprovals = [
    {
      type: "Course",
      title: "Machine Learning Fundamentals",
      submitter: "Dr. Smith",
      date: "Dec 25",
      priority: "high",
    },
    {
      type: "User",
      title: "Instructor Role Request",
      submitter: "Jane Brown",
      date: "Dec 26",
      priority: "medium",
    },
    {
      type: "Content",
      title: "Quiz Content Review",
      submitter: "Prof. Johnson",
      date: "Dec 27",
      priority: "low",
    },
  ];

  const userGrowth = [
    {
      role: "Students",
      count: Math.floor(stats.totalUsers * 0.76),
      percentage: 76.4,
      growth: "+12%",
    },
    {
      role: "Instructors",
      count: Math.floor(stats.totalUsers * 0.19),
      percentage: 18.8,
      growth: "+8%",
    },
    {
      role: "Admins",
      count: Math.floor(stats.totalUsers * 0.05),
      percentage: 4.8,
      growth: "+2%",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              System overview and management center
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Removed System Online and User Profile */}
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {systemStats.map((stat, index) => {
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
                      style={{ backgroundColor: "hsl(var(--admin-accent))" }}
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
          {/* Pending Approvals */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock
                  className="w-5 h-5 mr-2"
                  style={{ color: "hsl(var(--admin-primary))" }}
                />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingApprovals.map((approval, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {approval.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          by {approval.submitter}
                        </p>
                      </div>
                      <Badge
                        className={`text-xs ${
                          approval.priority === "high"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : approval.priority === "medium"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        }`}
                      >
                        {approval.date}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        {approval.type}
                      </Badge>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          approval.priority === "high"
                            ? "bg-red-500"
                            : approval.priority === "medium"
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
      </main>
    </div>
  );
};

export default AdminDashboardPageComponent;
