import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const steps = ["Personal Info", "Guardian Details", "Academic Info", "Documents"];

export default function StudentForm({ mode = "create" }: { mode?: "create" | "edit" }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    firstName: isEdit ? "Aarav" : "", lastName: isEdit ? "Sharma" : "",
    dob: isEdit ? "2010-05-14" : "", gender: isEdit ? "male" : "",
    bloodGroup: isEdit ? "B+" : "", religion: isEdit ? "Hindu" : "",
    category: isEdit ? "general" : "", aadhar: isEdit ? "1234-5678-9012" : "",
    phone: isEdit ? "9876543210" : "", email: isEdit ? "aarav.s@email.com" : "",
    address: isEdit ? "42, MG Road, Sector 15, Bangalore - 560001" : "",
    fatherName: isEdit ? "Rajesh Sharma" : "", fatherPhone: isEdit ? "9876543210" : "",
    fatherEmail: isEdit ? "rajesh.s@email.com" : "", fatherOccupation: isEdit ? "Business" : "",
    motherName: isEdit ? "Sunita Sharma" : "", motherPhone: isEdit ? "9876543222" : "",
    class: isEdit ? "10-A" : "", section: isEdit ? "A" : "",
    rollNo: isEdit ? "1" : "", admissionDate: isEdit ? "2020-06-15" : "",
    previousSchool: isEdit ? "DPS Bangalore" : "",
  });

  const updateForm = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    toast({ title: isEdit ? "Student Updated" : "Student Created", description: `${form.firstName} ${form.lastName} has been ${isEdit ? "updated" : "admitted"} successfully.` });
    navigate("/students");
  };

  return (
    <div className="space-y-6 max-w-[1000px]">
      <PageHeader
        title={isEdit ? "Edit Student — Aarav Sharma" : "New Admission"}
        subtitle={isEdit ? "Update student information" : "Complete the admission form to enroll a new student"}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Students", href: "/students" }, { label: isEdit ? "Edit" : "New Admission" }]}
      />

      {/* Step Indicator */}
      <div className="bg-card rounded-lg border shadow-sm p-4 animate-fade-in">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <button key={i} onClick={() => setCurrentStep(i)} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                i === currentStep ? "bg-accent text-accent-foreground" : i < currentStep ? "bg-success text-success-foreground" : "bg-secondary text-muted-foreground"
              )}>{i + 1}</div>
              <span className={cn("text-xs font-medium hidden md:block", i === currentStep ? "text-foreground" : "text-muted-foreground")}>{step}</span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-border mx-2" />}
            </button>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in">
        {currentStep === 0 && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">First Name *</Label><Input value={form.firstName} onChange={e => updateForm("firstName", e.target.value)} placeholder="Enter first name" /></div>
              <div className="space-y-2"><Label className="text-xs">Last Name *</Label><Input value={form.lastName} onChange={e => updateForm("lastName", e.target.value)} placeholder="Enter last name" /></div>
              <div className="space-y-2"><Label className="text-xs">Date of Birth *</Label><Input type="date" value={form.dob} onChange={e => updateForm("dob", e.target.value)} /></div>
              <div className="space-y-2">
                <Label className="text-xs">Gender *</Label>
                <Select value={form.gender} onValueChange={v => updateForm("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Blood Group</Label>
                <Select value={form.bloodGroup} onValueChange={v => updateForm("bloodGroup", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => <SelectItem key={bg} value={bg}>{bg}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Religion</Label><Input value={form.religion} onChange={e => updateForm("religion", e.target.value)} placeholder="Religion" /></div>
              <div className="space-y-2">
                <Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={v => updateForm("category", v)}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{["general","obc","sc","st","ews"].map(c => <SelectItem key={c} value={c}>{c.toUpperCase()}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Aadhar Number</Label><Input value={form.aadhar} onChange={e => updateForm("aadhar", e.target.value)} placeholder="XXXX-XXXX-XXXX" /></div>
              <div className="space-y-2"><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={e => updateForm("phone", e.target.value)} placeholder="Phone number" /></div>
              <div className="space-y-2"><Label className="text-xs">Email</Label><Input type="email" value={form.email} onChange={e => updateForm("email", e.target.value)} placeholder="Email address" /></div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Address</Label><Textarea value={form.address} onChange={e => updateForm("address", e.target.value)} placeholder="Full address" /></div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold">Guardian / Parent Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Father's Name *</Label><Input value={form.fatherName} onChange={e => updateForm("fatherName", e.target.value)} /></div>
              <div className="space-y-2"><Label className="text-xs">Father's Phone *</Label><Input value={form.fatherPhone} onChange={e => updateForm("fatherPhone", e.target.value)} /></div>
              <div className="space-y-2"><Label className="text-xs">Father's Email</Label><Input value={form.fatherEmail} onChange={e => updateForm("fatherEmail", e.target.value)} /></div>
              <div className="space-y-2"><Label className="text-xs">Father's Occupation</Label><Input value={form.fatherOccupation} onChange={e => updateForm("fatherOccupation", e.target.value)} /></div>
              <div className="space-y-2"><Label className="text-xs">Mother's Name</Label><Input value={form.motherName} onChange={e => updateForm("motherName", e.target.value)} /></div>
              <div className="space-y-2"><Label className="text-xs">Mother's Phone</Label><Input value={form.motherPhone} onChange={e => updateForm("motherPhone", e.target.value)} /></div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <h3 className="text-sm font-semibold">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Class *</Label>
                <Select value={form.class} onValueChange={v => updateForm("class", v)}>
                  <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                  <SelectContent>{["1","2","3","4","5","6","7","8","9","10"].map(c => <SelectItem key={c} value={c}>Class {c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Section *</Label>
                <Select value={form.section} onValueChange={v => updateForm("section", v)}>
                  <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                  <SelectContent>{["A","B","C","D"].map(s => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Roll Number</Label><Input value={form.rollNo} onChange={e => updateForm("rollNo", e.target.value)} /></div>
              <div className="space-y-2"><Label className="text-xs">Admission Date</Label><Input type="date" value={form.admissionDate} onChange={e => updateForm("admissionDate", e.target.value)} /></div>
              <div className="space-y-2 md:col-span-2"><Label className="text-xs">Previous School</Label><Input value={form.previousSchool} onChange={e => updateForm("previousSchool", e.target.value)} placeholder="Name of previous school" /></div>
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

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={currentStep === 0} onClick={() => setCurrentStep(s => s - 1)} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        <div className="flex items-center gap-2">
          {currentStep < steps.length - 1 ? (
            <Button onClick={() => setCurrentStep(s => s + 1)} className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5">
              <Save className="h-4 w-4" /> {isEdit ? "Update Student" : "Save & Admit"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
