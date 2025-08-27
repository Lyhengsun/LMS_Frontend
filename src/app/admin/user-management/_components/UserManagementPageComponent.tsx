"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  Fullscreen,
  GraduationCap,
  Plus,
  UserCheck,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import AllUserTabComponent from "./AllUserTabComponent";
import { toast } from "sonner";
import PendingApprovalUserTabComponent from "./PendingApprovalUserTabComponent";
import StatusBadgeComponent from "./StatusBadgeComponent";
import { string } from "zod";
import User from "@/src/type/User";
import { format } from "date-fns";
import CustomPaginationHref from "@/src/app/_components/CustomPaginationHref";

const UserManagementPageComponent = ({
  fetchedUnapprovedUsers,
}: {
  fetchedUnapprovedUsers: { items: User[]; pagination: any };
}) => {
  const { items: pendingRegistrations } = fetchedUnapprovedUsers;
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "ROLE_STUDENT" as "ROLE_STUDENT" | "ROLE_INSTRUCTOR" | "ROLE_ADMIN",
    phone: "",
    password: "",
  });

  const getRoleBadge = (role: string) => {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Active
          </Badge>
        );
      case "disabled":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Disabled
          </Badge>
        );
      case "revoked":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Revoked
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

  const handleApproveRegistration = (
    registrationId: string,
    approved: boolean
  ) => {
    const registration = {
      fullName: "user",
    };
    const title = approved ? "Registration Approved" : "Registration Rejected";
    const description = `${registration.fullName}'s registration has been ${
      approved ? "approved" : "rejected"
    }`;
    if (approved) {
      toast.success(title, {
        description: description,
      });
    } else {
      toast.error(title, {
        description: description,
      });
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const users : User[] = [];

  const userStats = {
    total: users.length,
    students: users.filter((u) => u.role === "ROLE_STUDENT").length,
    instructors: users.filter((u) => u.role === "ROLE_INSTRUCTOR").length,
  };

  return (
    <>
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                User Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage platform users and permissions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* <Dialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    style={{ backgroundColor: "hsl(var(--admin-primary))" }}
                    className="text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogDescription>
                      Add a new user to the platform
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={newUser.firstName}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={newUser.lastName}
                          onChange={(e) =>
                            setNewUser({ ...newUser, lastName: e.target.value })
                          }
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser({ ...newUser, email: e.target.value })
                        }
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Temporary Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        placeholder="Enter temporary password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(
                          value:
                            | "ROLE_STUDENT"
                            | "ROLE_INSTRUCTOR"
                            | "ROLE_ADMIN"
                        ) => setNewUser({ ...newUser, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ROLE_STUDENT">Student</SelectItem>
                          <SelectItem value="ROLE_INSTRUCTOR">
                            Instructor
                          </SelectItem>
                          <SelectItem value="ROLE_ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        value={newUser.phone}
                        onChange={(e) =>
                          setNewUser({ ...newUser, phone: e.target.value })
                        }
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog> */}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users
                    className="w-8 h-8"
                    style={{ color: "hsl(var(--admin-primary))" }}
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userStats.total}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <UserCheck className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Students
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userStats.students}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <GraduationCap className="w-8 h-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">
                      Instructors
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userStats.instructors}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-orange-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {pendingRegistrations.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Users and Pending Registrations */}
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">All Users</TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pending Registrations
                {pendingRegistrations.length > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white text-xs">
                    {pendingRegistrations.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <AllUserTabComponent handleViewUser={handleViewUser} />
            </TabsContent>

            <TabsContent value="pending">
              <PendingApprovalUserTabComponent />
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* User Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">User Details</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Detailed information about the user
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "hsl(var(--admin-primary))" }}
                >
                  <span className="text-white text-xl font-bold">
                    {selectedUser.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold dark:text-white">
                    {selectedUser.fullName}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedUser.email}
                  </p>
                  {getRoleBadge(selectedUser.role)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.fullName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.phoneNumber || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </p>
                  <StatusBadgeComponent user={selectedUser} />
                  {/* {getStatusBadge(selectedUser.isApproved)} */}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Verified
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.isVerified ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Unverified
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Created Date
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(
                      new Date(selectedUser.createdAt),
                      "dd/MM/yyyy hh:mm:ss a"
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagementPageComponent;
