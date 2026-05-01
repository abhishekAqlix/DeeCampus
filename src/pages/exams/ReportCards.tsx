import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const subjects = [
  { subject: "Mathematics", maxMarks: 100, obtained: 87, grade: "A" },
  { subject: "English", maxMarks: 100, obtained: 92, grade: "A+" },
  { subject: "Science", maxMarks: 100, obtained: 85, grade: "A" },
  { subject: "Hindi", maxMarks: 100, obtained: 78, grade: "B+" },
  { subject: "Social Science", maxMarks: 100, obtained: 82, grade: "A" },
  { subject: "Computer Science", maxMarks: 100, obtained: 95, grade: "A+" },
];

export default function ReportCards() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Report Cards" subtitle="Generate and print student report cards"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Exams" }, { label: "Report Cards" }]}
        actions={<Button><Printer className="h-4 w-4 mr-2" />Print Report Card</Button>}
      />
      <Card className="max-w-3xl mx-auto border-2">
        <CardHeader className="text-center border-b bg-muted/30">
          <div className="text-xs text-muted-foreground">DeeCampus International School</div>
          <CardTitle>PROGRESS REPORT — 2026-27</CardTitle>
          <div className="text-sm text-muted-foreground">Mid-Term Examination</div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Name:</span> <strong>Aarav Sharma</strong></div>
            <div><span className="text-muted-foreground">Class:</span> <strong>10-A</strong></div>
            <div><span className="text-muted-foreground">Roll No:</span> <strong>101</strong></div>
            <div><span className="text-muted-foreground">Admission No:</span> <strong>DC-2024-0234</strong></div>
          </div>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Subject</TableHead><TableHead className="text-center">Max Marks</TableHead>
              <TableHead className="text-center">Obtained</TableHead><TableHead className="text-center">Grade</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {subjects.map((s, i) => (
                <TableRow key={i}>
                  <TableCell>{s.subject}</TableCell><TableCell className="text-center">{s.maxMarks}</TableCell>
                  <TableCell className="text-center font-medium">{s.obtained}</TableCell>
                  <TableCell className="text-center"><span className={`px-2 py-1 rounded text-xs font-medium ${s.grade.startsWith("A") ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{s.grade}</span></TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell>Total</TableCell><TableCell className="text-center">600</TableCell>
                <TableCell className="text-center">519</TableCell><TableCell className="text-center">86.5%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="grid grid-cols-3 gap-4 text-sm pt-4 border-t">
            <div className="text-center"><div className="text-muted-foreground text-xs">Rank</div><div className="font-bold text-lg">3rd</div></div>
            <div className="text-center"><div className="text-muted-foreground text-xs">Result</div><div className="font-bold text-lg text-green-600">PASS</div></div>
            <div className="text-center"><div className="text-muted-foreground text-xs">Attendance</div><div className="font-bold text-lg">94%</div></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
