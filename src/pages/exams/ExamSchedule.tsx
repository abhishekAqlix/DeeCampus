import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { ConfirmDialog } from "@/components/erp/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Eye, Edit, Trash2, MoreHorizontal, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";

const exams = [
  { id: "EXM001", name: "Mid Term Examination", type: "Term Exam", classes: "1–10", startDate: "2025-04-20", endDate: "2025-04-30", status: "active" },
  { id: "EXM002", name: "Unit Test 1", type: "Unit Test", classes: "6–10", startDate: "2025-03-10", endDate: "2025-03-12", status: "approved" },
  { id: "EXM003", name: "Half Yearly", type: "Term Exam", classes: "1–10", startDate: "2025-09-15", endDate: "2025-09-30", status: "draft" },
  { id: "EXM004", name: "Pre-Board", type: "Board Prep", classes: "10", startDate: "2025-12-01", endDate: "2025-12-15", status: "draft" },
  { id: "EXM005", name: "Annual Examination", type: "Term Exam", classes: "1–10", startDate: "2026-02-20", endDate: "2026-03-10", status: "draft" },
  { id: "EXM006", name: "Unit Test 2", type: "Unit Test", classes: "6–10", startDate: "2025-06-05", endDate: "2025-06-07", status: "pending" },
];

export default function ExamSchedule() {
  const { permissions } = useRole();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingName, setDeletingName] = useState("");

  const columns = [
    {
      key: "name", header: "Exam",
      render: (row: typeof exams[0]) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center"><Calendar className="h-4 w-4 text-accent" /></div>
          <div>
            <p className="text-sm font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.id} · {row.type}</p>
          </div>
        </div>
      ),
    },
    { key: "classes", header: "Classes" },
    { key: "startDate", header: "Start Date" },
    { key: "endDate", header: "End Date" },
    { key: "status", header: "Status", render: (row: typeof exams[0]) => <StatusBadge status={row.status as any} /> },
    {
      key: "actions", header: "",
      render: (row: typeof exams[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2 cursor-pointer"><Eye className="h-3.5 w-3.5" />View</DropdownMenuItem>
            {permissions.canEdit && <DropdownMenuItem className="gap-2 cursor-pointer"><Edit className="h-3.5 w-3.5" />Edit</DropdownMenuItem>}
            {permissions.canDelete && (<><DropdownMenuSeparator /><DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => { setDeletingName(row.name); setDeleteOpen(true); }}><Trash2 className="h-3.5 w-3.5" />Delete</DropdownMenuItem></>)}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Exam Schedule"
        subtitle="Plan and manage examinations across all classes"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Exams" }, { label: "Schedule" }]}
        actions={permissions.canCreate ? <Button className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Create Exam</Button> : undefined}
      />
      <DataTable columns={columns} data={exams} searchPlaceholder="Search exams..." />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Create Exam</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Exam Name *</Label><Input placeholder="e.g., Mid Term Examination" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Exam Type *</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="term">Term Exam</SelectItem><SelectItem value="unit">Unit Test</SelectItem><SelectItem value="board">Board Prep</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Classes *</Label><Input placeholder="e.g., 1–10" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Start Date *</Label><Input type="date" /></div>
              <div className="space-y-2"><Label className="text-xs">End Date *</Label><Input type="date" /></div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Description</Label><Textarea placeholder="Exam details..." /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-orange-dark" onClick={() => { setCreateOpen(false); toast({ title: "Exam Created" }); }}>Create Exam</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Exam" description={`Delete ${deletingName}? All related marks and schedules will be removed.`} confirmLabel="Delete" onConfirm={() => toast({ title: "Exam Deleted" })} />
    </div>
  );
}
