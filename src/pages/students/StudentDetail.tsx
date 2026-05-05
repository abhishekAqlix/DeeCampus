import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/erp/PageHeader";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { ConfirmDialog } from "@/components/erp/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRole } from "@/contexts/RoleContext";
import { Edit, Trash2, Printer, Download, Phone, Mail, MapPin, Calendar, GraduationCap, User, FileText, CreditCard } from "lucide-react";
import { deleteStudentRequest, getStudentRequest } from "@/api/school-api";
import { useToast } from "@/hooks/use-toast";

const oid = (s: string | undefined) => !!s && /^[a-f\d]{24}$/i.test(String(s));

function genderLabel(g: string) {
  if (!g) return "—";
  return g.charAt(0).toUpperCase() + g.slice(1);
}

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { permissions } = useRole();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const valid = oid(id);

  const { data: s, isLoading, isError, error } = useQuery({
    queryKey: ["student", id],
    enabled: valid,
    queryFn: async () => (await getStudentRequest(id!)).item,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteStudentRequest(id!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({ title: "Student deleted" });
      navigate("/students");
    },
    onError: (err: Error) => toast({ title: "Delete failed", description: err.message, variant: "destructive" }),
  });

  if (!valid) {
    return (
      <div className="space-y-4 max-w-[1400px]">
        <p className="text-sm text-muted-foreground">Invalid student link.</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/students")}>
          Back to students
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground max-w-[1400px]">Loading student…</p>;
  }

  if (isError || !s) {
    return (
      <div className="space-y-4 max-w-[1400px]">
        <p className="text-sm text-destructive">{(error as Error)?.message ?? "Student not found."}</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/students")}>
          Back to students
        </Button>
      </div>
    );
  }

  const initials = s.fullName
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
  const classLabel =
    s.className && s.section ? `${s.className}-${s.section}` : s.className || s.section || "—";

  const handleDelete = () => {
    void deleteMutation.mutateAsync();
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title={s.fullName}
        subtitle={`${s.studentCode} · Class ${classLabel} · Roll No. ${s.rollNo ?? "—"}`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Students", href: "/students" }, { label: s.fullName }]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            {permissions.canEdit && (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate(`/students/${s.id}/edit`)}>
                <Edit className="h-3.5 w-3.5" /> Edit
              </Button>
            )}
            {permissions.canDelete && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            )}
          </div>
        }
      />

      <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in">
        <div className="flex items-start gap-5">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="text-sm font-medium">{s.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Class & Section</p>
              <p className="text-sm font-medium">{classLabel}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Admission No.</p>
              <p className="text-sm font-medium">{s.admissionNo}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <StatusBadge status={s.status === "Active" ? "active" : "inactive"} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Guardian</p>
              <p className="text-sm font-medium">{s.guardian?.fatherName || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{s.phone || s.guardian?.fatherPhone || "—"}</p>
            </div>
          </div>
        </div>
      </div>

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
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-accent" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
              {[
                ["Date of Birth", s.dob || "—"],
                ["Gender", genderLabel(s.gender)],
                ["Blood Group", s.bloodGroup || "—"],
                ["Religion", s.religion || "—"],
                ["Category", s.category || "—"],
                ["Aadhar No.", s.aadhar || "—"],
                ["Email", s.email || "—"],
                ["Phone", s.phone || "—"],
                ["Admission Date", s.admissionDate || "—"],
              ].map(([label, val]) => (
                <div key={String(label)}>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium">{val}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {s.address || "—"}
              </p>
            </div>
            {s.previousSchool ? (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" /> Previous School
                </p>
                <p className="text-sm font-medium">{s.previousSchool}</p>
              </div>
            ) : null}
          </div>
        </TabsContent>

        <TabsContent value="guardian" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-accent" /> Guardian / Parent Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 p-4 rounded-lg bg-secondary/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Father</p>
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{s.guardian?.fatherName || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {s.guardian?.fatherPhone || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" /> {s.guardian?.fatherEmail || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Occupation</p>
                  <p className="text-sm font-medium">{s.guardian?.fatherOccupation || "—"}</p>
                </div>
              </div>
              <div className="space-y-3 p-4 rounded-lg bg-secondary/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mother</p>
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{s.guardian?.motherName || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {s.guardian?.motherPhone || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="fees" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-accent" /> Fee Ledger
            </h3>
            <p className="text-sm text-muted-foreground">
              Fee collection and ledger lines are not exposed on the API yet. Use Fee Collection in the UI once the backend route is added.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" /> Documents
            </h3>
            <p className="text-sm text-muted-foreground">Student documents upload is stored locally until a files API exists.</p>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" /> Activity Timeline
            </h3>
            <p className="text-sm text-muted-foreground">Open Audit Logs for recent admin actions affecting this student.</p>
          </div>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Student"
        description={`Are you sure you want to delete ${s.fullName}? This removes the MongoDB student record.`}
        confirmLabel="Delete Student"
        onConfirm={handleDelete}
      />
    </div>
  );
}
