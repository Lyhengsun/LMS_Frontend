"use client";
import { Sidebar } from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Clock,
  Edit,
  HelpCircle,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import React, { useState } from "react";

const InstructorQuizPageComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const quizzes = [
    {
      id: 1,
      title: "React Fundamentals Quiz",
      course: "React Development",
      questions: 15,
      duration: "30 min",
      attempts: 42,
      totalStudents: 45,
      averageScore: 78,
      status: "active",
    },
    {
      id: 2,
      title: "JavaScript Functions Test",
      course: "JavaScript Fundamentals",
      questions: 20,
      duration: "45 min",
      attempts: 28,
      totalStudents: 32,
      averageScore: 85,
      status: "active",
    },
    {
      id: 3,
      title: "Final Assessment",
      course: "Web Development",
      questions: 30,
      duration: "60 min",
      attempts: 0,
      totalStudents: 28,
      averageScore: 0,
      status: "draft",
    },
  ];

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.course.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Quizzes
              </h1>
              <p className="text-gray-600 mt-1">
                Create and manage course quizzes
              </p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {/* Search and Create Button */}
          <div className="mb-6 flex items-center justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  style={{ backgroundColor: "hsl(var(--instructor-primary))" }}
                  className="text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quiz
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Quiz</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder="Quiz title" />
                  <Input placeholder="Course" />
                  <Input type="number" placeholder="Number of questions" />
                  <Input type="number" placeholder="Duration (minutes)" />
                  <Button className="w-full">Create Quiz</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Quizzes List */}
          <div className="space-y-4">
            {filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {quiz.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Course: {quiz.course}
                      </p>
                    </div>
                    <Badge
                      className={
                        quiz.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {quiz.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <HelpCircle className="w-4 h-4" />
                        <span>{quiz.questions} questions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{quiz.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {quiz.attempts}/{quiz.totalStudents} attempts
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart className="w-4 h-4" />
                        <span>{quiz.averageScore}% avg</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorQuizPageComponent;
