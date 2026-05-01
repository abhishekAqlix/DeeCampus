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
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: 1, number: "DL-01-AB-1234", type: "Bus", capacity: 45, driver: "Ramesh Kumar", route: "Route 1 - Dwarka", insurance: "Valid", status: "Active" },
  { id: 2, number: "DL-01-CD-5678", type: "Bus", capacity: 45, driver: "Suresh Singh", route: "Route 2 - Janakpuri", insurance: "Valid", status: "Active" },
  { id: 3, number: "DL-01-EF-9012", type: "Mini Bus", capacity: 25, driver: "Mahesh Yadav", route: "Route 3 - Rohini", insurance: "Expiring", status: "Active" },
  { id: 4, number: "DL-01-GH-3456", type: "Van", capacity: 12, driver: "Dinesh Sharma", route: "Route 5 - Pitampura", insurance: "Valid", status: "Active" },
  { id: 5, number: "DL-01-IJ-7890", type: "Bus", capacity: 45, driver: "—", route: "—", insurance: "Expired", status: "Inactive" },
];

const columns = [
  { key: "number" as const, label: "Vehicle No", sortable: true },
  { key: "type" as const, label: "Type" },
  { key: "capacity" as const, label: "Capacity" },
  { key: "driver" as const, label: "Driver" },
  { key: "route" as const, label: "Assigned Route" },
  { key: "insurance" as const, label: "Insurance", render: (v: string) => <StatusBadge status={v === "Valid" ? "active" : v === "Expiring" ? "pending" : "cancelled"} label={v} /> },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "Active" ? "active" : "inactive"} label={v} /> },
];

export default function Vehicles() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ number: "", type: "Bus", capacity: "", driver: "", route: "" });

  const save = () => {
    if (!form.number.trim()) { toast({ title: "Vehicle number required", variant: "destructive" }); return; }
    setData(prev => [...prev, { id: prev.length + 1, number: form.number, type: form.type, capacity: Number(form.capacity) || 0, driver: form.driver || "—", route: form.route || "—", insurance: "Valid", status: "Active" }]);
    setOpen(false); setForm({ number: "", type: "Bus", capacity: "", driver: "", route: "" });
    toast({ title: "Vehicle added successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Vehicles" subtitle="Manage school transport fleet"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Transport" }, { label: "Vehicles" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Add Vehicle</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Vehicles" value={String(data.length)} variant="blue" />
        <KPICard title="Active" value="10" variant="green" />
        <KPICard title="Under Maintenance" value="1" variant="amber" />
        <KPICard title="Insurance Expiring" value="2" variant="red" />
      </div>
      <DataTable data={data} columns={columns} searchKey="number" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Vehicle</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Vehicle No *</Label><Input placeholder="DL-01-XX-0000" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="Mini Bus">Mini Bus</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Capacity</Label><Input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Driver</Label><Input value={form.driver} onChange={e => setForm({ ...form, driver: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Assigned Route</Label><Input value={form.route} onChange={e => setForm({ ...form, route: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
