"use client";

import { z } from "zod";

export const createCourseSchema = z.object({
  courseName: z.string().trim(),
  courseDescription: z.string().trim(),
  level: z.enum(
    ["BEGINNER", "INTERMEDIATE", "ADVANCE"],
    "Only BEGINNER, INTERMEDIATE, ADVANCE is allowed"
  ),
  // maxPoints: z
  //   .string(),
  // .min(10, "Max points need to be higher than 10 points")
  // .max(100, "Max points can't be higher than 100 points"),
  courseCategoryId: z.string(),
  courseAvailability: z.enum(
    ["FREE", "PAID", "PARTIAL"],
    "Only FREE, PAID, PARTIAL is allowed"
  ),
  price: z.string().trim(),
});

export const createCourseContentSchema = z.object({
  courseContentName: z.string().trim(),
  points: z.string().trim(),
  durationMinutes: z.string().trim(),
  requirePayment: z.enum(["true", "false"], "Require Payment need to be a boolean"),
  // durationMinutes: z.coerce.number<string>().min(1, "Duration Minutes can't be under 1 minute"),
});
