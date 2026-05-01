export interface StaffMember {
  id: string;
  name: string;
  dept: string;
  designation: string;
  phone: string;
  status: string;
  joinDate: string;
  email: string;
}

const STAFF_STORAGE_KEY = "vidhya.staff.records";

export const initialStaff: StaffMember[] = [
  { id: "EMP001", name: "Dr. Meera Krishnan", dept: "Mathematics", designation: "HOD", phone: "9876543001", status: "active", joinDate: "2018-06-15", email: "meera.k@school.com" },
  { id: "EMP002", name: "Rajesh Thakur", dept: "Science", designation: "Senior Teacher", phone: "9876543002", status: "active", joinDate: "2019-04-01", email: "rajesh.t@school.com" },
  { id: "EMP003", name: "Sunita Verma", dept: "English", designation: "Teacher", phone: "9876543003", status: "active", joinDate: "2020-07-10", email: "sunita.v@school.com" },
  { id: "EMP004", name: "Anil Mehta", dept: "Hindi", designation: "Teacher", phone: "9876543004", status: "active", joinDate: "2017-01-20", email: "anil.m@school.com" },
  { id: "EMP005", name: "Pooja Sharma", dept: "Computer Science", designation: "Lab Incharge", phone: "9876543005", status: "active", joinDate: "2021-03-05", email: "pooja.s@school.com" },
  { id: "EMP006", name: "Vikram Singh", dept: "Physical Ed.", designation: "Sports Coach", phone: "9876543006", status: "active", joinDate: "2019-08-12", email: "vikram.s@school.com" },
  { id: "EMP007", name: "Neha Gupta", dept: "Admin", designation: "Front Office", phone: "9876543007", status: "active", joinDate: "2022-01-15", email: "neha.g@school.com" },
  { id: "EMP008", name: "Suresh Rao", dept: "Accounts", designation: "Accountant", phone: "9876543008", status: "active", joinDate: "2016-09-01", email: "suresh.r@school.com" },
  { id: "EMP009", name: "Kavita Jain", dept: "Science", designation: "Teacher", phone: "9876543009", status: "inactive", joinDate: "2020-11-20", email: "kavita.j@school.com" },
  { id: "EMP010", name: "Deepak Chauhan", dept: "Transport", designation: "Transport Manager", phone: "9876543010", status: "active", joinDate: "2018-02-28", email: "deepak.c@school.com" },
];

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

export const getStaffRecords = () => {
  if (!canUseStorage()) return initialStaff;

  const stored = window.localStorage.getItem(STAFF_STORAGE_KEY);
  if (!stored) {
    window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(initialStaff));
    return initialStaff;
  }

  try {
    return JSON.parse(stored) as StaffMember[];
  } catch {
    window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(initialStaff));
    return initialStaff;
  }
};

export const saveStaffRecords = (records: StaffMember[]) => {
  if (canUseStorage()) window.localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(records));
};

export const createStaffId = (records: StaffMember[]) => {
  const maxId = records.reduce((max, staff) => {
    const numericId = Number(staff.id.replace(/\D/g, ""));
    return Number.isNaN(numericId) ? max : Math.max(max, numericId);
  }, 0);

  return `EMP${String(maxId + 1).padStart(3, "0")}`;
};
