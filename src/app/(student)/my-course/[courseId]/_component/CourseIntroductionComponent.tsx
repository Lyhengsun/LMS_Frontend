"use client";
import React from "react";

import { BookOpen, Users, Award, Play, Lock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Course from "@/src/type/Course";

export interface CourseIntroductionProps {
  course: Course;
  onStartCourse: () => void;
  onPurchaseCourse?: () => void;
}

export function CourseIntroductionComponent({
  course,
  onStartCourse,
  onPurchaseCourse,
}: CourseIntroductionProps) {
  const totalMinutes = course.duration;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Helper function to determine if course is free
  const isFree = course.price === 0 || !course.price;

  // Helper function to render pricing badge
  const renderPricingBadge = () => {
    if (isFree) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
          <DollarSign className="w-4 h-4" />
          Free
        </span>
      );
    }

    if (!course.isAccessible) {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
          <Lock className="w-4 h-4" />
          Locked
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
        <DollarSign className="w-4 h-4" />${course.price}
      </span>
    );
  };

  return (
    <div className="w-full p-6">
      {/* Hero Section with Thumbnail */}
      <div className="flex space-x-6">
        <div className="relative mb-12 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 aspect-video flex-1 flex items-center justify-center">
          <img
            src={
              `${process.env.BASE_API_URL}/files/preview-file/${course.thumbnail}` ||
              "/images/no-image.jpg"
            }
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center hover:bg-black/50 transition-colors">
            <Button
              size="lg"
              className="rounded-full w-16 h-16 flex items-center justify-center"
              onClick={onStartCourse}
              disabled={!course.isAccessible && !isFree}
            >
              {course.isAccessible ? (
                <Play className="w-6 h-6" fill="white" />
              ) : (
                <Lock className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Course Header */}
        <div className="mb-8 flex-1">
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              {course.category}
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-black text-sm font-medium">
              <Award className="w-4 h-4" />
              {course.level}
            </span>
            {renderPricingBadge()}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 line leading-16">
            {course.title}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed text-balance mb-6">
            {course.description}
          </p>

          {/* Course Stats */}
          <div className="grid grid-cols-3 gap-6 py-6 border-y border-border">
            <div>
              <div className="text-3xl font-bold text-primary">
                {hours}h {minutes}m
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Total Duration
              </p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary flex items-center gap-2">
                <Users className="w-6 h-6" />
                {course.students.toLocaleString()}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Students</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">
                {course.lessons.length}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Lessons</p>
            </div>
          </div>

          {/* Availability Status */}
          {course.courseAvailability && (
            <div className="py-6 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">
                Availability:{" "}
                <span className="font-semibold text-foreground">
                  {course.courseAvailability}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Pricing Info & Call to Action */}
      {!course.isAccessible && !isFree && (
        <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-end">
          <div className="flex-2">
            <p className="text-amber-900 font-semibold mb-2">
              Unlock this course
            </p>
            <p className="text-amber-800 text-sm mb-3">
              This is a premium course. Purchase access to start learning.
            </p>
            <p className="text-3xl font-bold text-amber-900">
              Price: ${course.price}
            </p>
          </div>

          <Button
            size="lg"
            onClick={onPurchaseCourse}
            className="flex-1 bg-amber-500 hover:bg-amber-600"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Purchase Now
          </Button>
        </div>
      )}

      {/* Instructor Section */}
      <div className="mb-8 p-6 bg-card rounded-lg border border-border">
        <h2 className="text-xl font-semibold mb-3">Instructor</h2>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-lg">
              {course.instructor.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-foreground">{course.instructor}</p>
            <p className="text-sm text-muted-foreground">
              Expert instructor with years of experience
            </p>
          </div>
        </div>
      </div>

      {/* What You'll Learn */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">What You'll Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Master core concepts and fundamentals",
            "Build real-world projects",
            "Best practices and industry standards",
            "Problem-solving techniques",
          ].map((item, idx) => (
            <div key={idx} className="flex gap-3 p-4 rounded-lg bg-primary/5">
              <div className="flex-shrink-0">
                <Check className="w-5 h-5 text-primary mt-0.5" />
              </div>
              <p className="text-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        {course.isAccessible || isFree ? (
          <>
            <Button size="lg" onClick={onStartCourse} className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Start Learning Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 bg-transparent border-black hover:bg-gray-200"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to Top
            </Button>
          </>
        ) : (
          <>
            <Button
              size="lg"
              onClick={onPurchaseCourse}
              className="flex-1"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Purchase Course 
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 bg-transparent border-black hover:bg-gray-200"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to Top
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// Check Icon Component
function Check({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
