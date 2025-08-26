import { Sidebar } from "@/src/components/Sidebar";
import React from "react";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar role="student" />

      <div className="flex-1 overflow-y-scroll h-dvh">{children} </div>
    </div>
  );
};

export default StudentLayout;
