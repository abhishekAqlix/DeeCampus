import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createSubjectRequest, deleteSubjectRequest, listSubjectsRequest } from "@/api/school-api";

export default function Subjects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", type: "Core" as "Core" | "Elective", classes: "" });

  const { data = [], isLoading, isError, error } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => (await listSubjectsRequest()).items,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createSubjectRequest({
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        type: form.type,
        classes: form.classes.trim() || "1-12",
        teachers: 0,
        status: "Active",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast({ title: "Subject added" });
      setOpen(false);
      setForm({ name: "", code: "", type: "Core", classes: "" });
    },
    onError: (err: Error) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (subjectId: string) => deleteSubjectRequest(subjectId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["subjects"] });
      toast({ title: "Subject removed" });
    },
    onError: (err: Error) => toast({ title: "Delete failed", description: err.message, variant: "destructive" }),
  });

  const columns = [
    { key: "name" as const, label: "Subject", sortable: true },
    { key: "code" as const, label: "Code" },
    {
      key: "type" as const,
      label: "Type",
      render: (v: string) => <StatusBadge status={v === "Core" ? "active" : "pending"} label={v} />,
    },
    { key: "classes" as const, label: "Classes" },
    { key: "teachers" as const, label: "Teachers" },
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
            if (confirm("Delete this subject?")) void deleteMutation.mutateAsync(idVal);
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
        title="Subjects"
        subtitle="Manage subjects and assignments"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academics" }, { label: "Subjects" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Add Subject</Button>}
      />
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {isError && <p className="text-sm text-destructive">{(error as Error).message}</p>}
      {!isLoading && !isError && <DataTable data={data} columns={columns} searchKey="name" />}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Subject Name *</Label>
                <Input placeholder="e.g., Biology" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Code *</Label>
                <Input placeholder="BIO" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "Core" | "Elective" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Core">Core</SelectItem>
                  <SelectItem value="Elective">Elective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Classes</Label>
              <Input placeholder="e.g., 9-12" value={form.classes} onChange={(e) => setForm({ ...form, classes: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={createMutation.isPending || !form.name.trim() || !form.code.trim()}
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
