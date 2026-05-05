import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { ConfirmDialog } from "@/components/erp/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";
import { deleteStudentRequest, listStudentsRequest, StudentDto } from "@/api/school-api";

type Row = {
  id: string;
  name: string;
  code: string;
  classLabel: string;
  roll: number | string;
  guardian: string;
  phone: string;
  fees: string;
  status: string;
};

function mapRow(s: StudentDto): Row {
  const guardian = s.guardian?.fatherName?.trim() || "—";
  const classLabel =
    s.className && s.section ? `${s.className}-${s.section}` : s.className || s.section || "—";
  return {
    id: s.id,
    name: s.fullName,
    code: s.studentCode,
    classLabel,
    roll: s.rollNo ?? "—",
    guardian,
    phone: s.phone || s.guardian?.fatherPhone || "—",
    fees: "—",
    status: s.status === "Active" ? "active" : "inactive",
  };
}

export default function StudentList() {
  const navigate = useNavigate();
  const { permissions } = useRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<{ id: string; name: string } | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await listStudentsRequest();
      return res.items.map(mapRow);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStudentRequest(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student deleted" });
    },
    onError: (err: Error) => {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    },
  });

  const rows = useMemo(() => data ?? [], [data]);

  const columns = [
    {
      key: "name",
      header: "Student",
      render: (row: Row) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/students/${row.id}`)}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {row.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 3)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium hover:text-accent transition-colors">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.code}</p>
          </div>
        </div>
      ),
    },
    { key: "classLabel", header: "Class" },
    { key: "roll", header: "Roll No." },
    { key: "guardian", header: "Guardian" },
    { key: "phone", header: "Phone" },
    {
      key: "fees",
      header: "Fee Status",
      render: (row: Row) => <StatusBadge status="pending" label={row.fees} />,
    },
    {
      key: "status",
      header: "Status",
      render: (row: Row) => <StatusBadge status={row.status as "active" | "inactive"} />,
    },
    {
      key: "actions",
      header: "",
      render: (row: Row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate(`/students/${row.id}`)}>
              <Eye className="h-3.5 w-3.5" />
              View
            </DropdownMenuItem>
            {permissions.canEdit && (
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate(`/students/${row.id}/edit`)}>
                <Edit className="h-3.5 w-3.5" />
                Edit
              </DropdownMenuItem>
            )}
            {permissions.canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 cursor-pointer text-destructive"
                  onClick={() => {
                    setDeleting({ id: row.id, name: row.name });
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="All Students"
        subtitle="Manage student records, enrollment, and profiles"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Students" }, { label: "All Students" }]}
        actions={
          permissions.canCreate ? (
            <Button
              className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5"
              onClick={() => navigate("/students/new")}
            >
              <Plus className="h-4 w-4" /> New Admission
            </Button>
          ) : undefined
        }
      />
      {isLoading && <p className="text-sm text-muted-foreground">Loading students…</p>}
      {isError && (
        <p className="text-sm text-destructive">
          {(error as Error).message || "Unable to load students (check that you are signed in as Admin)."}
        </p>
      )}
      {!isLoading && !isError && <DataTable columns={columns} data={rows} searchPlaceholder="Search students by name, ID, class..." />}

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Student"
        description={`Are you sure you want to delete ${deleting?.name ?? ""}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (!deleting) return;
          void deleteMutation.mutateAsync(deleting.id);
          setDeleting(null);
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}
