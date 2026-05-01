import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const certificates = [
  { id: 1, student: "Aarav Sharma", class: "10-A", type: "Character Certificate", issuedDate: "10 Mar 2026", status: "Issued" },
  { id: 2, student: "Priya Patel", class: "10-B", type: "Transfer Certificate", issuedDate: "12 Mar 2026", status: "Issued" },
  { id: 3, student: "Rohan Gupta", class: "9-A", type: "Bonafide Certificate", issuedDate: "", status: "Pending" },
  { id: 4, student: "Sneha Joshi", class: "12-A", type: "Migration Certificate", issuedDate: "15 Mar 2026", status: "Issued" },
  { id: 5, student: "Karan Singh", class: "8-B", type: "Character Certificate", issuedDate: "", status: "Draft" },
];

const columns = [
  { key: "student" as const, label: "Student", sortable: true },
  { key: "class" as const, label: "Class" },
  { key: "type" as const, label: "Certificate Type" },
  { key: "issuedDate" as const, label: "Issued Date", render: (v: string) => v || "—" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "Issued" ? "active" : v === "Draft" ? "draft" : "pending"} label={v} /> },
];

export default function Certificates() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Certificates"
        subtitle="Generate and manage student certificates"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Students" }, { label: "Certificates" }]}
        actions={<Button><Printer className="h-4 w-4 mr-2" />Generate Certificate</Button>}
      />
      <DataTable data={certificates} columns={columns} searchKey="student" />
    </div>
  );
}
