"use client";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  Clock,
  Eye,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: string;
  thumbnail: string;
  videoUrl: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  instructor: string;
}

const CourseManagementPageComponent = () => {
  const { toast } = useToast();
  const [pendingCourses, setPendingCourses] = useState<Course[]>([]);
  const [approvedCourses, setApprovedCourses] = useState<Course[]>([]);
  const [rejectedCourses, setRejectedCourses] = useState<Course[]>([]);

  useEffect(() => {
    loadCourses();

    // Listen for storage changes to update when new courses are submitted
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "pendingCourses" || e.key === "approvedCourses") {
        loadCourses();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const loadCourses = () => {
    // Load pending courses from localStorage
    const stored = JSON.parse(localStorage.getItem("pendingCourses") || "[]");
    setPendingCourses(
      stored.filter((course: Course) => course.status === "pending")
    );
    setRejectedCourses(
      stored.filter((course: Course) => course.status === "rejected")
    );

    // Load approved courses
    const approved = JSON.parse(
      localStorage.getItem("approvedCourses") || "[]"
    );
    setApprovedCourses(approved);
  };

  const handleApprove = (courseId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this course?"
    );
    if (!confirmed) return;

    const course = pendingCourses.find((c) => c.id === courseId);
    if (!course) return;

    const updatedCourse = { ...course, status: "approved" as const };

    // Update localStorage for pending courses
    const allPending = JSON.parse(
      localStorage.getItem("pendingCourses") || "[]"
    );
    const updatedPending = allPending.map((c: Course) =>
      c.id === courseId ? updatedCourse : c
    );
    localStorage.setItem("pendingCourses", JSON.stringify(updatedPending));

    // Add to approved courses
    const approved = JSON.parse(
      localStorage.getItem("approvedCourses") || "[]"
    );
    approved.push(updatedCourse);
    localStorage.setItem("approvedCourses", JSON.stringify(approved));

    // Update state
    setPendingCourses((prev) => prev.filter((c) => c.id !== courseId));
    setApprovedCourses((prev) => [updatedCourse, ...prev]);

    // Trigger storage event for other components
    window.dispatchEvent(new Event("storage"));

    toast({
      title: "Course Approved",
      description:
        "The course has been approved and is now available to students",
    });
  };

  const handleReject = (courseId: string) => {
    const reason = window.prompt("Please provide a reason for rejection:");
    if (!reason) return;

    const confirmed = window.confirm(
      "Are you sure you want to reject this course?"
    );
    if (!confirmed) return;

    const course = pendingCourses.find((c) => c.id === courseId);
    if (!course) return;

    const rejectedCourse = {
      ...course,
      status: "rejected" as const,
      rejectionReason: reason,
    };

    // Update localStorage
    const allPending = JSON.parse(
      localStorage.getItem("pendingCourses") || "[]"
    );
    const updatedPending = allPending.map((c: Course) =>
      c.id === courseId ? rejectedCourse : c
    );
    localStorage.setItem("pendingCourses", JSON.stringify(updatedPending));

    // Update state
    setPendingCourses((prev) => prev.filter((c) => c.id !== courseId));
    setRejectedCourses((prev) => [rejectedCourse, ...prev]);

    toast({
      title: "Course Rejected",
      description: `The course has been rejected. Reason: ${reason}`,
      variant: "destructive",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Course Management
              </h1>
              <p className="text-sm text-gray-500">
                Review and approve course submissions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-500">Pending: </span>
                <span className="font-medium text-yellow-600">
                  {pendingCourses.length}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Approved: </span>
                <span className="font-medium text-green-600">
                  {approvedCourses.length}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Rejected: </span>
                <span className="font-medium text-red-600">
                  {rejectedCourses.length}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 space-y-8">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-yellow-600" />
                Pending Course Approvals ({pendingCourses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingCourses.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No pending courses for approval</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCourses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {course.title}
                            </h3>
                            {getStatusBadge(course.status)}
                          </div>
                          <p className="text-gray-600 mb-3">
                            {course.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span>Category: {course.category}</span>
                            <span>Difficulty: {course.difficulty}</span>
                            {course.duration && (
                              <span>Duration: {course.duration}</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            Submitted by: {course.instructor} •{" "}
                            {new Date(course.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(course.videoUrl, "_blank")
                            }
                            disabled={!course.videoUrl}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(course.id)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(course.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approved Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                Approved Courses ({approvedCourses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {approvedCourses.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No approved courses yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {approvedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {course.title}
                        </h3>
                        {getStatusBadge(course.status)}
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        <div>Category: {course.category}</div>
                        <div>By: {course.instructor}</div>
                        <div>
                          Approved:{" "}
                          {new Date(course.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rejected Courses */}
          {rejectedCourses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <XCircle className="w-5 h-5 mr-2 text-red-600" />
                  Rejected Courses ({rejectedCourses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rejectedCourses.map((course: any) => (
                    <div
                      key={course.id}
                      className="border border-red-200 rounded-lg p-4 bg-red-50"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {course.title}
                        </h3>
                        {getStatusBadge(course.status)}
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {course.description}
                      </p>
                      {course.rejectionReason && (
                        <p className="text-red-700 text-xs mb-2 italic">
                          Reason: {course.rejectionReason}
                        </p>
                      )}
                      <div className="text-xs text-gray-500">
                        <div>Category: {course.category}</div>
                        <div>By: {course.instructor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseManagementPageComponent;
