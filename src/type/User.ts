type User = {
  id: string;
  fullName: string;
  email: string;
  bio: string;
  role: "ROLE_STUDENT" | "ROLE_INSTRUCTOR" | "ROLE_ADMIN";
  isVerified: boolean;
  isDisabled: boolean;
  isApproved: boolean;
  phoneNumber?: string;
  avatarUrl?: string;
  createdAt: string;
  editedAt: string;
}

export default User;