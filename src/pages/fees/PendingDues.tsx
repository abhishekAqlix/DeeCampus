import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { KPICard } from "@/components/erp/KPICard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const dues = [
  { id: 1, student: "Aarav Sharma", class: "10-A", totalDue: "₹15,000", months: "Feb, Mar", lastPayment: "15 Jan 2026", status: "Overdue" },
  { id: 2, student: "Priya Patel", class: "9-B", totalDue: "₹7,500", months: "Mar", lastPayment: "20 Feb 2026", status: "Pending" },
  { id: 3, student: "Rohan Gupta", class: "8-A", totalDue: "₹22,500", months: "Jan, Feb, Mar", lastPayment: "10 Dec 2025", status: "Overdue" },
  { id: 4, student: "Sneha Joshi", class: "7-A", totalDue: "₹4,500", months: "Mar", lastPayment: "25 Feb 2026", status: "Pending" },
  { id: 5, student: "Karan Singh", class: "6-B", totalDue: "₹30,000", months: "Dec, Jan, Feb, Mar", lastPayment: "15 Nov 2025", status: "Overdue" },
  { id: 6, student: "Diya Reddy", class: "5-A", totalDue: "₹7,500", months: "Mar", lastPayment: "28 Feb 2026", status: "Pending" },
];

const columns = [
  { key: "student" as const, label: "Student", sortable: true },
  { key: "class" as const, label: "Class" },
  { key: "totalDue" as const, label: "Amount Due" },
  { key: "months" as const, label: "Pending Months" },
  { key: "lastPayment" as const, label: "Last Payment" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "Overdue" ? "overdue" : "pending"} label={v} /> },
];

export default function PendingDues() {
  const { toast } = useToast();

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Pending Dues" subtitle="Track overdue and pending fee payments"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Fees & Finance" }, { label: "Pending Dues" }]}
        actions={<Button onClick={() => toast({ title: "Reminder sended" })}>Send Reminders</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Pending" value="₹12,45,000" variant="red" />
        <KPICard title="Students with Dues" value="186" variant="amber" />
        <KPICard title="Overdue (>30 days)" value="42" variant="red" />
        <KPICard title="This Month Due" value="₹3,20,000" variant="default" />
      </div>
      <DataTable data={dues} columns={columns} searchKey="student" />
    </div>
  );
}
