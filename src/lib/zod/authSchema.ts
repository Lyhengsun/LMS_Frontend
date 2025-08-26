"use client";

import { email, z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .trim()
    .min(8, "password must be higher than 8 characters"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name can't be empty")
    .max(50, "Full name can't be over 50 characters"),
  email: z.email(),
  password: z
    .string()
    .trim()
    .min(8, "password must be higher than 8 characters"),
  phoneNumber: z.string().regex(/^0\d{8,9}$/, "Invalid Cambodia Phone Number format. Ex: 012345678"),
  roleId: z.enum(["2", "3"], "Only Student and Instructor role allowed."),
});
