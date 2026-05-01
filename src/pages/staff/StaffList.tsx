import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { ConfirmDialog } from "@/components/erp/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";
import { getStaffRecords, StaffMember } from "./staffStore";

export default function StaffList() {
  const navigate = useNavigate();
  const { permissions } = useRole();
  const { toast } = useToast();
  const [staff] = useState<StaffMember[]>(() => getStaffRecords());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingName, setDeletingName] = useState("");

  const columns = [
    {
      key: "name", header: "Staff Member",
      render: (row: StaffMember) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/staff/${row.id}`)}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{row.name.split(" ").filter(n => n.length > 1).map(n => n[0]).join("").slice(0,2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium hover:text-accent transition-colors">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.id}</p>
          </div>
        </div>
      ),
    },
    { key: "dept", header: "Department" },
    { key: "designation", header: "Designation" },
    { key: "phone", header: "Phone" },
    { key: "email", header: "Email" },
    { key: "status", header: "Status", render: (row: StaffMember) => <StatusBadge status={row.status as any} /> },
    {
      key: "actions", header: "",
      render: (row: StaffMember) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate(`/staff/${row.id}`)}><Eye className="h-3.5 w-3.5" />View</DropdownMenuItem>
            {permissions.canEdit && <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate(`/staff/${row.id}/edit`)}><Edit className="h-3.5 w-3.5" />Edit</DropdownMenuItem>}
            {permissions.canDelete && (<><DropdownMenuSeparator /><DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => { setDeletingName(row.name); setDeleteOpen(true); }}><Trash2 className="h-3.5 w-3.5" />Delete</DropdownMenuItem></>)}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="All Staff"
        subtitle="Manage staff records, departments, and roles"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staff" }, { label: "All Staff" }]}
        actions={permissions.canManageStaff ? <Button className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5" onClick={() => navigate("/staff/new")}><Plus className="h-4 w-4" /> Add Staff</Button> : undefined}
      />
      <DataTable columns={columns} data={staff} searchPlaceholder="Search staff by name, department..." />
      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Staff" description={`Are you sure you want to delete ${deletingName}?`} confirmLabel="Delete" onConfirm={() => toast({ title: "Staff Deleted", description: `${deletingName} has been removed.` })} />
    </div>
  );
}
