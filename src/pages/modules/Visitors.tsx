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
  { id: 1, name: "Mr. R. Sharma", purpose: "Parent Meeting", toMeet: "Mrs. Gupta", checkIn: "09:30 AM", checkOut: "10:15 AM", idType: "Aadhar", status: "Checked Out" },
  { id: 2, name: "Delivery - Amazon", purpose: "Package Delivery", toMeet: "Admin Office", checkIn: "10:00 AM", checkOut: "10:05 AM", idType: "DL", status: "Checked Out" },
  { id: 3, name: "Mrs. K. Patel", purpose: "Admission Enquiry", toMeet: "Front Office", checkIn: "11:00 AM", checkOut: "—", idType: "Aadhar", status: "In Premises" },
  { id: 4, name: "Mr. V. Singh", purpose: "Vendor Meeting", toMeet: "Principal", checkIn: "11:30 AM", checkOut: "—", idType: "PAN", status: "In Premises" },
  { id: 5, name: "Inspector Rao", purpose: "Inspection", toMeet: "Director", checkIn: "02:00 PM", checkOut: "", idType: "Govt ID", status: "Expected" },
];

const columns = [
  { key: "name" as const, label: "Visitor", sortable: true },
  { key: "purpose" as const, label: "Purpose" },
  { key: "toMeet" as const, label: "To Meet" },
  { key: "checkIn" as const, label: "Check In" },
  { key: "checkOut" as const, label: "Check Out", render: (v: string) => v || "—" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "Checked Out" ? "active" : v === "In Premises" ? "pending" : "draft"} label={v} /> },
];

export default function VisitorsPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ name: "", purpose: "", toMeet: "", idType: "Aadhar", phone: "" });

  const save = () => {
    if (!form.name.trim() || !form.purpose.trim()) { toast({ title: "Name and purpose required", variant: "destructive" }); return; }
    const time = new Date().toLocaleTimeString("en", { hour: "numeric", minute: "2-digit", hour12: true });
    setData(prev => [{ id: prev.length + 1, name: form.name, purpose: form.purpose, toMeet: form.toMeet, checkIn: time, checkOut: "—", idType: form.idType, status: "In Premises" }, ...prev]);
    setOpen(false); setForm({ name: "", purpose: "", toMeet: "", idType: "Aadhar", phone: "" });
    toast({ title: "Visitor checked in successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Visitor Management" subtitle="Track visitor check-in and check-out"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Visitors" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Check In Visitor</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Today's Visitors" value={String(12 + (data.length - seed.length))} variant="blue" />
        <KPICard title="In Premises" value="3" variant="amber" />
        <KPICard title="Checked Out" value="8" variant="green" />
        <KPICard title="Expected" value="2" variant="default" />
      </div>
      <DataTable data={data} columns={columns} searchKey="name" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Check In Visitor</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Visitor Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Purpose *</Label><Input placeholder="e.g., Parent Meeting" value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">To Meet</Label><Input value={form.toMeet} onChange={e => setForm({ ...form, toMeet: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">ID Type</Label>
                <Select value={form.idType} onValueChange={v => setForm({ ...form, idType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aadhar">Aadhar</SelectItem>
                    <SelectItem value="PAN">PAN</SelectItem>
                    <SelectItem value="DL">Driving License</SelectItem>
                    <SelectItem value="Govt ID">Govt ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Check In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
