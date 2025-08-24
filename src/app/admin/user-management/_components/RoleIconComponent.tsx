import { GraduationCap, Shield, Users } from 'lucide-react';
import React from 'react'

const RoleIconComponent = ({role = "ROLE_STUDENT"} : {
      role?: "ROLE_ADMIN" | "ROLE_INSTRUCTOR" | "ROLE_STUDENT";
}) => {
        switch (role) {
      case "ROLE_ADMIN":
        return <Shield className="w-4 h-4" />;
      case "ROLE_INSTRUCTOR":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
}

export default RoleIconComponent