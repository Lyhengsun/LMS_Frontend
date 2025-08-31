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
import { Plus, Search } from "lucide-react";

import React, { useEffect, useState } from "react";
import z from "zod";
import CourseCardComponent from "@/src/app/(student)/my-course/_components/CourseCardComponent";
import Course from "@/src/type/Course";
import { getCourseByAuthorAction } from "@/src/action/courseAction";
import { toast } from "sonner";
import CreateCourseFormComponent from "./CreateCourseFormComponent";
import Category from "@/src/type/Category";
import CreateCourseContentFormComponent from "../edit-course/[courseId]/_components/CreateCourseContentFormComponent";

const InstructorCoursePageComponent = ({
  categories,
}: {
  categories: Category[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadCourses = async () => {
      const data = await getCourseByAuthorAction(page, 12);
      console.log("data : ", data);

      if (data.success) {
        setCourses(data.data?.items!);
      } else {
        toast.error("Failed to load courses for current author");
      }
    };

    if (!isCreateDialogOpen) {
      loadCourses();
    }
  }, [page, isCreateDialogOpen]);

  console.log("Courses : ", courses);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
            <p className="text-gray-600 mt-1">Create and manage your courses</p>
          </div>

          {/* Create Course Button */}
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 text-white" />{" "}
                <span>Create Course</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  <span>Create New Course</span>
                </DialogTitle>
              </DialogHeader>
              <CreateCourseFormComponent
                categories={categories}
                onOpenChange={setIsCreateDialogOpen}
              />
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.map((course) => (
              <CourseCardComponent
                key={course.id}
                course={course}
                role="instructor"
                handleStartLearning={() => {}}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstructorCoursePageComponent;
