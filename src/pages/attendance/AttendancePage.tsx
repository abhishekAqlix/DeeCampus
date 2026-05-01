import { PageHeader } from "@/components/erp/PageHeader";
import { KPICard } from "@/components/erp/KPICard";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { UserCheck, Users, Clock, CheckCircle, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const classes = ["5-A", "5-B", "6-A", "6-B", "7-A", "8-B", "9-C", "10-A"];

const studentAttendance = [
  { roll: 1, name: "Aarav Sharma", status: "present" }, { roll: 2, name: "Ananya Gupta", status: "present" },
  { roll: 3, name: "Rohit Patel", status: "present" }, { roll: 4, name: "Priya Singh", status: "absent" },
  { roll: 5, name: "Karan Verma", status: "late" }, { roll: 6, name: "Sneha Reddy", status: "present" },
  { roll: 7, name: "Arjun Nair", status: "present" }, { roll: 8, name: "Divya Mishra", status: "present" },
  { roll: 9, name: "Vikash Kumar", status: "absent" }, { roll: 10, name: "Meera Joshi", status: "present" },
  { roll: 11, name: "Nikhil Thakur", status: "present" }, { roll: 12, name: "Riya Chopra", status: "present" },
  { roll: 13, name: "Suresh Yadav", status: "present" }, { roll: 14, name: "Pooja Iyer", status: "late" },
  { roll: 15, name: "Amit Saxena", status: "present" },
];

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("10-A");
  const [attendance, setAttendance] = useState(studentAttendance);

  const toggleStatus = (roll: number) => {
    setAttendance(prev => prev.map(s => {
      if (s.roll !== roll) return s;
      const order = ["present", "absent", "late"];
      const next = order[(order.indexOf(s.status) + 1) % 3];
      return { ...s, status: next };
    }));
  };

  const markAllPresent = () => {
    setAttendance(prev => prev.map(s => ({ ...s, status: "present" })));
    toast.success("All students marked present");
  };

  const saveAttendance = () => {
    toast.success("Attendance saved successfully");
  };

  const present = attendance.filter(s => s.status === "present").length;
  const absent = attendance.filter(s => s.status === "absent").length;
  const late = attendance.filter(s => s.status === "late").length;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Mark Attendance"
        subtitle="Daily student attendance for all classes"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Attendance" }, { label: "Mark Attendance" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllPresent} className="gap-1.5">
              <CheckCircle className="h-4 w-4" /> All Present
            </Button>
            <Button onClick={saveAttendance} className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5">
              <Save className="h-4 w-4" /> Save Attendance
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Students" value={attendance.length} icon={Users} />
        <KPICard title="Present" value={present} icon={CheckCircle} variant="success" />
        <KPICard title="Absent" value={absent} icon={UserCheck} variant="warning" />
        <KPICard title="Late" value={late} icon={Clock} variant="info" />
      </div>

      {/* Class Selector */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Class:</span>
        {classes.map(cls => (
          <Button
            key={cls}
            variant={selectedClass === cls ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedClass(cls)}
            className={selectedClass === cls ? "bg-primary" : ""}
          >
            {cls}
          </Button>
        ))}
      </div>

      {/* Attendance Grid */}
      <div className="bg-card rounded-lg border shadow-sm p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Class {selectedClass} — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success" /> Present</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-destructive" /> Absent</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-warning" /> Late</span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {attendance.map(student => (
            <button
              key={student.roll}
              onClick={() => toggleStatus(student.roll)}
              className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                student.status === "present" ? "border-success/30 bg-success/5" :
                student.status === "absent" ? "border-destructive/30 bg-destructive/5" :
                "border-warning/30 bg-warning/5"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Roll {student.roll}</span>
                <StatusBadge status={student.status as any} />
              </div>
              <p className="text-sm font-medium truncate">{student.name}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
