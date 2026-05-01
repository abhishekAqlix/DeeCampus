import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { ActivityTimeline } from "@/components/erp/ActivityTimeline";
import { ConfirmDialog } from "@/components/erp/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRole } from "@/contexts/RoleContext";
import { Edit, Trash2, Printer, Download, Phone, Mail, MapPin, Briefcase, Calendar, FileText, CreditCard } from "lucide-react";

const staffData = {
  id: "EMP001", name: "Dr. Meera Krishnan", dept: "Mathematics", designation: "HOD", status: "active",
  gender: "Female", dob: "1985-03-12", phone: "9876543001", email: "meera.k@school.com",
  address: "15, Jayanagar, Bangalore - 560011", joinDate: "2018-06-15",
  qualification: "Ph.D. Mathematics", experience: "12 years", bankName: "SBI", bankAccount: "XXXXXXXX1234", ifsc: "SBIN0001234",
  salary: 65000, epf: "KA/BNG/12345", pan: "ABCDE1234F",
};

const timeline = [
  { title: "Salary credited — ₹65,000", description: "March 2025", time: "Apr 1, 2025", type: "success" as const },
  { title: "Leave approved — 2 days casual leave", time: "Mar 20, 2025", type: "info" as const },
  { title: "Attendance: 26/26 working days", time: "Mar 1, 2025", type: "success" as const },
  { title: "Performance review completed", description: "Rating: Excellent", time: "Jan 15, 2025", type: "info" as const },
  { title: "Joined as HOD, Mathematics", time: "Jun 15, 2018", type: "success" as const },
];

export default function StaffDetail() {
  const navigate = useNavigate();
  const { permissions } = useRole();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const d = staffData;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title={d.name}
        subtitle={`${d.id} · ${d.dept} · ${d.designation}`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staff", href: "/staff" }, { label: d.name }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5"><Printer className="h-3.5 w-3.5" /> Print</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
            {permissions.canManageStaff && (
              <>
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate(`/staff/${d.id}/edit`)}><Edit className="h-3.5 w-3.5" /> Edit</Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
              </>
            )}
          </div>
        }
      />

      <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in">
        <div className="flex items-start gap-5">
          <Avatar className="h-16 w-16"><AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">MK</AvatarFallback></Avatar>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-xs text-muted-foreground">Full Name</p><p className="text-sm font-medium">{d.name}</p></div>
            <div><p className="text-xs text-muted-foreground">Department</p><p className="text-sm font-medium">{d.dept}</p></div>
            <div><p className="text-xs text-muted-foreground">Designation</p><p className="text-sm font-medium">{d.designation}</p></div>
            <div><p className="text-xs text-muted-foreground">Status</p><StatusBadge status={d.status as any} /></div>
            <div><p className="text-xs text-muted-foreground">Join Date</p><p className="text-sm font-medium">{d.joinDate}</p></div>
            <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium">{d.phone}</p></div>
            <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium">{d.email}</p></div>
            <div><p className="text-xs text-muted-foreground">Qualification</p><p className="text-sm font-medium">{d.qualification}</p></div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="animate-fade-in">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="salary">Salary & Bank</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Briefcase className="h-4 w-4 text-accent" /> Personal & Professional</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
              {[["Date of Birth", d.dob], ["Gender", d.gender], ["Experience", d.experience], ["Qualification", d.qualification], ["PAN", d.pan], ["EPF No.", d.epf]].map(([l, v]) => (
                <div key={l}><p className="text-xs text-muted-foreground">{l}</p><p className="text-sm font-medium">{v}</p></div>
              ))}
            </div>
            <div className="mt-4"><p className="text-xs text-muted-foreground">Address</p><p className="text-sm font-medium flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {d.address}</p></div>
          </div>
        </TabsContent>

        <TabsContent value="salary" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><CreditCard className="h-4 w-4 text-accent" /> Salary & Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
              <div><p className="text-xs text-muted-foreground">Monthly Salary</p><p className="text-sm font-semibold text-accent">₹{d.salary.toLocaleString()}</p></div>
              <div><p className="text-xs text-muted-foreground">Bank Name</p><p className="text-sm font-medium">{d.bankName}</p></div>
              <div><p className="text-xs text-muted-foreground">Account No.</p><p className="text-sm font-medium">{d.bankAccount}</p></div>
              <div><p className="text-xs text-muted-foreground">IFSC</p><p className="text-sm font-medium">{d.ifsc}</p></div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-accent" /> Documents</h3>
            {["Resume/CV", "ID Proof", "Qualification Certificates", "Experience Letters", "PAN Card"].map(doc => (
              <div key={doc} className="flex items-center justify-between p-3 rounded-lg border mb-2 hover:bg-secondary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center"><FileText className="h-4 w-4 text-accent" /></div>
                  <p className="text-sm font-medium">{doc}</p>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> Activity Timeline</h3>
            <ActivityTimeline items={timeline} />
          </div>
        </TabsContent>
      </Tabs>

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Staff" description={`Are you sure you want to delete ${d.name}?`} confirmLabel="Delete" onConfirm={() => navigate("/staff")} />
    </div>
  );
}
