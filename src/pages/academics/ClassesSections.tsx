import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/erp/KPICard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: 1, class: "Nursery", sections: "A, B", classTeacher: "Mrs. Sharma", totalStudents: 60, capacity: 80, status: "Active" },
  { id: 2, class: "LKG", sections: "A, B", classTeacher: "Mrs. Gupta", totalStudents: 58, capacity: 80, status: "Active" },
  { id: 3, class: "UKG", sections: "A, B, C", classTeacher: "Mrs. Patel", totalStudents: 85, capacity: 120, status: "Active" },
  { id: 4, class: "Class 1", sections: "A, B, C", classTeacher: "Mr. Verma", totalStudents: 92, capacity: 120, status: "Active" },
  { id: 5, class: "Class 5", sections: "A, B", classTeacher: "Mrs. Joshi", totalStudents: 72, capacity: 80, status: "Active" },
  { id: 6, class: "Class 8", sections: "A, B, C", classTeacher: "Mr. Singh", totalStudents: 110, capacity: 120, status: "Active" },
  { id: 7, class: "Class 10", sections: "A, B, C, D", classTeacher: "Mr. Thakur", totalStudents: 148, capacity: 160, status: "Active" },
  { id: 8, class: "Class 12", sections: "Sci, Com, Arts", classTeacher: "Mrs. Kapoor", totalStudents: 96, capacity: 120, status: "Active" },
];

const columns = [
  { key: "class" as const, label: "Class", sortable: true },
  { key: "sections" as const, label: "Sections" },
  { key: "classTeacher" as const, label: "Class Teacher" },
  { key: "totalStudents" as const, label: "Students" },
  { key: "capacity" as const, label: "Capacity" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status="active" label={v} /> },
];

export default function ClassesSections() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ class: "", sections: "", classTeacher: "", capacity: "" });

  const save = () => {
    if (!form.class.trim()) { toast({ title: "Class name required", variant: "destructive" }); return; }
    setData(prev => [...prev, { id: prev.length + 1, class: form.class, sections: form.sections, classTeacher: form.classTeacher, totalStudents: 0, capacity: Number(form.capacity) || 0, status: "Active" }]);
    setOpen(false); setForm({ class: "", sections: "", classTeacher: "", capacity: "" });
    toast({ title: "Class added successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Classes & Sections" subtitle="Manage class structure and sections"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academics" }, { label: "Classes & Sections" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Add Class</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Classes" value={String(data.length)} variant="blue" />
        <KPICard title="Total Sections" value="38" variant="default" />
        <KPICard title="Total Students" value="1,847" variant="green" />
        <KPICard title="Avg per Section" value="49" variant="amber" />
      </div>
      <DataTable data={data} columns={columns} searchKey="class" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Class</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Class Name *</Label><Input placeholder="e.g., Class 6" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} /></div>
            <div className="space-y-2"><Label className="text-xs">Sections</Label><Input placeholder="e.g., A, B, C" value={form.sections} onChange={e => setForm({ ...form, sections: e.target.value })} /></div>
            <div className="space-y-2"><Label className="text-xs">Class Teacher</Label><Input placeholder="Teacher name" value={form.classTeacher} onChange={e => setForm({ ...form, classTeacher: e.target.value })} /></div>
            <div className="space-y-2"><Label className="text-xs">Capacity</Label><Input type="number" placeholder="120" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} /></div>
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
