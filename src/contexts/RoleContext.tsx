import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "staff" | "student";

interface RolePermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAccessFinance: boolean;
  canManageStaff: boolean;
  canManageSettings: boolean;
  canMarkAttendance: boolean;
  canEntryMarks: boolean;
  canViewReports: boolean;
  canManageTransport: boolean;
  canManageAdmissions: boolean;
}

const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    canCreate: true, canEdit: true, canDelete: true,
    canAccessFinance: true, canManageStaff: true, canManageSettings: true,
    canMarkAttendance: true, canEntryMarks: true, canViewReports: true,
    canManageTransport: true, canManageAdmissions: true,
  },
  staff: {
    canCreate: false, canEdit: true, canDelete: false,
    canAccessFinance: false, canManageStaff: false, canManageSettings: false,
    canMarkAttendance: true, canEntryMarks: true, canViewReports: false,
    canManageTransport: false, canManageAdmissions: false,
  },
  student: {
    canCreate: false, canEdit: false, canDelete: false,
    canAccessFinance: false, canManageStaff: false, canManageSettings: false,
    canMarkAttendance: false, canEntryMarks: false, canViewReports: false,
    canManageTransport: false, canManageAdmissions: false,
  },
};

interface RoleUser {
  name: string;
  initials: string;
  label: string;
}

const roleUsers: Record<UserRole, RoleUser> = {
  admin: { name: "Admin Staff", initials: "AS", label: "Super Admin" },
  staff: { name: "Rajesh Thakur", initials: "RT", label: "Teacher" },
  student: { name: "Aarav Sharma", initials: "AA", label: "Student · 10-A" },
};

// Define which sidebar items are visible per role
export const sidebarAccess: Record<UserRole, string[]> = {
  admin: [
    "Dashboard", "Admissions", "Academics", "Students", "Staff", "Attendance",
    "Timetable", "Fees & Finance", "Exams", "Transport", "Communication",
    "Library", "Inventory", "Visitors", "Helpdesk", "Documents",
    "Reports", "User Rights", "Settings",
  ],
  staff: [
    "Dashboard", "Students", "Attendance", "Timetable", "Exams", "Communication", "Library",
  ],
  student: [
    "Dashboard", "Attendance", "Timetable", "Fees & Finance", "Exams",
  ],
};

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  permissions: RolePermissions;
  user: RoleUser;
  hasAccess: (module: string) => boolean;
}

const RoleContext = createContext<RoleContextType | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("admin");

  const value: RoleContextType = {
    role,
    setRole,
    permissions: rolePermissions[role],
    user: roleUsers[role],
    hasAccess: (module: string) => sidebarAccess[role].includes(module),
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
