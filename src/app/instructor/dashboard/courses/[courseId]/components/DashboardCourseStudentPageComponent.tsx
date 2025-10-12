"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Mail, BarChart3, Download } from "lucide-react";
import Link from "next/link";

// Mock data - in a real app, this would come from a database based on the course ID
const courseData = {
  id: 1,
  title: "React Development",
  totalStudents: 89,
};

const students = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    enrolledDate: "Jan 15, 2024",
    progress: 85,
    lastActive: "2 hours ago",
    status: "Active",
    avatar: "/diverse-students-studying.png",
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@example.com",
    enrolledDate: "Jan 18, 2024",
    progress: 92,
    lastActive: "1 day ago",
    status: "Active",
    avatar: "/diverse-students-studying.png",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@example.com",
    enrolledDate: "Jan 20, 2024",
    progress: 67,
    lastActive: "3 hours ago",
    status: "Active",
    avatar: "/diverse-students-studying.png",
  },
  {
    id: 4,
    name: "James Wilson",
    email: "j.wilson@example.com",
    enrolledDate: "Jan 22, 2024",
    progress: 45,
    lastActive: "5 days ago",
    status: "At Risk",
    avatar: "/diverse-students-studying.png",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa.a@example.com",
    enrolledDate: "Jan 25, 2024",
    progress: 78,
    lastActive: "4 hours ago",
    status: "Active",
    avatar: "/diverse-students-studying.png",
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@example.com",
    enrolledDate: "Feb 1, 2024",
    progress: 100,
    lastActive: "1 hour ago",
    status: "Completed",
    avatar: "/diverse-students-studying.png",
  },
];

export default function DashboardCourseStudentPageComponent() {
  return (
    <main className="flex-1">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/instructor/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {courseData.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and track your {courseData.totalStudents} enrolled
                students
              </p>
            </div>
            {/* <Button>
              <Download className="h-4 w-4 mr-2" />
              Export List
            </Button> */}
          </div>
        </div>

        {/* Students List */}
            <div className="space-y-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col bg-white sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border p-4 hover:bg-accent/50 hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={student.avatar || "/placeholder.svg"}
                        alt={student.name}
                      />
                      <AvatarFallback>
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {student.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {student.email}
                      </p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap">
                        <Badge
                          className={
                            student.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : student.status === "At Risk"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }
                          variant="secondary"
                        >
                          {student.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Enrolled: {student.enrolledDate}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Last active: {student.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {student.progress}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Progress
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        View Progress
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
      </div>
    </main>
  );
}
