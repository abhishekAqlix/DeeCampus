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
  { id: 1, name: "Mathematics", code: "MATH", type: "Core", classes: "1-12", teachers: 6, status: "Active" },
  { id: 2, name: "English", code: "ENG", type: "Core", classes: "1-12", teachers: 5, status: "Active" },
  { id: 3, name: "Hindi", code: "HIN", type: "Core", classes: "1-12", teachers: 4, status: "Active" },
  { id: 4, name: "Science", code: "SCI", type: "Core", classes: "1-10", teachers: 5, status: "Active" },
  { id: 5, name: "Physics", code: "PHY", type: "Core", classes: "11-12", teachers: 2, status: "Active" },
  { id: 6, name: "Computer Science", code: "CS", type: "Elective", classes: "6-12", teachers: 2, status: "Active" },
  { id: 7, name: "Physical Education", code: "PE", type: "Core", classes: "1-12", teachers: 2, status: "Active" },
  { id: 8, name: "Art & Craft", code: "ART", type: "Elective", classes: "1-8", teachers: 1, status: "Active" },
];

const columns = [
  { key: "name" as const, label: "Subject", sortable: true },
  { key: "code" as const, label: "Code" },
  { key: "type" as const, label: "Type", render: (v: string) => <StatusBadge status={v === "Core" ? "active" : "pending"} label={v} /> },
  { key: "classes" as const, label: "Classes" },
  { key: "teachers" as const, label: "Teachers" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status="active" label={v} /> },
];

export default function Subjects() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ name: "", code: "", type: "Core", classes: "" });

  const save = () => {
    if (!form.name.trim() || !form.code.trim()) { toast({ title: "Name and code required", variant: "destructive" }); return; }
    setData(prev => [...prev, { id: prev.length + 1, name: form.name, code: form.code, type: form.type, classes: form.classes, teachers: 0, status: "Active" }]);
    setOpen(false); setForm({ name: "", code: "", type: "Core", classes: "" });
    toast({ title: "Subject added successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Subjects" subtitle="Manage subjects and assignments"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academics" }, { label: "Subjects" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Add Subject</Button>}
      />
      <DataTable data={data} columns={columns} searchKey="name" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Subject</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Subject Name *</Label><Input placeholder="e.g., Biology" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Code *</Label><Input placeholder="BIO" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Type</Label>
              <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="Core">Core</SelectItem><SelectItem value="Elective">Elective</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label className="text-xs">Classes</Label><Input placeholder="e.g., 9-12" value={form.classes} onChange={e => setForm({ ...form, classes: e.target.value })} /></div>
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
