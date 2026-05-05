/** Keep in sync with `backend/src/models/RolePermission.model.js` MODULES */
export const PERMISSION_MODULES = [
  "Dashboard",
  "Admissions",
  "Academics",
  "Students",
  "Staff",
  "Attendance",
  "Timetable",
  "Fees & Finance",
  "Exams",
  "Transport",
  "Communication",
  "Library",
  "Hostel",
  "Inventory",
  "Visitors",
  "Helpdesk",
  "Documents",
  "Reports",
  "User Rights",
  "Settings",
] as const;

export const PERMISSION_ACTIONS = ["View", "Create", "Edit", "Delete", "Export"] as const;

export type PermissionModule = (typeof PERMISSION_MODULES)[number];

export const emptyPermissionRow = (): boolean[] => PERMISSION_ACTIONS.map(() => false);

export function defaultPermissionMatrix(): Record<PermissionModule, boolean[]> {
  return Object.fromEntries(PERMISSION_MODULES.map((m) => [m, emptyPermissionRow()])) as Record<
    PermissionModule,
    boolean[]
  >;
}
