import { Sidebar } from "@/src/components/Sidebar";
import React from "react";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar role="admin" />

      <div className="flex-1 overflow-y-scroll h-dvh">{children} </div>
    </div>
  );
};

export default StudentLayout;
