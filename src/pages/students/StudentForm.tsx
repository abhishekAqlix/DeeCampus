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
import { Save, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  createStudentRequest,
  getStudentRequest,
  listClassSectionsRequest,
  updateStudentRequest,
} from "@/api/school-api";

const steps = ["Personal Info", "Guardian Details", "Academic Info", "Documents"];

const oid = (s: string | undefined) => !!s && /^[a-f\d]{24}$/i.test(String(s));

type FormState = {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  religion: string;
  category: string;
  aadhar: string;
  phone: string;
  email: string;
  address: string;
  fatherName: string;
  fatherPhone: string;
  fatherEmail: string;
  fatherOccupation: string;
  motherName: string;
  motherPhone: string;
  classSectionId: string;
  section: string;
  rollNo: string;
  admissionDate: string;
  previousSchool: string;
  status: "Active" | "Inactive";
};

const emptyForm: FormState = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  religion: "",
  category: "",
  aadhar: "",
  phone: "",
  email: "",
  address: "",
  fatherName: "",
  fatherPhone: "",
  fatherEmail: "",
  fatherOccupation: "",
  motherName: "",
  motherPhone: "",
  classSectionId: "",
  section: "",
  rollNo: "",
  admissionDate: "",
  previousSchool: "",
  status: "Active",
};

export default function StudentForm({ mode = "create" }: { mode?: "create" | "edit" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const isEdit = mode === "edit";
  const editValid = !isEdit || oid(id);

  const [form, setForm] = useState<FormState>(emptyForm);

  const { data: sections = [] } = useQuery({
    queryKey: ["class-sections"],
    queryFn: async () => (await listClassSectionsRequest()).items,
  });

  const { data: existing, isLoading: loadingStudent } = useQuery({
    queryKey: ["student", id],
    enabled: isEdit && editValid && !!id,
    queryFn: async () => (await getStudentRequest(id!)).item,
  });

  useEffect(() => {
    if (!existing) return;
    setForm({
      firstName: existing.firstName,
      lastName: existing.lastName,
      dob: existing.dob || "",
      gender: existing.gender || "",
      bloodGroup: existing.bloodGroup || "",
      religion: existing.religion || "",
      category: existing.category || "",
      aadhar: existing.aadhar || "",
      phone: existing.phone || "",
      email: existing.email || "",
      address: existing.address || "",
      fatherName: existing.guardian?.fatherName || "",
      fatherPhone: existing.guardian?.fatherPhone || "",
      fatherEmail: existing.guardian?.fatherEmail || "",
      fatherOccupation: existing.guardian?.fatherOccupation || "",
      motherName: existing.guardian?.motherName || "",
      motherPhone: existing.guardian?.motherPhone || "",
      classSectionId: existing.classSectionId || "",
      section: existing.section || "",
      rollNo: existing.rollNo != null ? String(existing.rollNo) : "",
      admissionDate: existing.admissionDate || "",
      previousSchool: existing.previousSchool || "",
      status: existing.status === "Inactive" ? "Inactive" : "Active",
    });
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        dob: form.dob || undefined,
        gender: form.gender ? form.gender : "",
        bloodGroup: form.bloodGroup,
        religion: form.religion,
        category: form.category,
        aadhar: form.aadhar,
        phone: form.phone,
        email: form.email,
        address: form.address,
        classSectionId: form.classSectionId || null,
        section: form.section,
        rollNo: form.rollNo === "" ? null : Number(form.rollNo),
        admissionDate: form.admissionDate || undefined,
        previousSchool: form.previousSchool,
        status: form.status,
        guardian: {
          fatherName: form.fatherName,
          fatherPhone: form.fatherPhone,
          fatherEmail: form.fatherEmail,
          fatherOccupation: form.fatherOccupation,
          motherName: form.motherName,
          motherPhone: form.motherPhone,
        },
      };

      if (isEdit && id) {
        return updateStudentRequest(id, body);
      }
      return createStudentRequest(body);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
      toast({
        title: isEdit ? "Student updated" : "Student admitted",
        description: `${form.firstName} ${form.lastName} saved successfully.`,
      });
      navigate("/students");
    },
    onError: (err: Error) => {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    },
  });

  const updateForm = (key: keyof FormState, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast({ title: "Required", description: "First and last name are required.", variant: "destructive" });
      return;
    }
    void saveMutation.mutateAsync();
  };

  if (isEdit && !editValid) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Invalid student id.</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/students")}>
          Back
        </Button>
      </div>
    );
  }

  if (isEdit && loadingStudent) {
    return <p className="text-sm text-muted-foreground">Loading student…</p>;
  }

  return (
    <div className="space-y-6 max-w-[1000px]">
      <PageHeader
        title={isEdit ? `Edit Student — ${form.firstName} ${form.lastName}`.trim() || "Edit Student" : "New Admission"}
        subtitle={
          isEdit ? "Update student information" : "Complete the admission form to enroll a new student"
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Students", href: "/students" },
          { label: isEdit ? "Edit" : "New Admission" },
        ]}
      />

      <div className="bg-card rounded-lg border shadow-sm p-4 animate-fade-in">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <button key={i} type="button" onClick={() => setCurrentStep(i)} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                  i === currentStep
                    ? "bg-accent text-accent-foreground"
                    : i < currentStep
                      ? "bg-success text-success-foreground"
                      : "bg-secondary text-muted-foreground"
                )}
              >
                {i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden md:block",
                  i === currentStep ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step}
              </span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-border mx-2" />}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in">
        {currentStep === 0 && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">First Name *</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) => updateForm("firstName", e.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Last Name *</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) => updateForm("lastName", e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Date of Birth</Label>
                <Input type="date" value={form.dob} onChange={(e) => updateForm("dob", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Gender</Label>
                <Select value={form.gender || undefined} onValueChange={(v) => updateForm("gender", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Blood Group</Label>
                <Select value={form.bloodGroup || undefined} onValueChange={(v) => updateForm("bloodGroup", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Religion</Label>
                <Input value={form.religion} onChange={(e) => updateForm("religion", e.target.value)} placeholder="Religion" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Category</Label>
                <Select value={form.category || undefined} onValueChange={(v) => updateForm("category", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["general", "obc", "sc", "st", "ews"].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Aadhar Number</Label>
                <Input value={form.aadhar} onChange={(e) => updateForm("aadhar", e.target.value)} placeholder="XXXX-XXXX-XXXX" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Phone</Label>
                <Input value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="Phone number" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="Email address"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Address</Label>
              <Textarea value={form.address} onChange={(e) => updateForm("address", e.target.value)} placeholder="Full address" />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold">Guardian / Parent Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Father&apos;s Name</Label>
                <Input value={form.fatherName} onChange={(e) => updateForm("fatherName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Father&apos;s Phone</Label>
                <Input value={form.fatherPhone} onChange={(e) => updateForm("fatherPhone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Father&apos;s Email</Label>
                <Input value={form.fatherEmail} onChange={(e) => updateForm("fatherEmail", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Father&apos;s Occupation</Label>
                <Input value={form.fatherOccupation} onChange={(e) => updateForm("fatherOccupation", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Mother&apos;s Name</Label>
                <Input value={form.motherName} onChange={(e) => updateForm("motherName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Mother&apos;s Phone</Label>
                <Input value={form.motherPhone} onChange={(e) => updateForm("motherPhone", e.target.value)} />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Class (from setup)</Label>
                <Select
                  value={form.classSectionId || undefined}
                  onValueChange={(v) => updateForm("classSectionId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map((cs) => (
                      <SelectItem key={cs.id} value={cs.id}>
                        {cs.class} ({cs.sections})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Section *</Label>
                <Select value={form.section || undefined} onValueChange={(v) => updateForm("section", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map((x) => (
                      <SelectItem key={x} value={x}>
                        Section {x}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Roll Number</Label>
                <Input value={form.rollNo} onChange={(e) => updateForm("rollNo", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Admission Date</Label>
                <Input type="date" value={form.admissionDate} onChange={(e) => updateForm("admissionDate", e.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label className="text-xs">Previous School</Label>
                <Input
                  value={form.previousSchool}
                  onChange={(e) => updateForm("previousSchool", e.target.value)}
                  placeholder="Name of previous school"
                />
              </div>
              {isEdit ? (
                <div className="space-y-2">
                  <Label className="text-xs">Enrollment status</Label>
                  <Select value={form.status} onValueChange={(v) => updateForm("status", v)}>
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
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold">Documents</h3>
            <FileUpload label="Upload student documents" accept=".pdf,.jpg,.png,.doc,.docx" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" disabled={currentStep === 0} onClick={() => setCurrentStep((s) => s - 1)} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        <div className="flex items-center gap-2">
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={() => setCurrentStep((s) => s + 1)} className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5"
            >
              <Save className="h-4 w-4" /> {isEdit ? "Update Student" : "Save & Admit"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
