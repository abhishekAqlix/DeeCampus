import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const logs = [
  { id: 1, timestamp: "03 Apr 2026, 10:30 AM", user: "Admin Staff", action: "Updated", module: "Students", description: "Updated student Aarav Sharma profile", ip: "192.168.1.45" },
  { id: 2, timestamp: "03 Apr 2026, 10:15 AM", user: "Admin Staff", action: "Created", module: "Fees", description: "Collected fee ₹7,500 from Priya Patel", ip: "192.168.1.45" },
  { id: 3, timestamp: "03 Apr 2026, 09:45 AM", user: "Rajesh Thakur", action: "Updated", module: "Attendance", description: "Marked attendance for Class 10-A", ip: "192.168.1.102" },
  { id: 4, timestamp: "03 Apr 2026, 09:30 AM", user: "Admin Staff", action: "Deleted", module: "Enquiry", description: "Deleted enquiry #ENQ-0089", ip: "192.168.1.45" },
  { id: 5, timestamp: "02 Apr 2026, 04:30 PM", user: "Admin Staff", action: "Created", module: "Staff", description: "Added new staff member - Mrs. Kavita Jain", ip: "192.168.1.45" },
  { id: 6, timestamp: "02 Apr 2026, 03:00 PM", user: "Sunita Sharma", action: "Updated", module: "Exams", description: "Entered marks for Class 9-B Mathematics", ip: "192.168.1.88" },
  { id: 7, timestamp: "02 Apr 2026, 02:00 PM", user: "Admin Staff", action: "Updated", module: "Settings", description: "Updated school profile", ip: "192.168.1.45" },
];

const columns = [
  { key: "timestamp" as const, label: "Timestamp", sortable: true },
  { key: "user" as const, label: "User" },
  { key: "action" as const, label: "Action", render: (v: string) => <StatusBadge status={v === "Created" ? "active" : v === "Updated" ? "pending" : "cancelled"} label={v} /> },
  { key: "module" as const, label: "Module" },
  { key: "description" as const, label: "Description" },
  { key: "ip" as const, label: "IP Address" },
];

export default function AuditLogs() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Audit Logs" subtitle="Track all system activity and changes"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }, { label: "Audit Logs" }]}
        actions={<Button variant="outline"><Download className="h-4 w-4 mr-2" />Export Logs</Button>}
      />
      <DataTable data={logs} columns={columns} searchKey="description" />
    </div>
  );
}
