import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/erp/PageHeader";
import { FileUpload } from "@/components/erp/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createStaffRequest,
  getStaffRequest,
  listMastersRequest,
  MasterItemDto,
  updateStaffRequest,
} from "@/api/school-api";

const oid = (s: string | undefined) => !!s && /^[a-f\d]{24}$/i.test(String(s));

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  departmentId: string;
  designationId: string;
  roleId: string;
  joinDate: string;
  qualification: string;
  experience: string;
  address: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  salary: string;
  pan: string;
  epf: string;
  status: "Active" | "Inactive";
};

const empty: FormState = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  departmentId: "",
  designationId: "",
  roleId: "",
  joinDate: "",
  qualification: "",
  experience: "",
  address: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  salary: "",
  pan: "",
  epf: "",
  status: "Active",
};

export default function StaffForm({ mode = "create" }: { mode?: "create" | "edit" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEdit = mode === "edit";
  const editOk = !isEdit || oid(id);

  const [form, setForm] = useState<FormState>(empty);

  const { data: masters } = useQuery({
    queryKey: ["masters"],
    queryFn: () => listMastersRequest(),
  });

  const departments: MasterItemDto[] = masters?.masters?.Departments ?? [];
  const designations: MasterItemDto[] = masters?.masters?.Designations ?? [];
  const roles: MasterItemDto[] = masters?.masters?.Roles ?? [];

  const { data: existing, isLoading } = useQuery({
    queryKey: ["staff", id],
    enabled: isEdit && editOk && !!id,
    queryFn: async () => (await getStaffRequest(id!)).item,
  });

  useEffect(() => {
    if (!existing) return;
    setForm({
      fullName: existing.fullName,
      email: existing.email,
      phone: existing.phone,
      dob: existing.dateOfBirth || "",
      gender: existing.gender || "",
      departmentId: existing.departmentId,
      designationId: existing.designationId,
      roleId: existing.roleId || "",
      joinDate: existing.joinDate || "",
      qualification: existing.qualification || "",
      experience: existing.experience || "",
      address: existing.address || "",
      bankName: existing.bankName || "",
      accountNumber: existing.accountNumber || "",
      ifscCode: existing.ifscCode || "",
      salary: existing.monthlySalary != null ? String(existing.monthlySalary) : "",
      pan: existing.panNumber || "",
      epf: existing.epfNumber || "",
      status: existing.status === "Inactive" ? "Inactive" : "Active",
    });
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body: Record<string, unknown> = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dateOfBirth: form.dob || "",
        gender: form.gender || "",
        departmentId: form.departmentId,
        designationId: form.designationId,
        roleId: form.roleId || null,
        joinDate: form.joinDate || "",
        qualification: form.qualification,
        experience: form.experience,
        address: form.address,
        bankName: form.bankName,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
        monthlySalary: form.salary === "" ? null : Number(form.salary),
        panNumber: form.pan,
        epfNumber: form.epf,
        status: form.status,
      };

      if (isEdit && id) return updateStaffRequest(id, body);
      return createStaffRequest(body);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({ title: isEdit ? "Staff updated" : "Staff added" });
      navigate("/staff");
    },
    onError: (err: Error) => toast({ title: "Save failed", description: err.message, variant: "destructive" }),
  });

  const set = (key: keyof FormState, v: string) => setForm((p) => ({ ...p, [key]: v }));

  if (isEdit && !editOk) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Invalid staff id.</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/staff")}>
          Back
        </Button>
      </div>
    );
  }

  if (isEdit && isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6 max-w-[1000px]">
      <PageHeader
        title={isEdit ? `Edit Staff — ${form.fullName}`.trim() || "Edit Staff" : "Add Staff"}
        subtitle={isEdit ? "Update staff information" : "Enroll a new staff member"}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staff", href: "/staff" }, { label: isEdit ? "Edit" : "Add Staff" }]}
      />

      <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in space-y-5">
        <h3 className="text-sm font-semibold">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Full Name *</Label>
            <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="Full name" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="Email" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Phone *</Label>
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="Phone" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Date of Birth</Label>
            <Input type="date" value={form.dob} onChange={(e) => set("dob", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Gender</Label>
            <Select value={form.gender || undefined} onValueChange={(v) => set("gender", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Department *</Label>
            <Select value={form.departmentId || undefined} onValueChange={(v) => set("departmentId", v)}>
              <SelectTrigger>
                <SelectValue placeholder={departments.length ? "Select department" : "Load masters first"} />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Designation *</Label>
            <Select value={form.designationId || undefined} onValueChange={(v) => set("designationId", v)}>
              <SelectTrigger>
                <SelectValue placeholder={designations.length ? "Select designation" : "Load masters first"} />
              </SelectTrigger>
              <SelectContent>
                {designations.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">ERP Role (master)</Label>
            <Select value={form.roleId || "__none__"} onValueChange={(v) => set("roleId", v === "__none__" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Join Date</Label>
            <Input type="date" value={form.joinDate} onChange={(e) => set("joinDate", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Qualification</Label>
            <Input value={form.qualification} onChange={(e) => set("qualification", e.target.value)} placeholder="Qualification" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Experience</Label>
            <Input value={form.experience} onChange={(e) => set("experience", e.target.value)} placeholder="Years of experience" />
          </div>
          {isEdit ? (
            <div className="space-y-2">
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Address</Label>
          <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Full address" />
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in space-y-5">
        <h3 className="text-sm font-semibold">Bank & Salary Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Bank Name</Label>
            <Input value={form.bankName} onChange={(e) => set("bankName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Account Number</Label>
            <Input value={form.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">IFSC Code</Label>
            <Input value={form.ifscCode} onChange={(e) => set("ifscCode", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Monthly Salary</Label>
            <Input type="number" value={form.salary} onChange={(e) => set("salary", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">PAN Number</Label>
            <Input value={form.pan} onChange={(e) => set("pan", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">EPF Number</Label>
            <Input value={form.epf} onChange={(e) => set("epf", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in">
        <FileUpload label="Upload Documents (Resume, ID Proof, Certificates)" />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => navigate("/staff")}>
          Cancel
        </Button>
        <Button
          type="button"
          disabled={saveMutation.isPending || !form.departmentId || !form.designationId}
          onClick={() => {
            if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
              toast({ title: "Required fields", description: "Name, email, and phone are required.", variant: "destructive" });
              return;
            }
            void saveMutation.mutateAsync();
          }}
          className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5"
        >
          <Save className="h-4 w-4" /> {isEdit ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
}
