import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { KPICard } from "@/components/erp/KPICard";
import { ConfirmDialog } from "@/components/erp/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Edit, Trash2, MoreHorizontal, Phone, UserPlus, TrendingUp, Users, ArrowRightLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";

const enquiries = [
  { id: "ENQ001", studentName: "Ritika Jain", class: "5-A", parentName: "Suresh Jain", phone: "9876543101", source: "Walk-in", counsellor: "Neha Gupta", status: "new", date: "2025-04-01" },
  { id: "ENQ002", studentName: "Aditya Rao", class: "8-B", parentName: "Ramesh Rao", phone: "9876543102", source: "Website", counsellor: "Neha Gupta", status: "follow-up", date: "2025-03-28" },
  { id: "ENQ003", studentName: "Simran Kaur", class: "3-A", parentName: "Harpreet Kaur", phone: "9876543103", source: "Referral", counsellor: "Pooja Sharma", status: "converted", date: "2025-03-20" },
  { id: "ENQ004", studentName: "Rahul Mehta", class: "10-A", parentName: "Vijay Mehta", phone: "9876543104", source: "Social Media", counsellor: "Neha Gupta", status: "pending", date: "2025-03-25" },
  { id: "ENQ005", studentName: "Nisha Patel", class: "6-B", parentName: "Kiran Patel", phone: "9876543105", source: "Walk-in", counsellor: "Pooja Sharma", status: "dropped", date: "2025-03-15" },
  { id: "ENQ006", studentName: "Amit Das", class: "7-A", parentName: "Subhash Das", phone: "9876543106", source: "Newspaper Ad", counsellor: "Neha Gupta", status: "new", date: "2025-04-01" },
  { id: "ENQ007", studentName: "Pooja Nair", class: "4-B", parentName: "Raghav Nair", phone: "9876543107", source: "Website", counsellor: "Pooja Sharma", status: "follow-up", date: "2025-03-30" },
  { id: "ENQ008", studentName: "Vivek Sharma", class: "9-C", parentName: "Sunil Sharma", phone: "9876543108", source: "Referral", counsellor: "Neha Gupta", status: "converted", date: "2025-03-18" },
];

type Enquiry = typeof enquiries[number];

const classes = ["1","2","3","4","5","6","7","8","9","10"];
const sources = ["Walk-in","Website","Referral","Social Media","Newspaper Ad","Other"];
const counsellors = ["Neha Gupta", "Pooja Sharma"];

export default function EnquiryList() {
  const navigate = useNavigate();
  const { permissions } = useRole();
  const { toast } = useToast();
  const [data, setData] = useState<Enquiry[]>(enquiries);
  const [form, setForm] = useState({ studentName: "", class: "", parentName: "", phone: "", source: "", counsellor: "", notes: "" });
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingName, setDeletingName] = useState("");

  const saveEnquiry = () => {
    if (!form.studentName.trim() || !form.class || !form.parentName.trim() || !form.phone.trim()) {
      toast({ title: "Required fields missing", description: "Please enter student name, class, parent name and phone.", variant: "destructive" });
      return;
    }

    const nextId = `ENQ${String(data.length + 1).padStart(3, "0")}`;
    setData(prev => [
      {
        id: nextId,
        studentName: form.studentName.trim(),
        class: form.class,
        parentName: form.parentName.trim(),
        phone: form.phone.trim(),
        source: form.source || "Walk-in",
        counsellor: form.counsellor || "Neha Gupta",
        status: "new",
        date: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setForm({ studentName: "", class: "", parentName: "", phone: "", source: "", counsellor: "", notes: "" });
    setCreateOpen(false);
    toast({ title: "Enquiry Created", description: "New enquiry has been added." });
  };

  const columns = [
    {
      key: "studentName", header: "Student",
      render: (row: Enquiry) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/admissions/enquiries/${row.id}`)}>
          <Avatar className="h-8 w-8"><AvatarFallback className="bg-info/10 text-info text-xs font-medium">{row.studentName.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
          <div>
            <p className="text-sm font-medium hover:text-accent transition-colors">{row.studentName}</p>
            <p className="text-xs text-muted-foreground">{row.id} · Class {row.class}</p>
          </div>
        </div>
      ),
    },
    { key: "parentName", header: "Parent" },
    { key: "phone", header: "Phone" },
    { key: "source", header: "Source" },
    { key: "counsellor", header: "Counsellor" },
    { key: "date", header: "Date" },
    { key: "status", header: "Status", render: (row: Enquiry) => <StatusBadge status={row.status as any} /> },
    {
      key: "actions", header: "",
      render: (row: Enquiry) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate(`/admissions/enquiries/${row.id}`)}><Eye className="h-3.5 w-3.5" />View</DropdownMenuItem>
            {permissions.canEdit && <DropdownMenuItem className="gap-2 cursor-pointer"><Edit className="h-3.5 w-3.5" />Edit</DropdownMenuItem>}
            {permissions.canManageAdmissions && row.status !== "converted" && <DropdownMenuItem className="gap-2 cursor-pointer"><ArrowRightLeft className="h-3.5 w-3.5" />Convert to Admission</DropdownMenuItem>}
            {permissions.canDelete && (<><DropdownMenuSeparator /><DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => { setDeletingName(row.studentName); setDeleteOpen(true); }}><Trash2 className="h-3.5 w-3.5" />Delete</DropdownMenuItem></>)}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Admission Enquiries"
        subtitle="Track and manage admission enquiries and follow-ups"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admissions" }, { label: "Enquiries" }]}
        actions={permissions.canManageAdmissions ? <Button className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> New Enquiry</Button> : undefined}
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Enquiries" value={String(data.length)} change="18%" changeType="up" icon={Users} variant="info" />
        <KPICard title="New This Week" value="24" icon={UserPlus} />
        <KPICard title="Converted" value="45" subtitle="47% conversion" icon={TrendingUp} variant="success" />
        <KPICard title="Pending Follow-up" value="18" icon={Phone} variant="warning" />
      </div>
      <DataTable columns={columns} data={data} searchPlaceholder="Search enquiries..." />

      {/* Create Enquiry Modal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>New Enquiry</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Student Name *</Label><Input placeholder="Full name" value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Class Applied *</Label>
                <Select value={form.class} onValueChange={v => setForm({ ...form, class: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{classes.map(c => <SelectItem key={c} value={`${c}-A`}>Class {c}</SelectItem>)}</SelectContent></Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Parent Name *</Label><Input placeholder="Parent/guardian name" value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Phone *</Label><Input placeholder="Phone number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Source</Label>
                <Select value={form.source} onValueChange={v => setForm({ ...form, source: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{sources.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Counsellor</Label>
                <Select value={form.counsellor} onValueChange={v => setForm({ ...form, counsellor: v })}><SelectTrigger><SelectValue placeholder="Assign" /></SelectTrigger><SelectContent>{counsellors.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
              </div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Notes</Label><Textarea placeholder="Additional notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-orange-dark" onClick={saveEnquiry}>Save Enquiry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Enquiry" description={`Delete enquiry for ${deletingName}?`} confirmLabel="Delete" onConfirm={() => toast({ title: "Enquiry Deleted" })} />
    </div>
  );
}
