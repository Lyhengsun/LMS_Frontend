"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, UserCheck, XCircle } from "lucide-react";
import RoleBadgeComponent from "./RoleBadgeComponent";
import { Button } from "@/components/ui/button";
import User from "@/src/type/User";
import {
  approveUserByIdAction,
  deleteUserByIdAction,
  getAllUserForAdminAction,
} from "@/src/action/userAction";
import { toast } from "sonner";
import CustomPopUp from "@/src/app/_components/CustomPopUp";
import CustomPaginationOnClick from "@/src/app/_components/CustomPaginationOnClick";

const PendingApprovalUserTabComponent = () => {
  const [pendingRegistrations, setPendingRegistrations] = useState<User[]>([]);
  const [selectedRegistration, setSelectedRegistrations] = useState<User>();
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [viewDeleteUserDialog, setViewDeleteUserDialog] = useState(false);

  // load user data
  const loadUser = async () => {
    const res = await getAllUserForAdminAction(currentPage, 5, false);
    setMaxPage(res?.pagination?.totalPages);
    setPendingRegistrations(res?.users as User[]);
  };

  useEffect(() => {
    loadUser();
  }, [currentPage]);

  async function handleApproveRegistration(
    userId: number,
    fullName: string,
    approved: boolean
  ): Promise<void> {
    let res;
    if (!approved) {
      res = await deleteUserByIdAction(userId);
    } else {
      res = await approveUserByIdAction(userId);
    }

    const title = approved ? "Registration Approved" : "Registration Rejected";
    const description = `${fullName}'s registration has been ${
      approved ? "approved" : "rejected"
    }`;
    if (res?.success) {
      toast.success(title, {
        description: description,
      });
    } else {
      toast.error(title + " failed", {
        description: description,
      });
    }

    loadUser();
  }

  return (
    <>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center dark:text-white">
            <Clock className="w-5 h-5 mr-2" />
            Pending Registrations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRegistrations.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No pending registrations
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: "hsl(var(--admin-primary))",
                        }}
                      >
                        <span className="text-white text-sm font-bold">
                          {registration.fullName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {registration.fullName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {registration.email}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <RoleBadgeComponent role={registration.role} />
                          <span className="text-xs text-gray-500">
                            Registered:{" "}
                            {new Date(
                              registration.createdAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleApproveRegistration(
                            parseInt(registration.id),
                            registration.fullName,
                            true
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRegistrations(registration);
                          setViewDeleteUserDialog(true);
                        }}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      <CustomPopUp
        title={`Are you that you want to the delete user ${selectedRegistration?.fullName} ?`}
        viewDialogOpenState={viewDeleteUserDialog}
        setViewDialogOpenState={setViewDeleteUserDialog}
      >
        <div className="grid grid-cols-2 gap-4 pt-4 border-t dark:border-gray-700">
          <Button
            className="bg-green-400 text-white"
            onClick={() => {
              setViewDeleteUserDialog(false);
              handleApproveRegistration(
                parseInt(selectedRegistration!.id),
                selectedRegistration!.fullName,
                false
              );
            }}
          >
            Yes
          </Button>
          <Button
            className="bg-red-400 text-white"
            onClick={() => {
              setViewDeleteUserDialog(false);
            }}
          >
            No
          </Button>
        </div>
      </CustomPopUp>
    </>
  );
};

export default PendingApprovalUserTabComponent;
