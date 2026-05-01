import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { ActivityTimeline } from "@/components/erp/ActivityTimeline";
import { ConfirmDialog } from "@/components/erp/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Phone, Mail, ArrowRightLeft, Calendar, MessageSquare } from "lucide-react";

const enquiryData = {
  id: "ENQ001", studentName: "Ritika Jain", class: "5-A", parentName: "Suresh Jain",
  phone: "9876543101", email: "suresh.jain@email.com", source: "Walk-in",
  counsellor: "Neha Gupta", status: "new", date: "2025-04-01",
  address: "23, JP Nagar, Bangalore - 560078", notes: "Parent interested in admission for academic year 2025-26. Requested fee details and school visit.",
  previousSchool: "Greenwood High School", siblingInSchool: "No",
};

const timeline = [
  { title: "Enquiry created", description: "Walk-in enquiry by Suresh Jain", time: "Apr 1, 2025 · 10:00 AM", type: "info" as const },
  { title: "Counsellor assigned — Neha Gupta", time: "Apr 1, 2025 · 10:05 AM", type: "info" as const },
  { title: "Follow-up call scheduled", description: "Apr 3, 2025 at 11:00 AM", time: "Apr 1, 2025 · 10:15 AM", type: "warning" as const },
];

export default function EnquiryDetail() {
  const navigate = useNavigate();
  const { permissions } = useRole();
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const d = enquiryData;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title={d.studentName}
        subtitle={`${d.id} · Enquiry for Class ${d.class}`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admissions", href: "/admissions/enquiries" }, { label: "Enquiries", href: "/admissions/enquiries" }, { label: d.studentName }]}
        actions={
          <div className="flex items-center gap-2">
            {permissions.canManageAdmissions && (
              <>
                <Button size="sm" className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5"><ArrowRightLeft className="h-3.5 w-3.5" /> Convert to Admission</Button>
                <Button variant="outline" size="sm" className="gap-1.5"><Edit className="h-3.5 w-3.5" /> Edit</Button>
                <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
              </>
            )}
          </div>
        }
      />

      {/* Header Card */}
      <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in">
        <div className="flex items-start gap-5">
          <Avatar className="h-16 w-16"><AvatarFallback className="bg-info/10 text-info text-lg font-semibold">RJ</AvatarFallback></Avatar>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-xs text-muted-foreground">Student Name</p><p className="text-sm font-medium">{d.studentName}</p></div>
            <div><p className="text-xs text-muted-foreground">Class Applied</p><p className="text-sm font-medium">{d.class}</p></div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              {permissions.canManageAdmissions ? (
                <Select defaultValue={d.status}>
                  <SelectTrigger className="h-7 w-32 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{["new","pending","follow-up","converted","dropped"].map(s => <SelectItem key={s} value={s} className="text-xs capitalize">{s.replace("-", " ")}</SelectItem>)}</SelectContent>
                </Select>
              ) : <StatusBadge status={d.status as any} />}
            </div>
            <div><p className="text-xs text-muted-foreground">Date</p><p className="text-sm font-medium">{d.date}</p></div>
            <div><p className="text-xs text-muted-foreground">Parent</p><p className="text-sm font-medium">{d.parentName}</p></div>
            <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-sm font-medium flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {d.phone}</p></div>
            <div><p className="text-xs text-muted-foreground">Source</p><p className="text-sm font-medium">{d.source}</p></div>
            <div><p className="text-xs text-muted-foreground">Counsellor</p><p className="text-sm font-medium">{d.counsellor}</p></div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="animate-fade-in">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="followup">Follow-ups</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> {d.email}</p></div>
              <div><p className="text-xs text-muted-foreground">Address</p><p className="text-sm font-medium">{d.address}</p></div>
              <div><p className="text-xs text-muted-foreground">Previous School</p><p className="text-sm font-medium">{d.previousSchool}</p></div>
              <div><p className="text-xs text-muted-foreground">Sibling in School</p><p className="text-sm font-medium">{d.siblingInSchool}</p></div>
            </div>
            <div><p className="text-xs text-muted-foreground">Notes</p><p className="text-sm">{d.notes}</p></div>
          </div>
        </TabsContent>

        <TabsContent value="followup" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">Follow-up History</h3>
              {permissions.canManageAdmissions && <Button size="sm" variant="outline" className="gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> Add Follow-up</Button>}
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-lg border bg-secondary/30">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium">Phone call — Parent asked for fee structure</p>
                  <span className="text-[10px] text-muted-foreground">Apr 1, 2025</span>
                </div>
                <p className="text-xs text-muted-foreground">Shared fee details. Parent will visit school on Apr 3.</p>
              </div>
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

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Enquiry" description={`Delete enquiry for ${d.studentName}?`} confirmLabel="Delete" onConfirm={() => navigate("/admissions/enquiries")} />
    </div>
  );
}
