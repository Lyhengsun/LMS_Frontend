import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Ban,
  CheckCircle,
  Eye,
  GraduationCap,
  Key,
  MoreVertical,
  Search,
  Shield,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import RoleBadgeComponent from "./RoleBadgeComponent";
import RoleIconComponent from "./RoleIconComponent";
import StatusBadgeComponent from "./StatusBadgeComponent";

const AllUserTabComponent = ({ users }: { users: any }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserAction = (
    userId: string,
    action: "enable" | "disable" | "revoke" | "delete",
    userName: string
  ) => {
    const actionMessages = {
      enable: `Are you sure you want to enable ${userName}?`,
      disable: `Are you sure you want to disable ${userName}?`,
      revoke: `Are you sure you want to revoke access for ${userName}?`,
      delete: `Are you sure you want to delete ${userName}? This action cannot be undone.`,
    };

    const confirmed = window.confirm(actionMessages[action]);
    if (confirmed) {
      if (action === "delete") {
        // Note: map to server to delete user
        // setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        // Also remove from localStorage if it's an admin-created user
      } else {
        // setUsers((prevUsers) =>
        //   prevUsers.map((user) =>
        //     user.id === userId
        //       ? {
        //           ...user,
        //           status:
        //             action === "enable"
        //               ? "active"
        //               : (action as "disabled" | "revoked"),
        //         }
        //       : user
        //   )
        // );
      }

      const message = `User ${
        action === "enable"
          ? "Enabled"
          : action === "disable"
          ? "Disabled"
          : action === "revoke"
          ? "Revoked"
          : "Deleted"
      }`;

      const description = `${userName} has been ${
        action === "enable"
          ? "enabled"
          : action === "disable"
          ? "disabled"
          : action === "revoke"
          ? "revoked"
          : "deleted"
      }`;

      if (action === "revoke" || action === "delete") {
        toast.warning(message, {
          description: description,
        });
      } else {
        toast.message(message, {
          description: description,
        });
      }
    }
  };

	function handleViewUser(user: any): void {
		throw new Error("Function not implemented.");
	}

	function handleResetPassword(user: any): void {
		throw new Error("Function not implemented.");
	}

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center dark:text-white">
            <Users className="w-5 h-5 mr-2" />
            All Users
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  User
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Role
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Status
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Last Active
                </th>
                <th className="text-left py-3 px-2 font-medium text-gray-700 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                        style={{
                          backgroundColor: "hsl(var(--admin-primary))",
                        }}
                      >
                        <span className="text-white text-xs font-bold">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                          {user.mustChangePassword && (
                            <Badge className="ml-2 bg-yellow-100 text-yellow-800 text-xs">
                              Must Change Password
                            </Badge>
                          )}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      <RoleIconComponent role={user.role} />
                      <RoleBadgeComponent role={user.role} />
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <StatusBadgeComponent status={user.status} />
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">
                    {user.lastActive}
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center space-x-2">
                      {user.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUserAction(user.id, "disable", user.name)
                          }
                          className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                        >
                          <Ban className="w-3 h-3 mr-1" />
                          Disable
                        </Button>
                      )}

                      {user.status === "disabled" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUserAction(user.id, "enable", user.name)
                            }
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Enable
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleUserAction(user.id, "revoke", user.name)
                            }
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Revoke
                          </Button>
                        </>
                      )}

                      {user.status === "revoked" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUserAction(user.id, "enable", user.name)
                          }
                          className="text-green-600 border-green-200 hover:bg-green-50"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Enable
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleViewUser(user)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleResetPassword(user)}
                          >
                            <Key className="w-4 h-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUserAction(user.id, "delete", user.name)
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllUserTabComponent;