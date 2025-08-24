"use client";

import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(8, "password must be higher than 8 characters"),
});
