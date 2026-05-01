import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/erp/PageHeader";
import { FileUpload } from "@/components/erp/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createStaffId, getStaffRecords, saveStaffRecords } from "./staffStore";

const departments = ["Mathematics","Science","English","Hindi","Computer Science","Physical Ed.","Admin","Accounts","Transport"];
const designations = ["HOD","Senior Teacher","Teacher","Lab Incharge","Accountant","Front Office","Sports Coach","Transport Manager"];

const initialCreateForm = {
  name: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  dept: "",
  designation: "",
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
};

const initialEditForm = {
  name: "Dr. Meera Krishnan",
  email: "meera.k@school.com",
  phone: "9876543001",
  dob: "1985-03-12",
  gender: "female",
  dept: "Mathematics",
  designation: "HOD",
  joinDate: "2018-06-15",
  qualification: "Ph.D. Mathematics",
  experience: "12 years",
  address: "15, Jayanagar, Bangalore - 560011",
  bankName: "SBI",
  accountNumber: "XXXXXXXX1234",
  ifscCode: "SBIN0001234",
  salary: "65000",
  pan: "ABCDE1234F",
  epf: "KA/BNG/12345",
};

export default function StaffForm({ mode = "create" }: { mode?: "create" | "edit" }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = mode === "edit";
  const [form, setForm] = useState(isEdit ? initialEditForm : initialCreateForm);

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.dept || !form.designation) {
      toast({ title: "Required fields missing", description: "Please fill name, email, phone, department and designation.", variant: "destructive" });
      return;
    }

    if (!isEdit) {
      const records = getStaffRecords();
      const newStaff = {
        id: createStaffId(records),
        name: form.name.trim(),
        dept: form.dept,
        designation: form.designation,
        phone: form.phone.trim(),
        status: "active",
        joinDate: form.joinDate || new Date().toISOString().slice(0, 10),
        email: form.email.trim(),
      };

      saveStaffRecords([newStaff, ...records]);
    }

    toast({ title: isEdit ? "Staff Updated" : "Staff Added", description: `Staff member has been ${isEdit ? "updated" : "enrolled"} successfully.` });
    navigate("/staff");
  };

  return (
    <div className="space-y-6 max-w-[1000px]">
      <PageHeader
        title={isEdit ? "Edit Staff" : "Add Staff"}
        subtitle={isEdit ? "Update staff information" : "Enroll a new staff member"}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staff", href: "/staff" }, { label: isEdit ? "Edit" : "Add Staff" }]}
      />

      <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in space-y-5">
        <h3 className="text-sm font-semibold">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label className="text-xs">Full Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" /></div>
          <div className="space-y-2"><Label className="text-xs">Email *</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" /></div>
          <div className="space-y-2"><Label className="text-xs">Phone *</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" /></div>
          <div className="space-y-2"><Label className="text-xs">Date of Birth</Label><Input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} /></div>
          <div className="space-y-2">
            <Label className="text-xs">Gender</Label>
            <Select value={form.gender} onValueChange={v => setForm({ ...form, gender: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent></Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Department *</Label>
            <Select value={form.dept} onValueChange={v => setForm({ ...form, dept: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Designation *</Label>
            <Select value={form.designation} onValueChange={v => setForm({ ...form, designation: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{designations.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="space-y-2"><Label className="text-xs">Join Date</Label><Input type="date" value={form.joinDate} onChange={e => setForm({ ...form, joinDate: e.target.value })} /></div>
          <div className="space-y-2"><Label className="text-xs">Qualification</Label><Input value={form.qualification} onChange={e => setForm({ ...form, qualification: e.target.value })} placeholder="Qualification" /></div>
          <div className="space-y-2"><Label className="text-xs">Experience</Label><Input value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="Years of experience" /></div>
        </div>
        <div className="space-y-2"><Label className="text-xs">Address</Label><Textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Full address" /></div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in space-y-5">
        <h3 className="text-sm font-semibold">Bank & Salary Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label className="text-xs">Bank Name</Label><Input value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} /></div>
          <div className="space-y-2"><Label className="text-xs">Account Number</Label><Input value={form.accountNumber} onChange={e => setForm({ ...form, accountNumber: e.target.value })} /></div>
          <div className="space-y-2"><Label className="text-xs">IFSC Code</Label><Input value={form.ifscCode} onChange={e => setForm({ ...form, ifscCode: e.target.value })} /></div>
          <div className="space-y-2"><Label className="text-xs">Monthly Salary</Label><Input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} /></div>
          <div className="space-y-2"><Label className="text-xs">PAN Number</Label><Input value={form.pan} onChange={e => setForm({ ...form, pan: e.target.value })} /></div>
          <div className="space-y-2"><Label className="text-xs">EPF Number</Label><Input value={form.epf} onChange={e => setForm({ ...form, epf: e.target.value })} /></div>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in">
        <FileUpload label="Upload Documents (Resume, ID Proof, Certificates)" />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate("/staff")}>Cancel</Button>
        <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5"><Save className="h-4 w-4" /> {isEdit ? "Update" : "Save"}</Button>
      </div>
    </div>
  );
}
