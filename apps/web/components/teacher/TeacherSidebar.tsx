"use client";
// components/teacher/TeacherSidebar.tsx

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  PenLine,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import type { TeacherView } from "@/types/teacher";

interface NavItem {
  id: TeacherView;
  label: string;
  icon: any;
  badge?: number;
}

interface TeacherSidebarProps {
  currentView: TeacherView;
  ungradedCount?: number;
  onNavigate: (view: TeacherView) => void;
}

export function TeacherSidebar({
  currentView,
  ungradedCount,
  onNavigate,
}: TeacherSidebarProps) {
  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "students", label: "Students", icon: Users },
    {
      id: "writing-review",
      label: "Writing Review",
      icon: PenLine,
      badge: ungradedCount,
    },
    { id: "tests", label: "Test Library", icon: BookOpen },
  ];

  return (
    <aside className="w-56 flex-shrink-0 border-r border-gray-100 bg-white flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-sm font-bold">T</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Teacher Panel</p>
            <p className="text-xs text-gray-400">IELTS Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            currentView === item.id ||
            (currentView === "student-detail" && item.id === "students") ||
            (currentView === "create-test" && item.id === "tests");
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4",
                  isActive ? "text-indigo-600" : "text-gray-400"
                )}
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
