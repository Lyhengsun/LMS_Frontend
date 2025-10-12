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
import { Plus, Search, Filter, ArrowUpDown, ArrowUpDownIcon } from "lucide-react";

import React, { useEffect, useState } from "react";
import Course, { DraftCourse } from "@/src/type/Course";
import {
  deleteCourseByIdAction,
  getCourseByAuthorAction,
  submitDraftCourseForInstructorAction,
} from "@/src/action/courseAction";
import { getCategoryAction } from "@/src/action/categoryAction";
import { toast } from "sonner";
import CreateCourseFormComponent from "./CreateCourseFormComponent";
import Category from "@/src/type/Category";
import InstructorCourseCardComponent from "./InstructorCourseCardComponent";
import CustomYesNoPopUp from "@/src/app/_components/CustomYesNoPopUp";
import useDebounce from "@/src/lib/hooks/useDebounce";
import { useInView } from "react-intersection-observer";

const InstructorCoursePageComponent = ({
  categories: initialCategories,
}: {
  categories: Category[];
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchTermDebounce = useDebounce(searchTerm, 300);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [courses, setCourses] = useState<DraftCourse[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | undefined>("all");
  const [filterLevel, setFilterLevel] = useState<string | undefined>("all");
  const [sortBy, setSortBy] = useState<"COURSE_NAME" | "CREATED_AT">("CREATED_AT");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [page, setPage] = useState(1);
  const [oldPage, setOldPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const { ref, inView } = useInView();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  // Load courses with pagination and filters
  const loadCourses = async () => {
    const categoryId = filterCategory === "all" ? undefined : filterCategory;
    const level = filterLevel === "all" ? undefined : filterLevel;
    const data = await getCourseByAuthorAction(
      page,
      12, // page size
      searchTermDebounce,
      categoryId as any,
      level as any,
      sortBy as "COURSE_NAME" | "CREATED_AT",
      sortOrder as "ASC" | "DESC"
    );
    
    if (data.success) {
      const pagination = data.data?.pagination;
      setHasNextPage(pagination!.currentPage < pagination!.totalPages);
      return data.data?.items!;
    } else {
      toast.error("Failed to load courses for current author");
      setHasNextPage(false);
    }
  };

  // Update courses based on page changes
  const updateCourses = async () => {
    console.log("update courses");
    if (page === 1) {
      const newLoadedCourses = await loadCourses();
      setCourses(newLoadedCourses!);
    }
    if (oldPage < page) {
      const newLoadedCourses = await loadCourses();
      setCourses((prevCourses) => [...prevCourses, ...newLoadedCourses!]);
    }
    setOldPage(page);
  };

  // Load courses when page changes
  useEffect(() => {
    console.log("load courses");
    if (!isCreateDialogOpen) {
      updateCourses();
    }
  }, [page]);

  // Reload courses when dialog closes (after creating a new course)
  useEffect(() => {
    if (!isCreateDialogOpen && oldPage === page) {
      const reloadCourses = async () => {
        const courses = await loadCourses();
        if (courses) {
          setCourses(courses);
        }
      };
      reloadCourses();
    }
  }, [isCreateDialogOpen]);

  // Trigger page increment when scrolled to bottom
  useEffect(() => {
    if (inView && hasNextPage) {
      setPage(page + 1);
    }
  }, [inView]);

  // Update course list when searching
  useEffect(() => {
    setPage(1);
    const reloadCourses = async () => {
      const courses = await loadCourses();
      if (courses) {
        setCourses(courses);
      }
    };

    if (oldPage === page) {
      reloadCourses();
    }
  }, [searchTermDebounce]);

  // Update course list when category filter changes
  useEffect(() => {
    setPage(1);
    const reloadCourses = async () => {
      const courses = await loadCourses();
      if (courses) {
        setCourses(courses);
      }
    };

    if (oldPage === page) {
      reloadCourses();
    }
  }, [filterCategory]);

  // Update course list when level filter changes
  useEffect(() => {
    setPage(1);
    const reloadCourses = async () => {
      const courses = await loadCourses();
      if (courses) {
        setCourses(courses);
      }
    };

    if (oldPage === page) {
      reloadCourses();
    }
  }, [filterLevel]);

  // Update course list when sorting changes
  useEffect(() => {
    setPage(1);
    const reloadCourses = async () => {
      const courses = await loadCourses();
      if (courses) {
        setCourses(courses);
      }
    };

    if (oldPage === page) {
      reloadCourses();
    }
  }, [sortBy, sortOrder]);

  // Handler to show delete confirmation
  const handleDeleteClick = (courseId: number) => {
    setSelectedCourseId(courseId);
    setDeleteDialogOpen(true);
  };

  // Actual delete action after confirmation
  const onDeleteConfirm = async () => {
    if (selectedCourseId === null) return;

    const deletedCourseRes = await deleteCourseByIdAction(selectedCourseId);
    console.log("deletedCourseRes : ", deletedCourseRes);
    if (deletedCourseRes.success) {
      // Reset to page 1 and reload courses
      setPage(1);
      const reloadedCourses = await loadCourses();
      if (reloadedCourses) {
        setCourses(reloadedCourses);
      }
      toast.success("Deleted Course successfully");
    } else {
      toast.error("Failed to delete the course", {
        description: deletedCourseRes.message as string,
      });
    }
  };

  // Handler to show submit confirmation
  const handleSubmitClick = (courseId: number) => {
    setSelectedCourseId(courseId);
    setSubmitDialogOpen(true);
  };

  // Actual submit action after confirmation
  const onSubmitConfirm = async () => {
    if (selectedCourseId === null) return;

    const submitCourseRes = await submitDraftCourseForInstructorAction(
      selectedCourseId
    );
    console.log("submitCourseRes : ", submitCourseRes);
    if (submitCourseRes.success) {
      // Reset to page 1 and reload courses
      setPage(1);
      const reloadedCourses = await loadCourses();
      if (reloadedCourses) {
        setCourses(reloadedCourses);
      }
      toast.success("Course submitted for approval successfully");
    } else {
      toast.error("Failed to submit the course", {
        description: submitCourseRes.message as string,
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
        <div className="container mx-auto p-8">
          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>

            <ArrowUpDown className="w-4 h-4 text-gray-500 ml-2" />

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "COURSE_NAME" | "CREATED_AT")}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CREATED_AT">Date Created</option>
              <option value="COURSE_NAME">Course Name</option>
            </select>

            {/* Sort Order */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "ASC" | "DESC")}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </select>
          </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {courses.map((course, index) => {
              return (
                <div key={course.id}>
                  {index === courses.length - 1 && hasNextPage && (
                    <div ref={ref}></div>
                  )}
                  <InstructorCourseCardComponent
                    course={course}
                    onDeleteClick={() => handleDeleteClick(course.id)}
                    onSubmitClick={() => handleSubmitClick(course.id)}
                  />
                </div>
              );
            })}
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No courses found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </main>
      {/* Delete Confirmation Dialog */}
      <CustomYesNoPopUp
        title="Delete Course"
        description="Are you sure you want to delete this course? This action cannot be undone."
        viewDialogOpenState={deleteDialogOpen}
        setViewDialogOpenState={setDeleteDialogOpen}
        onClickYes={onDeleteConfirm}
        onClickNo={() => setSelectedCourseId(null)}
      />

      {/* Submit Confirmation Dialog */}
      <CustomYesNoPopUp
        title="Submit Course for Approval"
        description="Are you sure you want to submit this course for approval? Once submitted, you won't be able to edit it until it's reviewed."
        viewDialogOpenState={submitDialogOpen}
        setViewDialogOpenState={setSubmitDialogOpen}
        onClickYes={onSubmitConfirm}
        onClickNo={() => setSelectedCourseId(null)}
      />
    </div>
  );
};

export default InstructorCoursePageComponent;
