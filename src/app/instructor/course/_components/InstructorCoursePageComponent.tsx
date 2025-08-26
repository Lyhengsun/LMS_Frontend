"use client";
import { Sidebar } from "@/src/components/Sidebar";
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
  BookOpen,
  Clock,
  Edit,
  Eye,
  Plus,
  Search,
  Star,
  Trash2,
  Users,
} from "lucide-react";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const createCourseFormSchema = z.object({
  courseName: z.string().trim(),
  courseDescription: z.string().trim(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCE"]),
  maxPoints: z.number(),
});

const InstructorCoursePageComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof createCourseFormSchema>>({
    resolver: zodResolver(createCourseFormSchema),
  });

  const courses = [
    {
      id: 1,
      title: "React Development Masterclass",
      description:
        "Complete guide to React development with hooks and modern patterns",
      instructor: "guy",
      students: 45,
      lessons: [{}, {}],
      isPublic: true,
      duration: "40",
      createdAt: "2024-01-15",
      thumbnail:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop",
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      description: "Learn JavaScript from basics to advanced concepts",
      instructor: "guy",
      students: 32,
      lessons: [{}, {}],
      isPublic: true,
      duration: "40",
      createdAt: "2024-02-01",
      thumbnail:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop",
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      description: "Full-stack web development course",
      instructor: "guy",
      students: 28,
      lessons: [{}, {}],
      isPublic: false,
      duration: "40",
      createdAt: "2024-02-15",
      thumbnail:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop",
    },
  ];

  const handleViewCourse = (courseId: number) => {
    router.push(`/instructor/course/view-course/${courseId}`);
  };

  const handleEditCourse = (courseId: number) => {
    router.push(`/instructor/course/edit-course/${courseId}`);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-gray-600 mt-1">Create and manage your courses</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Create Course Button */}
          <div className="mb-8 flex justify-end">
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={}></form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search and Filter */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id}>
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-36 object-cover rounded-t-lg"
                />
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-shadow rounded-t-none pt-3"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 flex-col">
                        <div className="flex-1 flex justify-between items-center mb-2">
                          <CardTitle className="text-lg line-clamp-1">
                            {course.title}
                          </CardTitle>
                          <Badge
                            className={
                              course.isPublic
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {course.isPublic ? "approved" : "pending"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 h-10">
                          {course.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{course.students} students</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.lessons.length} lessons</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration} minutes</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-start space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCourse(course.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditCourse(course.id)}
                        >
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
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorCoursePageComponent;
