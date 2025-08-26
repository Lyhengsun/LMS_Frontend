import z from "zod";
import { loginSchema, registerSchema } from "../lib/zod/authSchema";

export type LoginData = z.infer<typeof loginSchema>;

export type RegisterData = z.infer<typeof registerSchema>;
