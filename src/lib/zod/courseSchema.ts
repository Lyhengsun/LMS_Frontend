"use client";

import { z } from "zod";

export const createCourseSchema = z.object({
  courseName: z.string().trim(),
  courseDescription: z.string().trim(),
  level: z.enum(
    ["BEGINNER", "INTERMEDIATE", "ADVANCE"],
    "Only BEGINNER, INTERMEDIATE, ADVANCE is allowed"
  ),
  maxPoints: z.coerce
    .number<string>("Max point need to be integer")
    .min(10, "Max points need to be 10 or higher")
    .max(100, "Max points can't be higher than 100 points"),
  courseCategoryId: z.string(),
});

export const createCourseContentSchema = z.object({
  courseContentName: z.string().trim(),
  durationMinutes: z.coerce.number<string>().min(1, "Duration Minutes can't be under 1 minute"),
})
