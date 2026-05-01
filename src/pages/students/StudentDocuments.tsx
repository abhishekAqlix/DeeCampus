import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";

const documents = [
  { id: 1, student: "Aarav Sharma", class: "10-A", type: "Birth Certificate", status: "Verified", uploadDate: "15 Jan 2026" },
  { id: 2, student: "Priya Patel", class: "9-B", type: "Aadhar Card", status: "Pending", uploadDate: "18 Jan 2026" },
  { id: 3, student: "Rohan Gupta", class: "8-A", type: "Transfer Certificate", status: "Verified", uploadDate: "20 Jan 2026" },
  { id: 4, student: "Sneha Joshi", class: "7-A", type: "Report Card", status: "Verified", uploadDate: "22 Jan 2026" },
  { id: 5, student: "Karan Singh", class: "6-B", type: "Medical Certificate", status: "Rejected", uploadDate: "25 Jan 2026" },
  { id: 6, student: "Diya Reddy", class: "5-A", type: "Passport Copy", status: "Pending", uploadDate: "28 Jan 2026" },
];

const columns = [
  { key: "student" as const, label: "Student", sortable: true },
  { key: "class" as const, label: "Class" },
  { key: "type" as const, label: "Document Type" },
  { key: "uploadDate" as const, label: "Upload Date" },
  { key: "status" as const, label: "Status", render: (val: string) => <StatusBadge status={val === "Verified" ? "active" : val === "Pending" ? "pending" : "cancelled"} label={val} /> },
];

export default function StudentDocuments() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Student Documents"
        subtitle="Manage and verify student documents"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Students" }, { label: "Documents" }]}
        actions={<Button><FileUp className="h-4 w-4 mr-2" />Upload Document</Button>}
      />
      <DataTable data={documents} columns={columns} searchKey="student" />
    </div>
  );
}
