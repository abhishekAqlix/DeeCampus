import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { toast } from "sonner";

const students = [
  { id: 1, name: "Aarav Sharma", roll: "101", class: "9-A", result: "Pass", percentage: "87%", status: "Eligible" },
  { id: 2, name: "Priya Patel", roll: "102", class: "9-A", result: "Pass", percentage: "92%", status: "Eligible" },
  { id: 3, name: "Rohan Gupta", roll: "103", class: "9-A", result: "Fail", percentage: "32%", status: "Not Eligible" },
  { id: 4, name: "Sneha Joshi", roll: "104", class: "9-A", result: "Pass", percentage: "78%", status: "Eligible" },
  { id: 5, name: "Karan Singh", roll: "105", class: "9-A", result: "Pass", percentage: "65%", status: "Eligible" },
  { id: 6, name: "Diya Reddy", roll: "106", class: "9-A", result: "Pass", percentage: "71%", status: "Eligible" },
  { id: 7, name: "Vivek Kumar", roll: "107", class: "9-A", result: "Detained", percentage: "40%", status: "Not Eligible" },
  { id: 8, name: "Anika Verma", roll: "108", class: "9-A", result: "Pass", percentage: "88%", status: "Eligible" },
];

export default function StudentPromotion() {
  const [selected, setSelected] = useState<number[]>([]);
  const toggleAll = () => setSelected(selected.length === students.length ? [] : students.map(s => s.id));
  const toggle = (id: number) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Student Promotion"
        subtitle="Promote students to next class based on results"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Students" }, { label: "Promotion" }]}
        actions={<Button onClick={() => { toast.success(`${selected.length} students promoted!`); setSelected([]); }} disabled={selected.length === 0}>Promote Selected ({selected.length})</Button>}
      />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Select Students for Promotion</CardTitle>
            <div className="flex gap-2">
              <Select><SelectTrigger className="w-[150px]"><SelectValue placeholder="From Class" /></SelectTrigger>
                <SelectContent>{["8-A","8-B","9-A","9-B","10-A"].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
              <Select><SelectTrigger className="w-[150px]"><SelectValue placeholder="To Class" /></SelectTrigger>
                <SelectContent>{["9-A","9-B","10-A","10-B","11-Sci"].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={selected.length === students.length} onCheckedChange={toggleAll} /></TableHead>
                <TableHead>Roll</TableHead><TableHead>Student Name</TableHead><TableHead>Current Class</TableHead>
                <TableHead>Result</TableHead><TableHead>Percentage</TableHead><TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map(s => (
                <TableRow key={s.id}>
                  <TableCell><Checkbox checked={selected.includes(s.id)} onCheckedChange={() => toggle(s.id)} /></TableCell>
                  <TableCell>{s.roll}</TableCell><TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.class}</TableCell>
                  <TableCell><StatusBadge status={s.result === "Pass" ? "active" : s.result === "Fail" ? "dropped" : "inactive"} label={s.result} /></TableCell>
                  <TableCell>{s.percentage}</TableCell>
                  <TableCell><StatusBadge status={s.status === "Eligible" ? "approved" : "cancelled"} label={s.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
