"use client";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAssignmentStore } from "@/lib/hooks/useAssignmentStore";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle,
  FileText,
  Search,
  Upload,
} from "lucide-react";
import React, { useState } from "react";

const StudentAssignmentPageComponent = () => {
  const { assignments, submissions, addSubmission } = useAssignmentStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissionText, setSubmissionText] = useState("");

  const handleSubmit = () => {
    if (selectedAssignment && submissionText.trim()) {
      addSubmission({
        studentId: "kong-keat",
        studentName: "Kong KEAT",
        assignmentId: selectedAssignment.id,
        submissionText: submissionText,
        status: "submitted" as const,
      });
      setSubmissionText("");
      setSelectedAssignment(null);
    }
  };

  const getSubmissionStatus = (assignmentId: number) => {
    return submissions.find(
      (sub) =>
        sub.assignmentId === assignmentId && sub.studentName === "Kong KEAT"
    );
  };

  const getStatusBadge = (assignment: any) => {
    const submission = getSubmissionStatus(assignment.id);
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();

    if (submission) {
      if (submission.grade !== undefined) {
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Graded
          </Badge>
        );
      }
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
          Submitted
        </Badge>
      );
    }

    if (now > dueDate) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          Overdue
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        Pending
      </Badge>
    );
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                My Assignments
              </h1>
              <p className="text-gray-600 mt-1">
                View and submit your course assignments
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                {assignments.length} Total
              </Badge>
              <Badge className="bg-green-50 text-green-700 border-green-200">
                {assignments.filter((a) => getSubmissionStatus(a.id)).length}{" "}
                Submitted
              </Badge>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/80 backdrop-blur-sm border-gray-200 focus:ring-2 focus:ring-purple-500 shadow-sm"
              />
            </div>
          </div>

          {/* Assignment Submission Modal */}
          {selectedAssignment && (
            <Card className="mb-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle className="text-gray-800">
                  Submit Assignment: {selectedAssignment.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Instructions:
                  </p>
                  <p className="text-gray-800 leading-relaxed">
                    {selectedAssignment.description}
                  </p>
                </div>
                <Textarea
                  placeholder="Enter your submission..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  rows={6}
                  className="border-gray-200 focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Assignment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedAssignment(null)}
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assignments List */}
          <div className="space-y-6">
            {filteredAssignments.map((assignment) => {
              const submission = getSubmissionStatus(assignment.id);
              const dueDate = new Date(assignment.dueDate);
              const isOverdue = new Date() > dueDate;

              return (
                <Card
                  key={assignment.id}
                  className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                            <FileText className="w-5 h-5 text-purple-600" />
                          </div>
                          <h3 className="font-semibold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">
                            {assignment.title}
                          </h3>
                          {getStatusBadge(assignment)}
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Due: {dueDate.toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-1" />
                            {assignment.course}
                          </span>
                          <span className="flex items-center font-medium">
                            {assignment.points} points
                          </span>
                        </div>

                        <p className="text-gray-700 mb-6 leading-relaxed">
                          {assignment.description}
                        </p>

                        {submission && (
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                Submitted on{" "}
                                {new Date(
                                  submission.submittedAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            {submission.grade !== undefined && (
                              <p className="text-sm text-green-700 font-medium">
                                Grade: {submission.grade}/{assignment.points}{" "}
                                points
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="ml-6">
                        {!submission && !isOverdue && (
                          <Button
                            onClick={() => setSelectedAssignment(assignment)}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Submit
                          </Button>
                        )}
                        {isOverdue && !submission && (
                          <div className="flex items-center text-red-600">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Overdue</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No assignments found
                </h3>
                <p className="text-gray-500">
                  Check back later for new assignments!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentAssignmentPageComponent;
