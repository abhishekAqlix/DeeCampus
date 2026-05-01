import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { ActivityTimeline } from "@/components/erp/ActivityTimeline";
import { ConfirmDialog } from "@/components/erp/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRole } from "@/contexts/RoleContext";
import { Edit, Trash2, Printer, Download, Phone, Mail, MapPin, Calendar, GraduationCap, User, FileText, CreditCard } from "lucide-react";

const studentData = {
  id: "STU001", name: "Aarav Sharma", class: "10-A", roll: 1, status: "active",
  gender: "Male", dob: "2010-05-14", bloodGroup: "B+", religion: "Hindu", category: "General",
  aadhar: "1234-5678-9012", phone: "9876543210", email: "aarav.s@email.com",
  address: "42, MG Road, Sector 15, Bangalore - 560001",
  admissionDate: "2020-06-15", admissionNo: "ADM2020-0142",
  guardian: "Rajesh Sharma", guardianPhone: "9876543210", guardianEmail: "rajesh.s@email.com", guardianOccupation: "Business",
  mother: "Sunita Sharma", motherPhone: "9876543222",
  feeStatus: "paid", totalFees: 45000, paidFees: 45000, dueFees: 0,
  attendance: "94.2%", lastPresent: "2025-04-01",
};

const timeline = [
  { title: "Fee payment received — ₹12,500", description: "Receipt #RCP-2025-0342", time: "Apr 1, 2025 · 10:30 AM", type: "success" as const },
  { title: "Attendance marked — Present", time: "Apr 1, 2025 · 9:00 AM", type: "info" as const },
  { title: "Report card generated — Unit Test 1", time: "Mar 15, 2025 · 2:00 PM", type: "info" as const },
  { title: "Parent meeting scheduled", description: "With class teacher Mrs. Verma", time: "Mar 10, 2025 · 11:00 AM", type: "default" as const },
  { title: "Transport route changed to Route 1 - North", time: "Feb 20, 2025 · 3:00 PM", type: "warning" as const },
  { title: "Admission confirmed", description: "Class 10-A, Roll No. 1", time: "Jun 15, 2020 · 10:00 AM", type: "success" as const },
];

const documents = [
  { name: "Birth Certificate", type: "PDF", size: "245 KB", uploaded: "Jun 15, 2020" },
  { name: "Transfer Certificate", type: "PDF", size: "180 KB", uploaded: "Jun 15, 2020" },
  { name: "Aadhar Card", type: "JPG", size: "320 KB", uploaded: "Jun 16, 2020" },
  { name: "Photo (Passport)", type: "JPG", size: "95 KB", uploaded: "Jun 15, 2020" },
  { name: "Report Card - Class 9", type: "PDF", size: "410 KB", uploaded: "Apr 10, 2024" },
];

const feeHistory = [
  { receipt: "RCP-2025-0342", date: "Apr 1, 2025", amount: 12500, mode: "Online", type: "Tuition Fee Q4" },
  { receipt: "RCP-2025-0198", date: "Jan 5, 2025", amount: 12500, mode: "Cash", type: "Tuition Fee Q3" },
  { receipt: "RCP-2024-0856", date: "Oct 8, 2024", amount: 12500, mode: "Cheque", type: "Tuition Fee Q2" },
  { receipt: "RCP-2024-0412", date: "Jul 10, 2024", amount: 7500, mode: "Online", type: "Tuition Fee Q1" },
];

export default function StudentDetail() {
  const navigate = useNavigate();
  const { permissions } = useRole();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const d = studentData;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title={d.name}
        subtitle={`${d.id} · Class ${d.class} · Roll No. ${d.roll}`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Students", href: "/students" }, { label: d.name }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5"><Printer className="h-3.5 w-3.5" /> Print</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Export</Button>
            {permissions.canEdit && (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/students/STU001/edit")}>
                <Edit className="h-3.5 w-3.5" /> Edit
              </Button>
            )}
            {permissions.canDelete && (
              <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            )}
          </div>
        }
      />

      {/* Student Header Card */}
      <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in">
        <div className="flex items-start gap-5">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">AS</AvatarFallback>
          </Avatar>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="text-sm font-medium">{d.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Class & Section</p>
              <p className="text-sm font-medium">{d.class}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Admission No.</p>
              <p className="text-sm font-medium">{d.admissionNo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusBadge status={d.status as any} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Attendance</p>
              <p className="text-sm font-semibold text-success">{d.attendance}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fee Status</p>
              <StatusBadge status={d.feeStatus as any} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Guardian</p>
              <p className="text-sm font-medium">{d.guardian}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{d.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="animate-fade-in">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="guardian">Guardian</TabsTrigger>
          <TabsTrigger value="fees">Fee Ledger</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><User className="h-4 w-4 text-accent" /> Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
              {[
                ["Date of Birth", d.dob], ["Gender", d.gender], ["Blood Group", d.bloodGroup],
                ["Religion", d.religion], ["Category", d.category], ["Aadhar No.", d.aadhar],
                ["Email", d.email], ["Phone", d.phone], ["Admission Date", d.admissionDate],
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{val}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm font-medium flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {d.address}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="guardian" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><User className="h-4 w-4 text-accent" /> Guardian / Parent Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 rounded-lg bg-secondary/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Father</p>
                <div><p className="text-xs text-muted-foreground">Name</p><p className="text-sm font-medium">{d.guardian}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {d.guardianPhone}</p></div>
                <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {d.guardianEmail}</p></div>
                <div><p className="text-xs text-muted-foreground">Occupation</p><p className="text-sm font-medium">{d.guardianOccupation}</p></div>
              </div>
              <div className="space-y-3 p-4 rounded-lg bg-secondary/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mother</p>
                <div><p className="text-xs text-muted-foreground">Name</p><p className="text-sm font-medium">{d.mother}</p></div>
                <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {d.motherPhone}</p></div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fees" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4 text-accent" /> Fee Ledger</h3>
              <div className="flex items-center gap-4 text-sm">
                <span>Total: <span className="font-semibold">₹{d.totalFees.toLocaleString()}</span></span>
                <span>Paid: <span className="font-semibold text-success">₹{d.paidFees.toLocaleString()}</span></span>
                <span>Due: <span className="font-semibold text-destructive">₹{d.dueFees.toLocaleString()}</span></span>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    {["Receipt #", "Date", "Type", "Amount", "Mode"].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feeHistory.map((f, i) => (
                    <tr key={i} className="border-t hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-accent">{f.receipt}</td>
                      <td className="px-4 py-2.5">{f.date}</td>
                      <td className="px-4 py-2.5">{f.type}</td>
                      <td className="px-4 py-2.5 font-medium">₹{f.amount.toLocaleString()}</td>
                      <td className="px-4 py-2.5">{f.mode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-accent" /> Documents</h3>
            <div className="space-y-2">
              {documents.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type} · {doc.size} · Uploaded {doc.uploaded}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1.5"><Download className="h-3.5 w-3.5" /> Download</Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><Calendar className="h-4 w-4 text-accent" /> Activity Timeline</h3>
            <ActivityTimeline items={timeline} />
          </div>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Student"
        description={`Are you sure you want to delete ${d.name}? This action cannot be undone. All associated records including fees, attendance, and exam results will be permanently removed.`}
        confirmLabel="Delete Student"
        onConfirm={() => navigate("/students")}
      />
    </div>
  );
}
