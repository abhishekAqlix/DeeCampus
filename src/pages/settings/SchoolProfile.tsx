import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function SchoolProfile() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="School Profile" subtitle="Manage school information and branding"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }, { label: "School Profile" }]}
        actions={<Button onClick={() => toast.success("Profile updated!")}>Save Changes</Button>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>School Name</Label><Input defaultValue="DeeCampus International School" /></div>
            <div><Label>Short Name</Label><Input defaultValue="DC" /></div>
            <div><Label>Established Year</Label><Input defaultValue="1995" /></div>
            <div><Label>Board/Affiliation</Label><Input defaultValue="CBSE - Affiliation No: 2730123" /></div>
            <div><Label>School Type</Label><Input defaultValue="Co-Educational, K-12" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Contact Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Email</Label><Input defaultValue="info@deecampus.edu.in" /></div>
            <div><Label>Phone</Label><Input defaultValue="+91 11 2345 6789" /></div>
            <div><Label>Website</Label><Input defaultValue="www.deecampus.edu.in" /></div>
            <div><Label>Address</Label><Textarea defaultValue="123, Education Lane, Sector 15, New Delhi - 110075" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Management</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Chairman</Label><Input defaultValue="Mr. Rajendra Prasad" /></div>
            <div><Label>Principal</Label><Input defaultValue="Dr. Meera Krishnan" /></div>
            <div><Label>Vice Principal</Label><Input defaultValue="Mrs. Anita Deshmukh" /></div>
            <div><Label>Admin Head</Label><Input defaultValue="Mr. Sunil Mehta" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Academic Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><Label>Current Academic Year</Label><Input defaultValue="2026-27" /></div>
            <div><Label>Session Start</Label><Input type="date" defaultValue="2026-04-01" /></div>
            <div><Label>Session End</Label><Input type="date" defaultValue="2027-03-31" /></div>
            <div><Label>Working Days (Weekly)</Label><Input defaultValue="6" /></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
