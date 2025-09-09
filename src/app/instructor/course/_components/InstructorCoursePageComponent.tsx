"use client";
import { Button } from "@/components/ui/button";
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
import CourseCardComponent from "@/src/app/(student)/my-course/_components/CourseCardComponent";
import Course from "@/src/type/Course";
import {
  deleteCourseByIdAction,
  getCourseByAuthorAction,
} from "@/src/action/courseAction";
import { toast } from "sonner";
import CreateCourseFormComponent from "./CreateCourseFormComponent";
import Category from "@/src/type/Category";
import CustomPaginationOnClick from "@/src/app/_components/CustomPaginationOnClick";

const InstructorCoursePageComponent = ({
  categories,
}: {
  categories: Category[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const loadCourses = async () => {
    const data = await getCourseByAuthorAction(page, 8);
    console.log("data : ", data);

    if (data.success) {
      setCourses(data.data?.items!);
      setMaxPage(data.data?.pagination.totalPages ?? 1);
    } else {
      toast.error("Failed to load courses for current author");
    }
  };

  useEffect(() => {
    if (!isCreateDialogOpen) {
      loadCourses();
    }
  }, [page, isCreateDialogOpen]);

  const onDeleteClick = async (courseId: number) => {
    const deletedCourseRes = await deleteCourseByIdAction(courseId);
    console.log("deletedCourseRes : ", deletedCourseRes);
    if (deletedCourseRes.success) {
      loadCourses();
      toast.success("Deleted Course successfully");
    } else {
      toast.error("Failed to delete the course", {
        description: deletedCourseRes.message as string,
      });
    }
  };

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
                onDeleteClick={() => onDeleteClick(course.id)}
              />
            ))}
          </div>
          {
            courses.length > 1 &&
          <CustomPaginationOnClick
            currentPage={page}
            maxPage={maxPage}
            nextOnClick={() => {
              if (page < maxPage) {
                setPage((p) => p + 1);
              }
            }}
            previousOnClick={() => {
              if (page > 1) {
                setPage((p) => p - 1);
              }
            }}
          />
          }
        </div>
      </main>
    </div>
  );
};

export default InstructorCoursePageComponent;
