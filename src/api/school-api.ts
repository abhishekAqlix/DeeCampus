import { apiFetch } from "@/lib/api/client";

export type ApiUser = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
};

export type StudentDto = {
  id: string;
  studentCode: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  religion: string;
  category: string;
  aadhar: string;
  phone: string;
  email: string;
  address: string;
  classSectionId: string | null;
  classSection: { id: string; className: string } | null;
  className: string;
  section: string;
  rollNo: number | null;
  admissionDate: string;
  previousSchool: string;
  guardian: {
    fatherName: string;
    fatherPhone: string;
    fatherEmail: string;
    fatherOccupation: string;
    motherName: string;
    motherPhone: string;
  };
  status: string;
};

export type ClassSectionDto = {
  id: string;
  /** API field (maps to `className` in DB) */
  class: string;
  sections: string;
  classTeacher: string;
  totalStudents: number;
  capacity: number;
  status: string;
};

export type SubjectDto = {
  id: string;
  name: string;
  code: string;
  type: "Core" | "Elective";
  classes: string;
  teachers: number;
  status: string;
};

export type StaffDto = {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  departmentId: string;
  designationId: string;
  roleId: string;
  department: string;
  designation: string;
  gender: string;
  dateOfBirth: string;
  joinDate: string;
  qualification: string;
  experience: string;
  address: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  monthlySalary: number | null;
  panNumber: string;
  epfNumber: string;
  status: string;
};

export type FeeStructureDto = {
  id: string;
  classGroup: string;
  academicYear: string;
  tuitionFeeMonthly: number;
  admissionFee: number;
  examFee: number;
  transportFeeMonthly: number;
  annualTotal: number;
  status: string;
};

export type TimetableDto = {
  id: string;
  classSectionId: string | null;
  academicYear: string;
  classLabel: string;
  periods: string[];
  schedule: { day: string; subjects: string[] }[];
};

export type MasterItemDto = {
  id: string;
  type: string;
  name: string;
  isActive: boolean;
};

export type RolePermissionDto = {
  id: string;
  role: string;
  modules: Record<string, boolean[]>;
};

export type SchoolProfileDto = {
  id: string;
  schoolName: string;
  shortName: string;
  establishedYear: number;
  boardAffiliation: string;
  schoolType: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  chairman: string;
  principal: string;
  vicePrincipal: string;
  adminHead: string;
  currentAcademicYear: string;
  sessionStart: string;
  sessionEnd: string;
  workingDaysWeekly: number;
};

export type FeeWaiverConcessionDto = {
  categoryKey: string;
  value: number;
  unit: "percent" | "rupees";
};

export type AuditLogDto = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  description: string;
  ip: string;
};

/** Auth */
export async function loginRequest(email: string, password: string) {
  return apiFetch<{ user: ApiUser; message?: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function authMeRequest() {
  return apiFetch<{ user: ApiUser & { createdAt?: string; updatedAt?: string } }>("/auth/me");
}

export async function logoutRequest() {
  return apiFetch<{ message?: string }>("/auth/logout", { method: "POST", body: JSON.stringify({}) });
}

/** Role permissions */
export async function getMyRolePermissionRequest() {
  return apiFetch<{ item: RolePermissionDto }>("/role-permissions/me");
}

export async function listRolePermissionsRequest() {
  return apiFetch<{ items: RolePermissionDto[] }>("/role-permissions");
}

export async function saveRolePermissionsRequest(permissions: Record<string, Record<string, boolean[]>>) {
  return apiFetch<{ items: RolePermissionDto[] }>("/role-permissions", {
    method: "POST",
    body: JSON.stringify({ permissions }),
  });
}

/** Students */
export async function listStudentsRequest(params?: { q?: string; classSectionId?: string; section?: string; status?: string }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.classSectionId) qs.set("classSectionId", params.classSectionId);
  if (params?.section) qs.set("section", params.section);
  if (params?.status) qs.set("status", params.status);
  const query = qs.toString();
  return apiFetch<{ items: StudentDto[] }>(`/students${query ? `?${query}` : ""}`);
}

export async function getStudentRequest(id: string) {
  return apiFetch<{ item: StudentDto }>(`/students/${id}`);
}

export async function createStudentRequest(body: Record<string, unknown>) {
  return apiFetch<{ item: StudentDto }>("/students", { method: "POST", body: JSON.stringify(body) });
}

export async function updateStudentRequest(id: string, body: Record<string, unknown>) {
  return apiFetch<{ item: StudentDto }>(`/students/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function deleteStudentRequest(id: string) {
  return apiFetch<{ message?: string }>(`/students/${id}`, { method: "DELETE", body: JSON.stringify({}) });
}

/** Staff */
export async function listStaffRequest() {
  return apiFetch<{ items: StaffDto[] }>("/staff");
}

export async function getStaffRequest(id: string) {
  return apiFetch<{ item: StaffDto }>(`/staff/${id}`);
}

export async function createStaffRequest(body: Record<string, unknown>) {
  return apiFetch<{ item: StaffDto }>("/staff", { method: "POST", body: JSON.stringify(body) });
}

export async function updateStaffRequest(id: string, body: Record<string, unknown>) {
  return apiFetch<{ item: StaffDto }>(`/staff/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function deleteStaffRequest(id: string) {
  return apiFetch<{ message?: string }>(`/staff/${id}`, { method: "DELETE", body: JSON.stringify({}) });
}

/** Class sections */
export async function listClassSectionsRequest() {
  return apiFetch<{ items: ClassSectionDto[] }>("/class-sections");
}

export async function createClassSectionRequest(body: Record<string, unknown>) {
  return apiFetch<{ item: ClassSectionDto }>("/class-sections", { method: "POST", body: JSON.stringify(body) });
}

export async function updateClassSectionRequest(id: string, body: Record<string, unknown>) {
  return apiFetch<{ item: ClassSectionDto }>(`/class-sections/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function deleteClassSectionRequest(id: string) {
  return apiFetch<{ message?: string }>(`/class-sections/${id}`, { method: "DELETE", body: JSON.stringify({}) });
}

/** Subjects */
export async function listSubjectsRequest() {
  return apiFetch<{ items: SubjectDto[] }>("/subjects");
}

export async function createSubjectRequest(body: Record<string, unknown>) {
  return apiFetch<{ item: SubjectDto }>("/subjects", { method: "POST", body: JSON.stringify(body) });
}

export async function updateSubjectRequest(id: string, body: Record<string, unknown>) {
  return apiFetch<{ item: SubjectDto }>(`/subjects/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function deleteSubjectRequest(id: string) {
  return apiFetch<{ message?: string }>(`/subjects/${id}`, { method: "DELETE", body: JSON.stringify({}) });
}

/** Timetable */
export async function listTimetablesRequest(params: { academicYear: string; classSectionId?: string; classLabel?: string }) {
  const qs = new URLSearchParams();
  qs.set("academicYear", params.academicYear);
  if (params.classSectionId) qs.set("classSectionId", params.classSectionId);
  if (params.classLabel) qs.set("classLabel", params.classLabel);
  return apiFetch<{ items: TimetableDto[] }>(`/timetables?${qs.toString()}`);
}

export async function upsertTimetableRequest(body: Record<string, unknown>) {
  return apiFetch<{ item: TimetableDto }>("/timetables", { method: "POST", body: JSON.stringify(body) });
}

export async function deleteTimetableRequest(id: string) {
  return apiFetch<{ message?: string }>(`/timetables/${id}`, { method: "DELETE", body: JSON.stringify({}) });
}

/** Fee structures */
export async function listFeeStructuresRequest(academicYear: string) {
  const qs = new URLSearchParams({ academicYear });
  return apiFetch<{ items: FeeStructureDto[] }>(`/fee-structures?${qs.toString()}`);
}

export async function createFeeStructureRequest(body: Record<string, unknown>) {
  return apiFetch<{ item: FeeStructureDto }>("/fee-structures", { method: "POST", body: JSON.stringify(body) });
}

export async function deleteFeeStructureRequest(id: string) {
  return apiFetch<{ message?: string }>(`/fee-structures/${id}`, { method: "DELETE", body: JSON.stringify({}) });
}

export async function getFeeWaiverSettingsRequest() {
  return apiFetch<{ settings: { id: string; concessions: FeeWaiverConcessionDto[] } }>("/fee-waiver/settings");
}

export async function saveFeeWaiverSettingsRequest(concessions: FeeWaiverConcessionDto[]) {
  return apiFetch<{ settings: { id: string; concessions: FeeWaiverConcessionDto[] } }>("/fee-waiver/settings", {
    method: "PUT",
    body: JSON.stringify({ concessions }),
  });
}

/** Masters */
export type MasterType =
  | "Fee Types"
  | "Classes"
  | "Departments"
  | "Designations"
  | "Roles"
  | "Document Types"
  | "Payment Modes"
  | "Holiday Types"
  | "Academic Years";

export async function listMastersRequest(type?: MasterType) {
  const qs = type ? `?type=${encodeURIComponent(type)}` : "";
  return apiFetch<{ masters: Record<string, MasterItemDto[]> }>(`/masters${qs}`);
}

export async function createMasterRequest(type: MasterType, name: string) {
  return apiFetch<{ item: MasterItemDto }>(`/masters/${encodeURIComponent(type)}`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateMasterRequest(type: MasterType, id: string, body: { name?: string; isActive?: boolean }) {
  return apiFetch<{ item: MasterItemDto }>(`/masters/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function deleteMasterRequest(type: MasterType, id: string) {
  return apiFetch<{ message?: string }>(`/masters/${encodeURIComponent(type)}/${encodeURIComponent(id)}`, {
    method: "DELETE",
    body: JSON.stringify({}),
  });
}

/** School profile */
export async function getSchoolProfileRequest() {
  return apiFetch<{ profile: SchoolProfileDto }>("/school-profile");
}

export async function updateSchoolProfileRequest(body: Partial<SchoolProfileDto>) {
  return apiFetch<{ profile: SchoolProfileDto; message?: string }>("/school-profile", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

/** Audit logs */
export async function listAuditLogsRequest(params?: { module?: string; action?: string; limit?: number }) {
  const qs = new URLSearchParams();
  if (params?.module) qs.set("module", params.module);
  if (params?.action) qs.set("action", params.action);
  if (params?.limit != null) qs.set("limit", String(params.limit));
  const q = qs.toString();
  return apiFetch<{ logs: AuditLogDto[] }>(`/audit-logs${q ? `?${q}` : ""}`);
}
