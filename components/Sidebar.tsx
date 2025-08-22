"use client";
import { getUserRole } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BookOpen, 
  ListChecks, 
  Settings, 
  Users,
  LogOut,
  ListOrdered,
  LucideIcon,
  Bot,
  Trophy
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

const getSidebarItems = (role: string | null): SidebarItem[] => {
  switch (role) {
    case 'admin':
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin-dashboard' },
        { label: 'User Management', icon: Users, path: '/user-management' },
        { label: 'Course Management', icon: BookOpen, path: '/course-management' },
        { label: 'Settings', icon: Settings, path: '/settings' },
      ];
    case 'instructor':
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { label: 'Manage Courses', icon: BookOpen, path: '/instructor-courses' },
        { label: 'Manage Assignments', icon: ListChecks, path: '/instructor/assignments' },
        { label: 'Manage Quizzes', icon: ListOrdered, path: '/quizzes' },
        { label: 'Settings', icon: Settings, path: '/settings' },
      ];
    case 'student':
      return [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { label: 'My Courses', icon: BookOpen, path: '/my-course' },
        { label: 'Assignments', icon: ListChecks, path: '/assignment' },
        { label: 'Quizzes', icon: ListOrdered, path: '/quiz' },
        { label: 'AI Assistant', icon: Bot, path: '/ai-assistant' },
        { label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
        { label: 'Settings', icon: Settings, path: '/setting' },
      ];
    default:
      return [];
  }
};

const getRoleActiveClass = () => {
  return 'bg-blue-50 text-blue-600 border-r-2 border-blue-600';
};

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const userRole = getUserRole();
  // const userRole = "instructor";
  
  const sidebarItems = getSidebarItems(userRole);

  const handleItemClick = (path: string) => {
    router.push(path);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">EduPlatform</h1>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => handleItemClick(item.path)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-left transition-colors ${
                    active
                      ? getRoleActiveClass()
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
            <span className="text-gray-700 text-sm font-medium">
              {userRole === 'student' ? 'A' : userRole === 'instructor' ? 'D' : 'A'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {userRole === 'student' ? 'Alex Johnson' : userRole === 'instructor' ? 'Dr. Smith' : 'Admin User'}
            </p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/login')}
          className="w-full mt-3 flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

const getRoleColor = (role: string | null) => {
  switch (role) {
    case 'student':
      return 'hsl(var(--student-primary))';
    case 'instructor':
      return 'hsl(var(--instructor-primary))';
    case 'admin':
      return 'hsl(var(--admin-primary))';
    default:
      return 'hsl(220, 13%, 69%)';
  }
};
