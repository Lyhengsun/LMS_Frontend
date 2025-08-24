import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, UserCheck, XCircle } from "lucide-react";
import RoleBadgeComponent from "./RoleBadgeComponent";
import { Button } from "@/components/ui/button";

const PendingApprovalUserTabComponent = ({
  pendingRegistrations,
}: {
  pendingRegistrations: any;
}) => {
  function handleApproveRegistration(id: any, arg1: boolean): void {
    throw new Error("Function not implemented.");
  }

  return (
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
                        {registration.firstName[0]}
                        {registration.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {registration.firstName} {registration.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {registration.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <RoleBadgeComponent role={registration.role} />
                        <span className="text-xs text-gray-500">
                          Registered:{" "}
                          {new Date(
                            registration.registrationDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleApproveRegistration(registration.id, true)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleApproveRegistration(registration.id, false)
                      }
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingApprovalUserTabComponent;
