import { getMyRolePermissionRequest, RolePermissionDto } from "@/api/school-api";
import { ApiError } from "@/lib/api/client";
import {
  defaultPermissionMatrix,
  PERMISSION_MODULES,
  PermissionModule,
} from "@/constants/permission-modules";
import { useAuth } from "@/contexts/AuthContext";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type UserRole = "admin" | "staff" | "student";

export interface RolePermissions {
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

interface RoleUser {
  name: string;
  initials: string;
  label: string;
}

interface RoleContextType {
  role: UserRole;
  /** Back-end role string e.g. Admin, Teacher */
  backendRole: string;
  setRole: (role: UserRole) => void;
  permissions: RolePermissions;
  /** Matrix: module -> [View, Create, Edit, Delete, Export] */
  moduleMatrix: Record<string, boolean[]>;
  user: RoleUser;
  hasAccess: (module: string) => boolean;
}

const RoleContext = createContext<RoleContextType | null>(null);

const fullAdminPermissions: RolePermissions = {
  canCreate: true,
  canEdit: true,
  canDelete: true,
  canAccessFinance: true,
  canManageStaff: true,
  canManageSettings: true,
  canMarkAttendance: true,
  canEntryMarks: true,
  canViewReports: true,
  canManageTransport: true,
  canManageAdmissions: true,
};

function row(mod: Record<string, boolean[]>, name: string, idx: number) {
  return mod[name]?.[idx] ?? false;
}

function matrixToLegacyPermissions(matrix: Record<string, boolean[]>, backendRole: string): RolePermissions {
  if (backendRole === "Admin") return fullAdminPermissions;

  const r = (m: string, i: number) => row(matrix, m, i);

  return {
    canCreate: r("Students", 1) || r("Staff", 1) || r("Admissions", 1) || r("Academics", 1),
    canEdit: r("Students", 2) || r("Staff", 2) || r("Admissions", 2) || r("Academics", 2),
    canDelete: r("Students", 3) || r("Staff", 3),
    canAccessFinance: r("Fees & Finance", 0),
    canManageStaff: r("Staff", 0),
    canManageSettings: r("Settings", 0),
    canMarkAttendance: r("Attendance", 0),
    canEntryMarks: r("Exams", 0),
    canViewReports: r("Reports", 0),
    canManageTransport: r("Transport", 0),
    canManageAdmissions: r("Admissions", 0),
  };
}

function backendRoleToPresetUiRole(role: string): UserRole {
  if (role === "Admin") return "admin";
  return "staff";
}

function mergeMatrixFromApi(item: RolePermissionDto | null): Record<string, boolean[]> {
  const base = defaultPermissionMatrix();
  if (!item?.modules) return base;

  for (const m of PERMISSION_MODULES) {
    const incoming = item.modules[m];
    if (Array.isArray(incoming) && incoming.length >= 5) {
      base[m] = incoming.slice(0, 5).map(Boolean);
    }
  }
  return base as Record<PermissionModule, boolean[]>;
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const backendRole = user?.role ?? "Staff";
  const [uiRole, setUiRole] = useState<UserRole>("admin");
  const [moduleMatrix, setModuleMatrix] = useState<Record<string, boolean[]>>(() => defaultPermissionMatrix());

  useEffect(() => {
    setUiRole(backendRoleToPresetUiRole(backendRole));
  }, [backendRole]);

  const loadPermissions = useCallback(async () => {
    if (!user) {
      setModuleMatrix(defaultPermissionMatrix());
      return;
    }
    try {
      const { item } = await getMyRolePermissionRequest();
      setModuleMatrix(mergeMatrixFromApi(item));
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        setModuleMatrix(defaultPermissionMatrix());
      }
    }
  }, [user]);

  useEffect(() => {
    void loadPermissions();
  }, [loadPermissions]);

  const roleUser: RoleUser = useMemo(() => {
    const name = user?.name ?? "Guest";
    const parts = name.trim().split(/\s+/);
    const initials =
      parts.length >= 2
        ? `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase()
        : (name.slice(0, 2).toUpperCase() || "?");
    return {
      name,
      initials,
      label: backendRole === "Admin" ? "Super Admin" : backendRole,
    };
  }, [user?.name, backendRole]);

  const permissions = useMemo(
    () => matrixToLegacyPermissions(moduleMatrix, backendRole),
    [moduleMatrix, backendRole]
  );

  const hasAccess = useCallback(
    (module: string) => {
      if (backendRole === "Admin") return true;
      return row(moduleMatrix, module, 0);
    },
    [moduleMatrix, backendRole]
  );

  const value: RoleContextType = {
    role: uiRole,
    backendRole,
    setRole: setUiRole,
    permissions,
    moduleMatrix,
    user: roleUser,
    hasAccess,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
