import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { KPICard } from "@/components/erp/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const staff = [
  { id: 1, name: "Rajesh Thakur", dept: "Mathematics", status: "present" },
  { id: 2, name: "Sunita Sharma", dept: "English", status: "present" },
  { id: 3, name: "Amit Verma", dept: "Science", status: "absent" },
  { id: 4, name: "Priya Kapoor", dept: "Hindi", status: "present" },
  { id: 5, name: "Deepak Singh", dept: "Social Science", status: "late" },
  { id: 6, name: "Meena Gupta", dept: "Computer Science", status: "present" },
  { id: 7, name: "Rakesh Yadav", dept: "Physical Education", status: "present" },
  { id: 8, name: "Kavita Jain", dept: "Art", status: "leave" },
];

const statusColors: Record<string, string> = { present: "bg-green-100 text-green-700", absent: "bg-red-100 text-red-700", late: "bg-amber-100 text-amber-700", leave: "bg-blue-100 text-blue-700" };

export default function StaffAttendance() {
  const [data, setData] = useState(staff);

  const updateStatus = (id: number, status: string) => {
    setData(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Staff Attendance" subtitle="Mark and manage daily staff attendance"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staff" }, { label: "Attendance" }]}
        actions={<Button onClick={() => toast.success("Attendance saved!")}>Save Attendance</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Staff" value={String(data.length)} variant="blue" />
        <KPICard title="Present" value={String(data.filter(s => s.status === "present").length)} variant="green" />
        <KPICard title="Absent" value={String(data.filter(s => s.status === "absent").length)} variant="red" />
        <KPICard title="On Leave" value={String(data.filter(s => s.status === "leave").length)} variant="amber" />
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Today's Attendance — {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Department</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {data.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.dept}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[s.status]}`}>{s.status}</span></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {["present","absent","late","leave"].map(st => (
                        <Button key={st} size="sm" variant={s.status === st ? "default" : "outline"} className="text-xs capitalize h-7" onClick={() => updateStatus(s.id, st)}>{st.charAt(0).toUpperCase()}</Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
