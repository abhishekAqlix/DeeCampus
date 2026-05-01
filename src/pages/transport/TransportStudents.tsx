import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: 1, student: "Aarav Sharma", class: "10-A", route: "Route 1 - Dwarka", stop: "Sector 12", vehicle: "DL-01-AB-1234", fee: "₹3,000/mo", status: "Active" },
  { id: 2, student: "Priya Patel", class: "9-B", route: "Route 2 - Janakpuri", stop: "C-Block", vehicle: "DL-01-CD-5678", fee: "₹2,500/mo", status: "Active" },
  { id: 3, student: "Rohan Gupta", class: "8-A", route: "Route 3 - Rohini", stop: "Sector 7", vehicle: "DL-01-EF-9012", fee: "₹3,500/mo", status: "Active" },
  { id: 4, student: "Sneha Joshi", class: "7-A", route: "Route 1 - Dwarka", stop: "Sector 21", vehicle: "DL-01-AB-1234", fee: "₹3,000/mo", status: "Active" },
  { id: 5, student: "Karan Singh", class: "6-B", route: "Route 5 - Pitampura", stop: "Main Market", vehicle: "DL-01-GH-3456", fee: "₹2,000/mo", status: "Pending" },
];

const columns = [
  { key: "student" as const, label: "Student", sortable: true },
  { key: "class" as const, label: "Class" },
  { key: "route" as const, label: "Route" },
  { key: "stop" as const, label: "Stop" },
  { key: "vehicle" as const, label: "Vehicle" },
  { key: "fee" as const, label: "Fee" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "Active" ? "active" : "pending"} label={v} /> },
];

export default function TransportStudents() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ student: "", class: "", route: "Route 1 - Dwarka", stop: "", vehicle: "", fee: "" });

  const save = () => {
    if (!form.student.trim() || !form.class.trim()) { toast({ title: "Student and class required", variant: "destructive" }); return; }
    setData(prev => [...prev, { id: prev.length + 1, student: form.student, class: form.class, route: form.route, stop: form.stop, vehicle: form.vehicle, fee: `₹${form.fee || 0}/mo`, status: "Active" }]);
    setOpen(false); setForm({ student: "", class: "", route: "Route 1 - Dwarka", stop: "", vehicle: "", fee: "" });
    toast({ title: "Student enrolled in transport successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Transport Students" subtitle="Manage students enrolled in transport"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Transport" }, { label: "Students" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Enroll Student</Button>}
      />
      <DataTable data={data} columns={columns} searchKey="student" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enroll Student in Transport</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Student Name *</Label><Input value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Class *</Label><Input placeholder="e.g., 10-A" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Route</Label>
              <Select value={form.route} onValueChange={v => setForm({ ...form, route: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Route 1 - Dwarka">Route 1 - Dwarka</SelectItem>
                  <SelectItem value="Route 2 - Janakpuri">Route 2 - Janakpuri</SelectItem>
                  <SelectItem value="Route 3 - Rohini">Route 3 - Rohini</SelectItem>
                  <SelectItem value="Route 5 - Pitampura">Route 5 - Pitampura</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Pickup Stop</Label><Input value={form.stop} onChange={e => setForm({ ...form, stop: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Vehicle</Label><Input placeholder="DL-01-XX-0000" value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Monthly Fee (₹)</Label><Input type="number" value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Enroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
