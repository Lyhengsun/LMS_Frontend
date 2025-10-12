"use client";
import { useCourseProgressStore } from "@/src/components/CourseProgress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Filter,
  PlayCircle,
  Search,
  Users,
  ArrowUpDown,
  GraduationCap,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import Course from "@/src/type/Course";
import Category from "@/src/type/Category";
import CourseCardComponent from "./CourseCardComponent";
import { joinCourseByCourseIdAction, getCourseForStudentAction } from "@/src/action/courseAction";
import { getCategoryAction } from "@/src/action/categoryAction";
import useDebounce from "@/src/lib/hooks/useDebounce";
import { toast } from "sonner";

const MyCoursePageComponent = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTermDebounce = useDebounce(searchTerm, 300);
  const [filterCategory, setFilterCategory] = useState<string | undefined>("all");
  const [filterLevel, setFilterLevel] = useState<string | undefined>("all");
  const [sortBy, setSortBy] = useState<"COURSE_NAME" | "CREATED_AT">("CREATED_AT");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [page, setPage] = useState(1);
  const [oldPage, setOldPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const { ref, inView } = useInView();
  const router = useRouter();

  const { startCourse } = useCourseProgressStore();

  // Load courses with pagination
  const loadCourses = async () => {
    const categoryId = filterCategory === "all" ? undefined : filterCategory;
    const level = filterLevel === "all" ? undefined : filterLevel;
    const data = await getCourseForStudentAction(
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
      toast.error("Failed to fetch courses");
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

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await getCategoryAction();
        if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Load courses when page changes
  useEffect(() => {
    console.log("load courses");
    updateCourses();
  }, [page]);

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

  const handleStartLearning = async (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      startCourse(courseId, course.lessons.length);
      joinCourseByCourseIdAction(courseId);
      router.push(`/my-course/${courseId}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-full w-full flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

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

        {/* Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {courses.map((course, index) => {
            return (
              <div key={course.id}>
                {index === courses.length - 1 && hasNextPage && (
                  <div ref={ref}></div>
                )}
                <CourseCardComponent
                  course={course}
                  handleStartLearning={handleStartLearning}
                />
              </div>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No courses found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursePageComponent;
