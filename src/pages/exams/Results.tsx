import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { KPICard } from "@/components/erp/KPICard";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const results = [
  { id: 1, roll: "101", student: "Aarav Sharma", class: "10-A", total: "522/600", percentage: "87%", rank: 3, result: "Pass" },
  { id: 2, roll: "102", student: "Priya Patel", class: "10-A", total: "558/600", percentage: "93%", rank: 1, result: "Pass" },
  { id: 3, roll: "103", student: "Rohan Gupta", class: "10-A", total: "198/600", percentage: "33%", rank: 8, result: "Fail" },
  { id: 4, roll: "104", student: "Sneha Joshi", class: "10-A", total: "468/600", percentage: "78%", rank: 5, result: "Pass" },
  { id: 5, roll: "105", student: "Karan Singh", class: "10-A", total: "396/600", percentage: "66%", rank: 6, result: "Pass" },
  { id: 6, roll: "106", student: "Diya Reddy", class: "10-A", total: "432/600", percentage: "72%", rank: 4, result: "Pass" },
  { id: 7, roll: "107", student: "Vivek Kumar", class: "10-A", total: "186/600", percentage: "31%", rank: 7, result: "Fail" },
  { id: 8, roll: "108", student: "Anika Verma", class: "10-A", total: "540/600", percentage: "90%", rank: 2, result: "Pass" },
];

const columns = [
  { key: "rank" as const, label: "Rank", sortable: true },
  { key: "roll" as const, label: "Roll" },
  { key: "student" as const, label: "Student", sortable: true },
  { key: "class" as const, label: "Class" },
  { key: "total" as const, label: "Total" },
  { key: "percentage" as const, label: "%" },
  { key: "result" as const, label: "Result", render: (v: string) => <StatusBadge status={v === "Pass" ? "active" : "dropped"} label={v} /> },
];

export default function Results() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Exam Results" subtitle="View and publish examination results"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Exams" }, { label: "Results" }]}
        actions={<Button variant="outline"><Download className="h-4 w-4 mr-2" />Export Results</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Students" value="48" variant="blue" />
        <KPICard title="Passed" value="42" variant="green" />
        <KPICard title="Failed" value="6" variant="red" />
        <KPICard title="Pass Rate" value="87.5%" variant="green" />
      </div>
      <DataTable data={results} columns={columns} searchKey="student" />
    </div>
  );
}
