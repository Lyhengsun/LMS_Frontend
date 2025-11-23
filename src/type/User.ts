import z from "zod";
import { updateProfileSchema } from "../lib/zod/userSchema";

type User = {
  id: string;
  fullName: string;
  email: string;
  bio?: string;
  role: "ROLE_STUDENT" | "ROLE_INSTRUCTOR" | "ROLE_ADMIN";
  isVerified: boolean;
  isDisabled: boolean;
  isApproved: boolean;
  phoneNumber?: string;
  bakongAccountId?: string;
  avatarUrl?: string;
  createdAt: string;
  editedAt: string;
}

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>

export default User;