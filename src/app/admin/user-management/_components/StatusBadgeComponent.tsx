import { Badge } from "@/components/ui/badge";
import User from "@/src/type/User";
import React from "react";

const StatusBadgeComponent = ({ user }: { user: User }) => {
  const status =
    user.isApproved && user.isVerified && !user.isDisabled
      ? "active"
      : "disabled";
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Active
        </Badge>
      );
    case "disabled":
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          Disabled
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
          Unknown
        </Badge>
      );
  }
};

export default StatusBadgeComponent;
