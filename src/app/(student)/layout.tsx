import { Sidebar } from "@/src/components/Sidebar";
import React from "react";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar role="student" />
      {children}{" "}
    </div>
  );
};

export default StudentLayout;
