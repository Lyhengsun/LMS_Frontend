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
  GraduationCap,
  Plus,
  UserCheck,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import AllUserTabComponent from "./AllUserTabComponent";
import { toast } from "sonner";
import PendingApprovalUserTabComponent from "./PendingApprovalUserTabComponent";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ROLE_STUDENT" | "ROLE_INSTRUCTOR" | "ROLE_ADMIN";
  status: "active" | "disabled" | "revoked";
  joinDate: string;
  lastActive: string;
  courses?: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  mustChangePassword?: boolean;
}

interface PendingRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "ROLE_STUDENT" | "ROLE_INSTRUCTOR";
  phone?: string;
  registrationDate: string;
  status: "pending";
}

const UserManagementPageComponent = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pendingRegistrations, setPendingRegistrations] = useState<
    PendingRegistration[]
  >([]);
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

  // Load users and pending registrations
  useEffect(() => {
    const loadData = () => {
      const demoUsers: User[] = [
        {
          id: "1",
          name: "Kong KEAT",
          email: "student@test.com",
          role: "ROLE_STUDENT",
          status: "active",
          joinDate: "2024-01-15",
          lastActive: "2 hours ago",
          courses: 3,
          firstName: "Kong",
          lastName: "KEAT",
          phone: "+60123456789",
        },
        {
          id: "2",
          name: "John Smith",
          email: "instructor@test.com",
          role: "ROLE_INSTRUCTOR",
          status: "active",
          joinDate: "2023-12-05",
          lastActive: "30 minutes ago",
          firstName: "John",
          lastName: "Smith",
          phone: "+60198765432",
        },
        {
          id: "3",
          name: "Admin User",
          email: "admin@test.com",
          role: "ROLE_ADMIN",
          status: "active",
          joinDate: "2023-11-01",
          lastActive: "1 hour ago",
          firstName: "ROLE_ADMIN",
          lastName: "User",
          phone: "+60111222333",
        },
      ];

      // Load approved users
      const approvedUsers = JSON.parse(
        localStorage.getItem("approvedUsers") || "[]"
      );
      const registeredUsers: User[] = approvedUsers.map(
        (user: any, index: number) => ({
          id: `reg_${index + 1}`,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          status: "active",
          joinDate: user.approvedDate || new Date().toISOString().split("T")[0],
          lastActive: "Never",
          courses: user.role === "ROLE_STUDENT" ? 0 : undefined,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone || "Not provided",
        })
      );

      // Load admin-created users
      const adminUsers = JSON.parse(localStorage.getItem("adminUsers") || "[]");
      const adminCreatedUsers: User[] = adminUsers.map((user: any) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        status: user.status,
        joinDate: user.joinDate,
        lastActive: user.lastActive || "Never",
        courses: user.role === "ROLE_STUDENT" ? 0 : undefined,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || "Not provided",
        mustChangePassword: user.mustChangePassword,
      }));

      setUsers([...demoUsers, ...registeredUsers, ...adminCreatedUsers]);

      // Load pending registrations
      const pending = JSON.parse(
        localStorage.getItem("pendingRegistrations") || "[]"
      );
      setPendingRegistrations(
        pending.filter((reg: any) => reg.status === "pending")
      );
    };

    loadData();
  }, []);

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

  const handleCreateUser = () => {
    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.email ||
      !newUser.password
    ) {
      toast.error("Error", {
        description: "Please fill in all required fields",
      });
      return;
    }

    const userId = `admin_${Date.now()}`;
    const newUserData: User = {
      id: userId,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      role: newUser.role,
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: "Never",
      courses: newUser.role === "ROLE_STUDENT" ? 0 : undefined,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phone: newUser.phone || "Not provided",
      mustChangePassword: true,
    };

    // Save to localStorage for admin-created users
    const adminUsers = JSON.parse(localStorage.getItem("adminUsers") || "[]");
    adminUsers.push({
      id: userId,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      status: "active",
      joinDate: new Date().toISOString().split("T")[0],
      lastActive: "Never",
      phone: newUser.phone || "Not provided",
      mustChangePassword: true,
    });
    localStorage.setItem("adminUsers", JSON.stringify(adminUsers));

    setUsers((prev) => [...prev, newUserData]);
    setNewUser({
      firstName: "",
      lastName: "",
      email: "",
      role: "ROLE_STUDENT",
      phone: "",
      password: "",
    });
    setCreateDialogOpen(false);

    toast.success("User Created",{
      description: `${newUserData.name} has been created successfully. They must change their password on first login.`,
    });
  };

  const handleResetPassword = (user: User) => {
    const newPassword = prompt(`Enter new password for ${user.name}:`);
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
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, mustChangePassword: true } : u
        )
      );

      toast.success(
        "Password Reset",{
        description: `Password reset for ${user.name}. They must change it on next login.`,
      });
    }
  };

  const handleApproveRegistration = (
    registrationId: string,
    approved: boolean
  ) => {
    const registration = pendingRegistrations.find(
      (reg) => reg.id === registrationId
    );
    if (!registration) return;

    if (approved) {
      // Move to approved users with their original password from registration
      const approvedUsers = JSON.parse(
        localStorage.getItem("approvedUsers") || "[]"
      );
      const pendingRegistrations = JSON.parse(
        localStorage.getItem("pendingRegistrations") || "[]"
      );
      const fullRegistration = pendingRegistrations.find(
        (reg: any) => reg.id === registrationId
      );

      approvedUsers.push({
        ...registration,
        approvedDate: new Date().toISOString().split("T")[0],
        password: fullRegistration?.password || "defaultPassword123!", // Use original password from registration
      });
      localStorage.setItem("approvedUsers", JSON.stringify(approvedUsers));

      // Add to users list
      const newUser: User = {
        id: `reg_${Date.now()}`,
        name: `${registration.firstName} ${registration.lastName}`,
        email: registration.email,
        role: registration.role,
        status: "active",
        joinDate: new Date().toISOString().split("T")[0],
        lastActive: "Never",
        courses: registration.role === "ROLE_STUDENT" ? 0 : undefined,
        firstName: registration.firstName,
        lastName: registration.lastName,
        phone: registration.phone || "Not provided",
      };
      setUsers((prev) => [...prev, newUser]);
    }

    // Update pending registrations
    const updatedPending = JSON.parse(
      localStorage.getItem("pendingRegistrations") || "[]"
    );
    const finalPending = updatedPending.map((reg: any) =>
      reg.id === registrationId
        ? { ...reg, status: approved ? "approved" : "rejected" }
        : reg
    );
    localStorage.setItem("pendingRegistrations", JSON.stringify(finalPending));

    setPendingRegistrations((prev) =>
      prev.filter((reg) => reg.id !== registrationId)
    );

    const title = approved ? "Registration Approved" : "Registration Rejected" 
    const description = `${registration.firstName} ${
        registration.lastName
      }'s registration has been ${approved ? "approved" : "rejected"}`
      if (approved) {
        toast.success(title, {
          description: description
        })
      } else {
        toast.error(title, {
          description: description
        })
      }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const userStats = {
    total: users.length,
    students: users.filter((u) => u.role === "ROLE_STUDENT").length,
    instructors: users.filter((u) => u.role === "ROLE_INSTRUCTOR").length,
    active: users.filter((u) => u.status === "active").length,
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
              <Dialog
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
                          value: "ROLE_STUDENT" | "ROLE_INSTRUCTOR" | "ROLE_ADMIN"
                        ) => setNewUser({ ...newUser, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ROLE_STUDENT">Student</SelectItem>
                          <SelectItem value="ROLE_INSTRUCTOR">Instructor</SelectItem>
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
                    <Button onClick={handleCreateUser} className="w-full">
                      Create User
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
              <AllUserTabComponent users={users} />
            </TabsContent>

            <TabsContent value="pending">
              <PendingApprovalUserTabComponent pendingRegistrations={pendingRegistrations} />
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
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold dark:text-white">
                    {selectedUser.name}
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
                    First Name
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.firstName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.lastName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.phone || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </p>
                  {getStatusBadge(selectedUser.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Join Date
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.joinDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Active
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedUser.lastActive}
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
