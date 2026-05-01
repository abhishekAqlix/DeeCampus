import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function NewEnquiry() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const handleSubmit = () => {
    toast.success("Enquiry created successfully!");
    navigate("/admissions/enquiries");
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="New Enquiry"
        subtitle="Register a new admission enquiry"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admissions" }, { label: "New Enquiry" }]}
      />
      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map(s => (
          <div key={s} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            Step {s}: {s === 1 ? "Student Info" : s === 2 ? "Parent Info" : "Additional"}
          </div>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>Student Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>First Name *</Label><Input placeholder="Enter first name" /></div>
            <div><Label>Last Name *</Label><Input placeholder="Enter last name" /></div>
            <div><Label>Date of Birth *</Label><Input type="date" /></div>
            <div><Label>Gender *</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Class Applied For *</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>{["Nursery","LKG","UKG","1","2","3","4","5","6","7","8","9","10"].map(c=><SelectItem key={c} value={c}>Class {c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Previous School</Label><Input placeholder="Previous school name" /></div>
            <div><Label>Lead Source *</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select source" /></SelectTrigger>
                <SelectContent><SelectItem value="walkin">Walk-in</SelectItem><SelectItem value="website">Website</SelectItem><SelectItem value="referral">Referral</SelectItem><SelectItem value="newspaper">Newspaper</SelectItem><SelectItem value="social">Social Media</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3"><Label>Remarks</Label><Textarea placeholder="Any additional remarks..." /></div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader><CardTitle>Parent / Guardian Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>Father's Name *</Label><Input placeholder="Father's full name" /></div>
            <div><Label>Father's Mobile *</Label><Input placeholder="+91 XXXXX XXXXX" /></div>
            <div><Label>Father's Email</Label><Input type="email" placeholder="father@email.com" /></div>
            <div><Label>Father's Occupation</Label><Input placeholder="Occupation" /></div>
            <div><Label>Mother's Name *</Label><Input placeholder="Mother's full name" /></div>
            <div><Label>Mother's Mobile</Label><Input placeholder="+91 XXXXX XXXXX" /></div>
            <div className="md:col-span-3"><Label>Address</Label><Textarea placeholder="Full address..." /></div>
            <div><Label>City</Label><Input placeholder="City" /></div>
            <div><Label>State</Label><Input placeholder="State" /></div>
            <div><Label>Pin Code</Label><Input placeholder="Pin code" /></div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader><CardTitle>Additional Details</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>Counsellor Assigned</Label>
              <Select><SelectTrigger><SelectValue placeholder="Assign counsellor" /></SelectTrigger>
                <SelectContent><SelectItem value="c1">Mrs. Sharma</SelectItem><SelectItem value="c2">Mr. Verma</SelectItem><SelectItem value="c3">Ms. Gupta</SelectItem></SelectContent>
              </Select>
            </div>
            <div><Label>Follow-up Date</Label><Input type="date" /></div>
            <div><Label>Priority</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                <SelectContent><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="md:col-span-3"><Label>Notes</Label><Textarea placeholder="Internal notes..." /></div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => step > 1 ? setStep(step - 1) : navigate("/admissions/enquiries")}>{step > 1 ? "Previous" : "Cancel"}</Button>
        <div className="flex gap-2">
          {step < 3 && <Button onClick={() => setStep(step + 1)}>Next</Button>}
          {step === 3 && <Button onClick={handleSubmit}>Submit Enquiry</Button>}
        </div>
      </div>
    </div>
  );
}
