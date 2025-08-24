import { Badge } from "@/components/ui/badge";
import React from "react";

const RoleBadgeComponent = ({
  role = "ROLE_STUDENT",
}: {
  role?: "ROLE_ADMIN" | "ROLE_INSTRUCTOR" | "ROLE_STUDENT";
}) => {
  switch (role) {
    case "ROLE_ADMIN":
      return (
        <Badge
          style={{
            backgroundColor: "hsl(var(--admin-accent))",
            color: "hsl(var(--admin-primary))",
          }}
        >
          Admin
        </Badge>
      );
    case "ROLE_INSTRUCTOR":
      return (
        <Badge
          style={{
            backgroundColor: "hsl(var(--instructor-accent))",
            color: "hsl(var(--instructor-primary))",
          }}
        >
          Instructor
        </Badge>
      );
    default:
      return (
        <Badge
          style={{
            backgroundColor: "hsl(var(--student-accent))",
            color: "hsl(var(--student-primary))",
          }}
        >
          Student
        </Badge>
      );
  }
};

export default RoleBadgeComponent;
