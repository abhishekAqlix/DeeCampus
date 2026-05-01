import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BarChart3, Users, IndianRupee, BookOpen, Bus, ClipboardCheck, Printer, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { toast } from "sonner";

const reportCategories = [
  { title: "Student Reports", icon: Users, reports: ["Student List", "Class-wise Summary", "Category-wise Report", "RTE Summary", "Student Strength", "Age-wise Report"] },
  { title: "Fee Reports", icon: IndianRupee, reports: ["Collection Report", "Pending Dues", "Class-wise Collection", "Mode-wise Collection", "Concession Report", "Defaulter List"] },
  { title: "Attendance Reports", icon: ClipboardCheck, reports: ["Daily Attendance", "Monthly Register", "Student-wise Report", "Class-wise Report", "Staff Attendance", "Late Comers"] },
  { title: "Exam Reports", icon: BookOpen, reports: ["Result Sheet", "Rank List", "Subject Analysis", "Topper List", "Fail List", "Grade Distribution"] },
  { title: "Transport Reports", icon: Bus, reports: ["Route Summary", "Student Transport List", "Vehicle Utilization", "Fee Collection", "Driver Report", "Pickup Schedule"] },
  { title: "Financial Reports", icon: BarChart3, reports: ["Income Summary", "Expense Summary", "Profit & Loss", "Cashbook Report", "Voucher Report", "Budget vs Actual"] },
];

type Col = { key: string; label: string; align?: "right" };
type ReportSchema = { columns: Col[]; rows: Record<string, string | number>[]; totalKey?: string; totalLabel?: string; valuePrefix?: string };

const studentNames = ["Aarav Sharma", "Priya Patel", "Rohan Gupta", "Sneha Joshi", "Karan Singh", "Diya Reddy", "Vivek Kumar", "Anika Verma"];
const classes = ["10-A", "10-B", "9-A", "9-B", "8-A", "8-B", "7-A", "10-A"];

const buildReport = (report: string): ReportSchema => {
  switch (report) {
    // Student Reports
    case "Student List":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "ref", label: "Adm No" }, { key: "name", label: "Student Name" }, { key: "class", label: "Class" }, { key: "gender", label: "Gender" }, { key: "father", label: "Father" }],
        rows: studentNames.map((n, i) => ({ sl: i + 1, ref: `DC-${1000 + i}`, name: n, class: classes[i], gender: i % 2 ? "Female" : "Male", father: ["Rajesh", "Suresh", "Amit", "Vikram", "Manoj", "Anil", "Deepak", "Sanjay"][i] + " " + n.split(" ")[1] })),
      };
    case "Class-wise Summary":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "class", label: "Class" }, { key: "total", label: "Total", align: "right" }, { key: "boys", label: "Boys", align: "right" }, { key: "girls", label: "Girls", align: "right" }],
        rows: ["Nursery", "LKG", "UKG", "Class 1", "Class 5", "Class 8", "Class 10", "Class 12"].map((c, i) => ({ sl: i + 1, class: c, total: 30 + i * 4, boys: 15 + i * 2, girls: 15 + i * 2 })),
        totalKey: "total", totalLabel: "Total Students",
      };
    case "Category-wise Report":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "category", label: "Category" }, { key: "count", label: "Count", align: "right" }, { key: "pct", label: "%", align: "right" }],
        rows: [["General", 420, "42%"], ["OBC", 280, "28%"], ["SC", 150, "15%"], ["ST", 90, "9%"], ["EWS", 60, "6%"]].map(([c, n, p], i) => ({ sl: i + 1, category: c as string, count: n as number, pct: p as string })),
        totalKey: "count", totalLabel: "Total",
      };
    case "RTE Summary":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "ref", label: "Adm No" }, { key: "name", label: "Student" }, { key: "class", label: "Class" }, { key: "year", label: "Year" }],
        rows: studentNames.slice(0, 6).map((n, i) => ({ sl: i + 1, ref: `RTE-${100 + i}`, name: n, class: classes[i], year: "2025-26" })),
      };
    case "Student Strength":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "class", label: "Class" }, { key: "sanctioned", label: "Sanctioned", align: "right" }, { key: "actual", label: "Enrolled", align: "right" }, { key: "vacant", label: "Vacant", align: "right" }],
        rows: ["Nursery", "Class 1", "Class 5", "Class 8", "Class 10", "Class 12"].map((c, i) => ({ sl: i + 1, class: c, sanctioned: 40, actual: 30 + i * 2, vacant: 10 - i * 2 })),
      };
    case "Age-wise Report":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "age", label: "Age Group" }, { key: "count", label: "Students", align: "right" }],
        rows: ["3-5 yrs", "6-8 yrs", "9-11 yrs", "12-14 yrs", "15-17 yrs"].map((a, i) => ({ sl: i + 1, age: a, count: 80 + i * 30 })),
        totalKey: "count", totalLabel: "Total",
      };

    // Fee Reports
    case "Collection Report":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "ref", label: "Receipt" }, { key: "name", label: "Student" }, { key: "class", label: "Class" }, { key: "mode", label: "Mode" }, { key: "amount", label: "Amount", align: "right" }],
        rows: studentNames.map((n, i) => ({ sl: i + 1, ref: `RCP-${5000 + i}`, name: n, class: classes[i], mode: ["Cash", "UPI", "Cheque", "Card"][i % 4], amount: 5000 + i * 1500 })),
        totalKey: "amount", totalLabel: "Total Collected", valuePrefix: "₹",
      };
    case "Pending Dues":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "ref", label: "Adm No" }, { key: "name", label: "Student" }, { key: "class", label: "Class" }, { key: "due", label: "Due Amount", align: "right" }, { key: "days", label: "Overdue Days", align: "right" }],
        rows: studentNames.slice(0, 6).map((n, i) => ({ sl: i + 1, ref: `DC-${1000 + i}`, name: n, class: classes[i], due: 8000 + i * 1200, days: 15 + i * 10 })),
        totalKey: "due", totalLabel: "Total Pending", valuePrefix: "₹",
      };
    case "Class-wise Collection":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "class", label: "Class" }, { key: "students", label: "Students", align: "right" }, { key: "collected", label: "Collected", align: "right" }, { key: "pending", label: "Pending", align: "right" }],
        rows: ["Nursery", "Class 1", "Class 5", "Class 8", "Class 10", "Class 12"].map((c, i) => ({ sl: i + 1, class: c, students: 30 + i * 5, collected: 150000 + i * 50000, pending: 20000 + i * 5000 })),
        totalKey: "collected", totalLabel: "Total Collected", valuePrefix: "₹",
      };
    case "Mode-wise Collection":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "mode", label: "Payment Mode" }, { key: "txns", label: "Transactions", align: "right" }, { key: "amount", label: "Amount", align: "right" }],
        rows: [["Cash", 120, 480000], ["UPI", 250, 950000], ["Cheque", 80, 620000], ["Card", 60, 280000], ["Bank Transfer", 45, 510000]].map(([m, t, a], i) => ({ sl: i + 1, mode: m as string, txns: t as number, amount: a as number })),
        totalKey: "amount", totalLabel: "Total Collected", valuePrefix: "₹",
      };
    case "Concession Report":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "name", label: "Student" }, { key: "class", label: "Class" }, { key: "type", label: "Concession Type" }, { key: "amount", label: "Amount", align: "right" }],
        rows: studentNames.slice(0, 6).map((n, i) => ({ sl: i + 1, name: n, class: classes[i], type: ["Sibling", "Staff Ward", "EWS", "Girl Child", "Sports", "Merit"][i], amount: 3000 + i * 800 })),
        totalKey: "amount", totalLabel: "Total Concession", valuePrefix: "₹",
      };
    case "Defaulter List":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "ref", label: "Adm No" }, { key: "name", label: "Student" }, { key: "class", label: "Class" }, { key: "phone", label: "Contact" }, { key: "due", label: "Due", align: "right" }],
        rows: studentNames.slice(0, 6).map((n, i) => ({ sl: i + 1, ref: `DC-${1000 + i}`, name: n, class: classes[i], phone: `+91 98765 4${1000 + i}`, due: 12000 + i * 2000 })),
        totalKey: "due", totalLabel: "Total Outstanding", valuePrefix: "₹",
      };

    // Attendance Reports
    case "Daily Attendance":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "class", label: "Class" }, { key: "total", label: "Total", align: "right" }, { key: "present", label: "Present", align: "right" }, { key: "absent", label: "Absent", align: "right" }, { key: "pct", label: "%", align: "right" }],
        rows: ["10-A", "10-B", "9-A", "9-B", "8-A", "8-B"].map((c, i) => ({ sl: i + 1, class: c, total: 35, present: 30 + (i % 4), absent: 5 - (i % 4), pct: `${85 + i}%` })),
      };
    case "Monthly Register":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "ref", label: "Adm No" }, { key: "name", label: "Student" }, { key: "working", label: "Working Days", align: "right" }, { key: "present", label: "Present", align: "right" }, { key: "pct", label: "%", align: "right" }],
        rows: studentNames.map((n, i) => ({ sl: i + 1, ref: `DC-${1000 + i}`, name: n, working: 24, present: 22 - (i % 3), pct: `${90 - i}%` })),
      };
    case "Student-wise Report":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "name", label: "Student" }, { key: "class", label: "Class" }, { key: "present", label: "Present Days", align: "right" }, { key: "absent", label: "Absent Days", align: "right" }],
        rows: studentNames.map((n, i) => ({ sl: i + 1, name: n, class: classes[i], present: 200 + i, absent: 20 - i })),
      };
    case "Class-wise Report":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "class", label: "Class" }, { key: "avgPct", label: "Avg Attendance %", align: "right" }],
        rows: ["Nursery", "Class 1", "Class 5", "Class 8", "Class 10", "Class 12"].map((c, i) => ({ sl: i + 1, class: c, avgPct: `${88 + i}%` })),
      };
    case "Staff Attendance":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "ref", label: "Emp ID" }, { key: "name", label: "Staff" }, { key: "dept", label: "Department" }, { key: "present", label: "Present", align: "right" }, { key: "leave", label: "Leave", align: "right" }],
        rows: ["Anita Desai", "Rakesh Khanna", "Sunita Nair", "Vijay Mehta", "Pooja Iyer", "Manish Saxena"].map((n, i) => ({ sl: i + 1, ref: `EMP-${100 + i}`, name: n, dept: ["Math", "Science", "English", "Admin", "Hindi", "Sports"][i], present: 22 - (i % 3), leave: i % 3 })),
      };
    case "Late Comers":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "name", label: "Student" }, { key: "class", label: "Class" }, { key: "date", label: "Date" }, { key: "time", label: "In-Time" }],
        rows: studentNames.slice(0, 6).map((n, i) => ({ sl: i + 1, name: n, class: classes[i], date: `2026-04-${10 + i}`, time: `08:${20 + i * 3} AM` })),
      };

    // Exam Reports
    case "Result Sheet":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "ref", label: "Roll" }, { key: "name", label: "Student" }, { key: "total", label: "Total", align: "right" }, { key: "pct", label: "%", align: "right" }, { key: "grade", label: "Grade" }],
        rows: studentNames.map((n, i) => ({ sl: i + 1, ref: `${100 + i}`, name: n, total: 420 + i * 8, pct: `${70 + i}%`, grade: ["A+", "A", "A", "B+", "B+", "A", "B", "A+"][i] })),
      };
    case "Rank List":
      return {
        columns: [{ key: "rank", label: "Rank" }, { key: "name", label: "Student" }, { key: "class", label: "Class" }, { key: "total", label: "Total", align: "right" }, { key: "pct", label: "%", align: "right" }],
        rows: studentNames.map((n, i) => ({ rank: i + 1, name: n, class: classes[i], total: 490 - i * 5, pct: `${98 - i}%` })),
      };
    case "Subject Analysis":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "subject", label: "Subject" }, { key: "appeared", label: "Appeared", align: "right" }, { key: "passed", label: "Passed", align: "right" }, { key: "avg", label: "Avg Marks", align: "right" }],
        rows: ["Mathematics", "English", "Science", "Hindi", "SST", "Computer"].map((s, i) => ({ sl: i + 1, subject: s, appeared: 40, passed: 38 - i, avg: 75 + i })),
      };
    case "Topper List":
      return {
        columns: [{ key: "rank", label: "Rank" }, { key: "name", label: "Student" }, { key: "class", label: "Class" }, { key: "pct", label: "%", align: "right" }],
        rows: studentNames.slice(0, 5).map((n, i) => ({ rank: i + 1, name: n, class: classes[i], pct: `${98 - i}%` })),
      };
    case "Fail List":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "name", label: "Student" }, { key: "class", label: "Class" }, { key: "subjects", label: "Failed Subjects" }],
        rows: studentNames.slice(0, 4).map((n, i) => ({ sl: i + 1, name: n, class: classes[i], subjects: ["Mathematics", "Science", "Hindi", "English"][i] })),
      };
    case "Grade Distribution":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "grade", label: "Grade" }, { key: "students", label: "Students", align: "right" }, { key: "pct", label: "%", align: "right" }],
        rows: [["A+", 45, "15%"], ["A", 80, "27%"], ["B+", 90, "30%"], ["B", 50, "17%"], ["C", 25, "8%"], ["F", 10, "3%"]].map(([g, s, p], i) => ({ sl: i + 1, grade: g as string, students: s as number, pct: p as string })),
        totalKey: "students", totalLabel: "Total Students",
      };

    // Transport Reports
    case "Route Summary":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "route", label: "Route" }, { key: "stops", label: "Stops", align: "right" }, { key: "students", label: "Students", align: "right" }, { key: "vehicle", label: "Vehicle" }],
        rows: ["North Zone", "South Zone", "East Zone", "West Zone", "Central"].map((r, i) => ({ sl: i + 1, route: r, stops: 8 + i, students: 35 + i * 5, vehicle: `MH-12-AB-${1000 + i}` })),
      };
    case "Student Transport List":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "name", label: "Student" }, { key: "class", label: "Class" }, { key: "route", label: "Route" }, { key: "stop", label: "Pickup Stop" }],
        rows: studentNames.map((n, i) => ({ sl: i + 1, name: n, class: classes[i], route: ["North", "South", "East", "West"][i % 4], stop: ["Andheri", "Bandra", "Dadar", "Powai", "Vikhroli", "Kurla", "Sion", "Mulund"][i] })),
      };
    case "Vehicle Utilization":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "vehicle", label: "Vehicle" }, { key: "capacity", label: "Capacity", align: "right" }, { key: "occupied", label: "Occupied", align: "right" }, { key: "util", label: "Utilization %", align: "right" }],
        rows: ["MH-12-AB-1000", "MH-12-AB-1001", "MH-12-AB-1002", "MH-12-AB-1003"].map((v, i) => ({ sl: i + 1, vehicle: v, capacity: 50, occupied: 40 + i * 2, util: `${80 + i * 4}%` })),
      };
    case "Fee Collection":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "route", label: "Route" }, { key: "students", label: "Students", align: "right" }, { key: "amount", label: "Collected", align: "right" }],
        rows: ["North", "South", "East", "West"].map((r, i) => ({ sl: i + 1, route: r, students: 35 + i * 4, amount: 87500 + i * 10000 })),
        totalKey: "amount", totalLabel: "Total", valuePrefix: "₹",
      };
    case "Driver Report":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "name", label: "Driver" }, { key: "license", label: "License No" }, { key: "vehicle", label: "Vehicle" }, { key: "experience", label: "Experience" }],
        rows: ["Ramesh Yadav", "Suresh Kumar", "Mahesh Singh", "Dinesh Patil"].map((n, i) => ({ sl: i + 1, name: n, license: `MH${20240000 + i}`, vehicle: `MH-12-AB-${1000 + i}`, experience: `${5 + i} years` })),
      };
    case "Pickup Schedule":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "stop", label: "Stop" }, { key: "route", label: "Route" }, { key: "pickup", label: "Pickup Time" }, { key: "drop", label: "Drop Time" }],
        rows: ["Andheri", "Bandra", "Dadar", "Powai", "Vikhroli", "Kurla"].map((s, i) => ({ sl: i + 1, stop: s, route: ["North", "South"][i % 2], pickup: `07:${10 + i * 5} AM`, drop: `03:${10 + i * 5} PM` })),
      };

    // Financial Reports
    case "Income Summary":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "head", label: "Income Head" }, { key: "amount", label: "Amount", align: "right" }],
        rows: [["Tuition Fees", 4500000], ["Admission Fees", 1200000], ["Transport Fees", 850000], ["Exam Fees", 320000], ["Misc Income", 95000]].map(([h, a], i) => ({ sl: i + 1, head: h as string, amount: a as number })),
        totalKey: "amount", totalLabel: "Total Income", valuePrefix: "₹",
      };
    case "Expense Summary":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "head", label: "Expense Head" }, { key: "amount", label: "Amount", align: "right" }],
        rows: [["Salaries", 2800000], ["Utilities", 240000], ["Maintenance", 180000], ["Transport Fuel", 320000], ["Stationery", 95000], ["Misc", 70000]].map(([h, a], i) => ({ sl: i + 1, head: h as string, amount: a as number })),
        totalKey: "amount", totalLabel: "Total Expense", valuePrefix: "₹",
      };
    case "Profit & Loss":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "head", label: "Particulars" }, { key: "amount", label: "Amount", align: "right" }],
        rows: [["Total Income", 6965000], ["Total Expense", 3705000], ["Net Surplus", 3260000]].map(([h, a], i) => ({ sl: i + 1, head: h as string, amount: a as number })),
        valuePrefix: "₹",
      };
    case "Cashbook Report":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "date", label: "Date" }, { key: "voucher", label: "Voucher" }, { key: "particulars", label: "Particulars" }, { key: "debit", label: "Debit", align: "right" }, { key: "credit", label: "Credit", align: "right" }],
        rows: Array.from({ length: 8 }).map((_, i) => ({ sl: i + 1, date: `2026-04-${10 + i}`, voucher: `V-${500 + i}`, particulars: ["Fee Collection", "Salary Paid", "Stationery", "Electricity", "Bus Fuel", "Library Books", "Lab Equipment", "Misc"][i], debit: i % 2 ? 0 : 12000 + i * 500, credit: i % 2 ? 8000 + i * 700 : 0 })),
        valuePrefix: "₹",
      };
    case "Voucher Report":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "voucher", label: "Voucher No" }, { key: "type", label: "Type" }, { key: "date", label: "Date" }, { key: "amount", label: "Amount", align: "right" }],
        rows: Array.from({ length: 8 }).map((_, i) => ({ sl: i + 1, voucher: `V-${500 + i}`, type: ["Receipt", "Payment", "Journal", "Contra"][i % 4], date: `2026-04-${10 + i}`, amount: 5000 + i * 1500 })),
        totalKey: "amount", totalLabel: "Total", valuePrefix: "₹",
      };
    case "Budget vs Actual":
      return {
        columns: [{ key: "sl", label: "SL" }, { key: "head", label: "Head" }, { key: "budget", label: "Budget", align: "right" }, { key: "actual", label: "Actual", align: "right" }, { key: "variance", label: "Variance", align: "right" }],
        rows: [["Salaries", 3000000, 2800000, 200000], ["Utilities", 250000, 240000, 10000], ["Maintenance", 200000, 180000, 20000], ["Transport", 350000, 320000, 30000]].map(([h, b, a, v], i) => ({ sl: i + 1, head: h as string, budget: b as number, actual: a as number, variance: v as number })),
        valuePrefix: "₹",
      };

    default:
      return { columns: [{ key: "sl", label: "SL" }], rows: [] };
  }
};

export default function ReportsCenter() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ category: string; report: string } | null>(null);

  const openReport = (category: string, report: string) => {
    setSelected({ category, report });
    setOpen(true);
  };

  const schema = selected ? buildReport(selected.report) : null;
  const grandTotal = schema?.totalKey
    ? schema.rows.reduce((s, r) => s + (typeof r[schema.totalKey!] === "number" ? (r[schema.totalKey!] as number) : 0), 0)
    : 0;
  const fmt = (v: string | number, prefix?: string) =>
    typeof v === "number" ? `${prefix ?? ""}${v.toLocaleString("en-IN")}` : v;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Reports Center" subtitle="Generate and download reports across all modules"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reports" }]}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCategories.map((cat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <cat.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{cat.title}</h3>
              </div>
              <div className="space-y-2">
                {cat.reports.map((r, j) => (
                  <div
                    key={j}
                    onClick={() => openReport(cat.title, r)}
                    className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer text-sm group"
                  >
                    <span>{r}</span>
                    <Download className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {selected?.report}
            </DialogTitle>
          </DialogHeader>

          <div className="border rounded-lg p-6 bg-card">
            {/* Report Header */}
            <div className="text-center border-b pb-4 mb-4">
              <h2 className="text-xl font-bold text-primary">DeeCampus ERP</h2>
              <p className="text-xs text-muted-foreground">123 Education Lane, Mumbai · Affiliated CBSE</p>
              <h3 className="mt-3 text-base font-semibold">{selected?.report}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {selected?.category} · Generated on {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>

            {/* Filters summary */}
            <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
              <div className="bg-muted/40 rounded px-3 py-2"><span className="text-muted-foreground">Academic Year:</span> <span className="font-medium">2025-2026</span></div>
              <div className="bg-muted/40 rounded px-3 py-2"><span className="text-muted-foreground">Period:</span> <span className="font-medium">Apr 2025 - Mar 2026</span></div>
              <div className="bg-muted/40 rounded px-3 py-2"><span className="text-muted-foreground">Total Records:</span> <span className="font-medium">{schema?.rows.length ?? 0}</span></div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  {schema?.columns.map((c) => (
                    <TableHead key={c.key} className={c.align === "right" ? "text-right" : ""}>{c.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {schema?.rows.map((row, idx) => (
                  <TableRow key={idx}>
                    {schema.columns.map((c) => (
                      <TableCell key={c.key} className={c.align === "right" ? "text-right" : ""}>
                        {typeof row[c.key] === "number" ? fmt(row[c.key], schema.valuePrefix) : row[c.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Totals */}
            {schema?.totalKey && (
              <div className="flex justify-end mt-4 pt-3 border-t">
                <div className="text-sm">
                  <span className="text-muted-foreground mr-3">{schema.totalLabel ?? "Grand Total"}:</span>
                  <span className="font-bold text-base">{schema.valuePrefix ?? ""}{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 pt-3 border-t flex justify-between text-[10px] text-muted-foreground">
              <span>Authorized Signatory</span>
              <span>Page 1 of 1</span>
              <span>DeeCampus ERP · System Generated</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => window.print()} className="gap-1.5">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button onClick={() => { toast.success("Report downloaded successfully"); setOpen(false); }} className="gap-1.5">
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
