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
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import RoleBadgeComponent from "./RoleBadgeComponent";
import RoleIconComponent from "./RoleIconComponent";
import StatusBadgeComponent from "./StatusBadgeComponent";
import User from "@/src/type/User";
import {
  deleteUserByIdAction,
  disableUserByIdAction,
  getAllUserForAdminAction,
} from "@/src/action/userAction";
import CustomPaginationOnClick from "@/src/app/_components/CustomPaginationOnClick";
import CustomPopUp from "@/src/app/_components/CustomPopUp";
import CustomYesNoPopUp from "@/src/app/_components/CustomYesNoPopUp";

const AllUserTabComponent = ({
  handleViewUser,
}: {
  handleViewUser: Function;
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [viewUserActionDialog, setViewUserActionDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [actionState, setActionState] = useState<
    "enable" | "disable" | "delete"
  >();

  const actionMessages = {
    enable: `Are you sure you want to enable ${selectedUser?.fullName}?`,
    disable: `Are you sure you want to disable ${selectedUser?.fullName}?`,
    delete: `Are you sure you want to delete ${selectedUser?.fullName}? This action cannot be undone.`,
  };

  // load user data
  const loadUser = async () => {
    const res = await getAllUserForAdminAction(currentPage, 5, true);
    setMaxPage(res?.pagination?.totalPages);
    setUsers(res?.users as User[]);
  };

  useEffect(() => {
    loadUser();
  }, [currentPage]);

  // const filteredUsers = users.filter(
  //   (user) =>
  //     user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const handleUserAction = (
    user: User,
    action: "enable" | "disable" | "delete"
  ) => {
    setSelectedUser(user);
    setActionState(action);
    setViewUserActionDialog(true);
  };

  const handleConfirmUserAction = async () => {
    let res;
    if (actionState === "enable") {
      res = disableUserByIdAction(selectedUser?.id as unknown as number, false);
    }
    if (actionState === "disable") {
      res = disableUserByIdAction(selectedUser?.id as unknown as number, true);
    }
    if (actionState === "delete") {
      res = deleteUserByIdAction(selectedUser?.id as unknown as number);
    }

    const message = `User ${
      actionState === "enable"
        ? "Enabled"
        : actionState === "disable"
        ? "Disabled"
        : "Deleted"
    }`;

    loadUser();

    const description = `${selectedUser?.fullName} has been ${
      actionState === "enable"
        ? "enabled"
        : actionState === "disable"
        ? "disabled"
        : "deleted"
    }`;

    if (actionState === "delete") {
      toast.warning(message, {
        description: description,
      });
    } else {
      toast.message(message, {
        description: description,
      });
    }
  };

  function handleResetPassword(user: User): void {
    const newPassword = prompt(`Enter new password for ${user.fullName}:`);
    if (newPassword) {
      // Update admin-created users
      const adminUsers = JSON.parse(localStorage.getItem("adminUsers") || "[]");
      const updatedAdminUsers = adminUsers.map((adminUser: any) =>
        adminUser.id === user.id
          ? { ...adminUser, password: newPassword, mustChangePassword: true }
          : adminUser
      );
      localStorage.setItem("adminUsers", JSON.stringify(updatedAdminUsers));

      // Update local state

      toast.success("Password Reset", {
        description: `Password reset for ${user.fullName}. They must change it on next login.`,
      });
    }
  }

  return (
    <>
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
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
                            {user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {user.fullName}
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
                      <StatusBadgeComponent user={user} />
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center space-x-2">
                        {!user.isDisabled && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUserAction(user, "disable")}
                            className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                          >
                            <Ban className="w-3 h-3 mr-1" />
                            Disable
                          </Button>
                        )}

                        {user.isDisabled && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUserAction(user, "enable")}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Enable
                            </Button>
                          </>
                        )}

                        <DropdownMenu modal={false}>
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
                              onClick={() => handleUserAction(user, "delete")}
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
          <CustomPaginationOnClick
            currentPage={currentPage}
            maxPage={maxPage}
            nextOnClick={() => {
              if (currentPage < maxPage) {
                setCurrentPage((p) => p + 1);
              }
            }}
            previousOnClick={() => {
              if (currentPage > 1) {
                setCurrentPage((p) => p - 1);
              }
            }}
          />
        </CardContent>
      </Card>
      <CustomYesNoPopUp
        title={
          actionState == "enable"
            ? actionMessages.enable
            : actionState == "disable"
            ? actionMessages.disable
            : actionMessages.delete
        }
        viewDialogOpenState={viewUserActionDialog}
        setViewDialogOpenState={setViewUserActionDialog}
        onClickYes={() => {
          handleConfirmUserAction();
        }}
      />
    </>
  );
};

export default AllUserTabComponent;
