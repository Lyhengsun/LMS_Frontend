import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserRole(): "student" | "instructor" | "admin" {
  // Check if window is defined (client-side)
  if (typeof window !== "undefined") {
    const role = localStorage.getItem("userRole");

    // Ensure we return a valid role, defaulting to student if invalid
    if (role === "admin" || role === "instructor" || role === "student") {
      return role;
    }
  }

  return "student";
}

export function isLoggedIn(): boolean {
  return localStorage.getItem("isLoggedIn") === "true";
}

export function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userRole");
}
