"use client"
import { useUserStore } from "@/src/store/useUserStore";

export function DashboardHeaderComponent() {
  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Instructor Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, Instructor {currentUser?.fullName}! Manage your courses and track student
            progress.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* <div className="relative">
                <Bell className="w-6 h-6 text-gray-400 cursor-pointer hover:text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </div> */}
        </div>
      </div>
    </header>
  );
}
