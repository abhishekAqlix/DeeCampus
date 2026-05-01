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

const students = [
  { id: "STU001", name: "Aarav Sharma", class: "10-A", roll: 1, guardian: "Rajesh Sharma", phone: "9876543210", status: "active", gender: "M", dob: "2010-05-14", fees: "paid" },
  { id: "STU002", name: "Ananya Gupta", class: "8-B", roll: 3, guardian: "Sanjay Gupta", phone: "9876543211", status: "active", gender: "F", dob: "2012-08-22", fees: "partial" },
  { id: "STU003", name: "Rohit Patel", class: "10-A", roll: 5, guardian: "Mahesh Patel", phone: "9876543212", status: "active", gender: "M", dob: "2010-01-30", fees: "paid" },
  { id: "STU004", name: "Priya Singh", class: "9-C", roll: 2, guardian: "Vikram Singh", phone: "9876543213", status: "active", gender: "F", dob: "2011-03-17", fees: "overdue" },
  { id: "STU005", name: "Karan Verma", class: "7-A", roll: 8, guardian: "Alok Verma", phone: "9876543214", status: "inactive", gender: "M", dob: "2013-11-05", fees: "cancelled" },
  { id: "STU006", name: "Sneha Reddy", class: "6-B", roll: 4, guardian: "Suresh Reddy", phone: "9876543215", status: "active", gender: "F", dob: "2014-07-19", fees: "paid" },
  { id: "STU007", name: "Arjun Nair", class: "10-A", roll: 7, guardian: "Krishna Nair", phone: "9876543216", status: "active", gender: "M", dob: "2010-09-02", fees: "partial" },
  { id: "STU008", name: "Divya Mishra", class: "5-A", roll: 1, guardian: "Ramesh Mishra", phone: "9876543217", status: "active", gender: "F", dob: "2015-02-28", fees: "paid" },
  { id: "STU009", name: "Vikash Kumar", class: "9-C", roll: 6, guardian: "Dinesh Kumar", phone: "9876543218", status: "active", gender: "M", dob: "2011-06-10", fees: "overdue" },
  { id: "STU010", name: "Meera Joshi", class: "8-B", roll: 9, guardian: "Prakash Joshi", phone: "9876543219", status: "active", gender: "F", dob: "2012-12-25", fees: "paid" },
  { id: "STU011", name: "Nikhil Thakur", class: "7-A", roll: 2, guardian: "Sunil Thakur", phone: "9876543220", status: "active", gender: "M", dob: "2013-04-08", fees: "paid" },
  { id: "STU012", name: "Riya Chopra", class: "6-B", roll: 11, guardian: "Anil Chopra", phone: "9876543221", status: "active", gender: "F", dob: "2014-10-16", fees: "pending" },
];

export default function StudentList() {
  const navigate = useNavigate();
  const { permissions } = useRole();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<string>("");

  const columns = [
    {
      key: "name", header: "Student",
      render: (row: typeof students[0]) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/students/${row.id}`)}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{row.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium hover:text-accent transition-colors">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.id}</p>
          </div>
        </div>
      ),
    },
    { key: "class", header: "Class" },
    { key: "roll", header: "Roll No." },
    { key: "guardian", header: "Guardian" },
    { key: "phone", header: "Phone" },
    { key: "fees", header: "Fee Status", render: (row: typeof students[0]) => <StatusBadge status={row.fees as any} /> },
    { key: "status", header: "Status", render: (row: typeof students[0]) => <StatusBadge status={row.status as any} /> },
    {
      key: "actions", header: "",
      render: (row: typeof students[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate(`/students/${row.id}`)}><Eye className="h-3.5 w-3.5" />View</DropdownMenuItem>
            {permissions.canEdit && <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate(`/students/${row.id}/edit`)}><Edit className="h-3.5 w-3.5" />Edit</DropdownMenuItem>}
            {permissions.canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => { setDeletingStudent(row.name); setDeleteOpen(true); }}><Trash2 className="h-3.5 w-3.5" />Delete</DropdownMenuItem>
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
            <Button className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5" onClick={() => navigate("/students/new")}>
              <Plus className="h-4 w-4" /> New Admission
            </Button>
          ) : undefined
        }
      />
      <DataTable columns={columns} data={students} searchPlaceholder="Search students by name, ID, class..." />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Student"
        description={`Are you sure you want to delete ${deletingStudent}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => toast({ title: "Student Deleted", description: `${deletingStudent} has been removed.` })}
      />
    </div>
  );
}
