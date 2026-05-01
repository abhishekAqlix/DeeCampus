import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { KPICard } from "@/components/erp/KPICard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: 1, staff: "Rajesh Thakur", type: "Casual Leave", from: "01 Apr 2026", to: "02 Apr 2026", days: 2, reason: "Personal work", status: "Approved" },
  { id: 2, staff: "Sunita Sharma", type: "Sick Leave", from: "28 Mar 2026", to: "30 Mar 2026", days: 3, reason: "Medical", status: "Approved" },
  { id: 3, staff: "Amit Verma", type: "Casual Leave", from: "05 Apr 2026", to: "05 Apr 2026", days: 1, reason: "Family function", status: "Pending" },
  { id: 4, staff: "Priya Kapoor", type: "Earned Leave", from: "10 Apr 2026", to: "15 Apr 2026", days: 6, reason: "Vacation", status: "Pending" },
  { id: 5, staff: "Kavita Jain", type: "Maternity Leave", from: "01 Mar 2026", to: "01 Jun 2026", days: 90, reason: "Maternity", status: "Approved" },
  { id: 6, staff: "Deepak Singh", type: "Sick Leave", from: "20 Mar 2026", to: "20 Mar 2026", days: 1, reason: "Fever", status: "Rejected" },
];

const columns = [
  { key: "staff" as const, label: "Staff", sortable: true },
  { key: "type" as const, label: "Leave Type" },
  { key: "from" as const, label: "From" },
  { key: "to" as const, label: "To" },
  { key: "days" as const, label: "Days" },
  { key: "reason" as const, label: "Reason" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "Approved" ? "approved" : v === "Pending" ? "pending" : "cancelled"} label={v} /> },
];

const fmt = (s: string) => { const d = new Date(s); return `${String(d.getDate()).padStart(2,"0")} ${d.toLocaleString("en",{month:"short"})} ${d.getFullYear()}`; };

export default function LeaveManagement() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ staff: "", type: "Casual Leave", from: "", to: "", reason: "" });

  const save = () => {
    if (!form.staff.trim() || !form.from || !form.to) { toast({ title: "Required fields missing", variant: "destructive" }); return; }
    const days = Math.max(1, Math.round((new Date(form.to).getTime() - new Date(form.from).getTime()) / 86400000) + 1);
    setData(prev => [{ id: prev.length + 1, staff: form.staff, type: form.type, from: fmt(form.from), to: fmt(form.to), days, reason: form.reason, status: "Pending" }, ...prev]);
    setOpen(false); setForm({ staff: "", type: "Casual Leave", from: "", to: "", reason: "" });
    toast({ title: "Leave application submitted successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Leave Management" subtitle="Track and approve staff leave requests"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staff" }, { label: "Leaves" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Apply Leave</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Requests" value={String(data.length)} variant="blue" />
        <KPICard title="Approved" value="28" variant="green" />
        <KPICard title="Pending" value="8" variant="amber" />
        <KPICard title="Rejected" value="6" variant="red" />
      </div>
      <DataTable data={data} columns={columns} searchKey="staff" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Apply Leave</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Staff Name *</Label><Input value={form.staff} onChange={e => setForm({ ...form, staff: e.target.value })} /></div>
            <div className="space-y-2"><Label className="text-xs">Leave Type</Label>
              <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casual Leave">Casual Leave</SelectItem>
                  <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                  <SelectItem value="Earned Leave">Earned Leave</SelectItem>
                  <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">From *</Label><Input type="date" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">To *</Label><Input type="date" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Reason</Label><Textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
