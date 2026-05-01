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
  { id: 1, ticketNo: "TKT-0042", subject: "AC not working in Class 10-A", raisedBy: "Mr. Thakur", category: "Maintenance", priority: "High", assignedTo: "Facility Team", created: "02 Apr 2026", status: "Open" },
  { id: 2, ticketNo: "TKT-0041", subject: "Internet connectivity issue in Lab", raisedBy: "Mrs. Gupta", category: "IT", priority: "High", assignedTo: "IT Team", created: "01 Apr 2026", status: "In Progress" },
  { id: 3, ticketNo: "TKT-0040", subject: "Request for extra chairs in Hall", raisedBy: "Mr. Verma", category: "Furniture", priority: "Medium", assignedTo: "Admin", created: "30 Mar 2026", status: "Resolved" },
  { id: 4, ticketNo: "TKT-0039", subject: "Projector not working in Room 205", raisedBy: "Mrs. Kapoor", category: "IT", priority: "Medium", assignedTo: "IT Team", created: "28 Mar 2026", status: "Open" },
  { id: 5, ticketNo: "TKT-0038", subject: "Broken window in corridor", raisedBy: "Mr. Singh", category: "Maintenance", priority: "Low", assignedTo: "Facility Team", created: "25 Mar 2026", status: "Resolved" },
];

const columns = [
  { key: "ticketNo" as const, label: "Ticket #" },
  { key: "subject" as const, label: "Subject", sortable: true },
  { key: "raisedBy" as const, label: "Raised By" },
  { key: "category" as const, label: "Category" },
  { key: "priority" as const, label: "Priority", render: (v: string) => <StatusBadge status={v === "High" ? "overdue" : v === "Medium" ? "pending" : "active"} label={v} /> },
  { key: "assignedTo" as const, label: "Assigned To" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "Resolved" ? "approved" : v === "In Progress" ? "pending" : "draft"} label={v} /> },
];

export default function HelpdeskPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ subject: "", raisedBy: "", category: "Maintenance", priority: "Medium", assignedTo: "", description: "" });

  const save = () => {
    if (!form.subject.trim() || !form.raisedBy.trim()) { toast({ title: "Subject and raised-by required", variant: "destructive" }); return; }
    const today = new Date();
    const formatted = `${String(today.getDate()).padStart(2,"0")} ${today.toLocaleString("en",{month:"short"})} ${today.getFullYear()}`;
    const next = `TKT-${String(43 + (data.length - seed.length)).padStart(4, "0")}`;
    setData(prev => [{ id: prev.length + 1, ticketNo: next, subject: form.subject, raisedBy: form.raisedBy, category: form.category, priority: form.priority, assignedTo: form.assignedTo || "Unassigned", created: formatted, status: "Open" }, ...prev]);
    setOpen(false); setForm({ subject: "", raisedBy: "", category: "Maintenance", priority: "Medium", assignedTo: "", description: "" });
    toast({ title: "Ticket raised successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Helpdesk" subtitle="Manage support tickets and requests"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Helpdesk" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Raise Ticket</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Tickets" value={String(156 + (data.length - seed.length))} variant="blue" />
        <KPICard title="Open" value="12" variant="amber" />
        <KPICard title="In Progress" value="8" variant="default" />
        <KPICard title="Resolved" value="136" variant="green" />
      </div>
      <DataTable data={data} columns={columns} searchKey="subject" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Raise Ticket</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Subject *</Label><Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} /></div>
            <div className="space-y-2"><Label className="text-xs">Description</Label><Textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Raised By *</Label><Input value={form.raisedBy} onChange={e => setForm({ ...form, raisedBy: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Assigned To</Label><Input value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
