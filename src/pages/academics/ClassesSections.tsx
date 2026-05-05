import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/erp/KPICard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createClassSectionRequest, deleteClassSectionRequest, listClassSectionsRequest } from "@/api/school-api";

export default function ClassesSections() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ className: "", sections: "", classTeacher: "", capacity: "" });

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["class-sections"],
    queryFn: async () => (await listClassSectionsRequest()).items,
  });

  const createMutation = useMutation({
    mutationFn: async () =>
      createClassSectionRequest({
        className: form.className.trim(),
        sections: form.sections.trim(),
        classTeacher: form.classTeacher.trim(),
        totalStudents: 0,
        capacity: Math.max(1, Number(form.capacity) || 1),
        status: "Active",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["class-sections"] });
      toast({ title: "Class added successfully" });
      setOpen(false);
      setForm({ className: "", sections: "", classTeacher: "", capacity: "" });
    },
    onError: (err: Error) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClassSectionRequest(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["class-sections"] });
      toast({ title: "Class removed" });
    },
    onError: (err: Error) => toast({ title: "Delete failed", description: err.message, variant: "destructive" }),
  });

  const sectionsCount = data.reduce((acc, row) => acc + String(row.sections).split(",").filter(Boolean).length, 0);

  const columns = [
    { key: "class" as const, label: "Class", sortable: true },
    { key: "sections" as const, label: "Sections" },
    { key: "classTeacher" as const, label: "Class Teacher" },
    { key: "totalStudents" as const, label: "Students" },
    { key: "capacity" as const, label: "Capacity" },
    {
      key: "status" as const,
      label: "Status",
      render: (v: string) => <StatusBadge status="active" label={v} />,
    },
    {
      key: "id" as const,
      label: "",
      render: (idVal: string) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive h-8"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("Delete this class record?")) void deleteMutation.mutateAsync(idVal);
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Classes & Sections"
        subtitle="Manage class structure and sections"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academics" }, { label: "Classes & Sections" }]}
        actions={
          <Button onClick={() => setOpen(true)}>+ Add Class</Button>
        }
      />
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && <p className="text-sm text-destructive">{(error as Error).message}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Classes" value={String(data.length)} variant="blue" />
        <KPICard title="Section tokens" value={String(sectionsCount)} variant="default" />
        <KPICard title="Total Students (sum)" value={String(data.reduce((a, r) => a + (r.totalStudents || 0), 0))} variant="green" />
        <KPICard title="Avg capacity" variant="amber" value={data.length ? String(Math.round(data.reduce((a, r) => a + r.capacity, 0) / data.length)) : "0"} />
      </div>
      {!isLoading && !isError && <DataTable data={data} columns={columns} searchKey="class" />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Class</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">Class Name *</Label>
              <Input
                placeholder="e.g., Class 6"
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Sections</Label>
              <Input
                placeholder="e.g., A, B, C"
                value={form.sections}
                onChange={(e) => setForm({ ...form, sections: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Class Teacher</Label>
              <Input
                placeholder="Teacher name"
                value={form.classTeacher}
                onChange={(e) => setForm({ ...form, classTeacher: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Capacity</Label>
              <Input
                type="number"
                placeholder="120"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={createMutation.isPending || !form.className.trim()}
              onClick={() => void createMutation.mutateAsync()}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
