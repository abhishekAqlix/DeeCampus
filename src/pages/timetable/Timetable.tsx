import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = ["8:00-8:45", "8:45-9:30", "9:30-10:15", "10:15-10:30", "10:30-11:15", "11:15-12:00", "12:00-12:45", "12:45-1:15", "1:15-2:00"];
const subjectColors: Record<string, string> = {
  Math: "bg-blue-50 border-blue-200 text-blue-700", English: "bg-green-50 border-green-200 text-green-700",
  Science: "bg-purple-50 border-purple-200 text-purple-700", Hindi: "bg-amber-50 border-amber-200 text-amber-700",
  SST: "bg-rose-50 border-rose-200 text-rose-700", CS: "bg-cyan-50 border-cyan-200 text-cyan-700",
  PE: "bg-orange-50 border-orange-200 text-orange-700", Art: "bg-pink-50 border-pink-200 text-pink-700",
  Break: "bg-muted text-muted-foreground", Lunch: "bg-muted text-muted-foreground",
};

const timetable: Record<string, string[]> = {
  Monday: ["Math", "English", "Science", "Break", "Hindi", "SST", "CS", "Lunch", "PE"],
  Tuesday: ["English", "Math", "Hindi", "Break", "Science", "CS", "Art", "Lunch", "SST"],
  Wednesday: ["Science", "Hindi", "Math", "Break", "English", "PE", "SST", "Lunch", "CS"],
  Thursday: ["Hindi", "Science", "English", "Break", "Math", "Art", "PE", "Lunch", "SST"],
  Friday: ["Math", "CS", "Science", "Break", "Hindi", "English", "SST", "Lunch", "Art"],
  Saturday: ["English", "Math", "PE", "Break", "Science", "Hindi", "", "",""],
};

export default function TimetablePage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Timetable" subtitle="View and manage class timetables"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academics" }, { label: "Timetable" }]}
        actions={<div className="flex gap-2">
          <Select><SelectTrigger className="w-[130px]"><SelectValue placeholder="Class 10-A" /></SelectTrigger>
            <SelectContent>{["10-A","10-B","9-A","9-B","8-A"].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
          <Button variant="outline"><Printer className="h-4 w-4 mr-2" />Print</Button>
        </div>}
      />
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-3 text-left font-medium">Day / Period</th>
                {periods.map((p, i) => <th key={i} className="p-3 text-center font-medium text-xs">{p}</th>)}
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day} className="border-b">
                  <td className="p-3 font-medium">{day}</td>
                  {timetable[day].map((sub, i) => (
                    <td key={i} className="p-2 text-center">
                      {sub ? (
                        <div className={`px-2 py-1.5 rounded-md border text-xs font-medium ${subjectColors[sub] || "bg-muted"}`}>{sub}</div>
                      ) : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
