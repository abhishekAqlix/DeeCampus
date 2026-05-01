import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const studentRoster = [
  { id: 1, roll: "101", name: "Aarav Sharma" },
  { id: 2, roll: "102", name: "Priya Patel" },
  { id: 3, roll: "103", name: "Rohan Gupta" },
  { id: 4, roll: "104", name: "Sneha Joshi" },
  { id: 5, roll: "105", name: "Karan Singh" },
  { id: 6, roll: "106", name: "Diya Reddy" },
  { id: 7, roll: "107", name: "Vivek Kumar" },
  { id: 8, roll: "108", name: "Anika Verma" },
];

const calcGrade = (m: number) =>
  m >= 90 ? "A+" : m >= 80 ? "A" : m >= 70 ? "B+" : m >= 60 ? "B" : m >= 50 ? "C" : m >= 33 ? "D" : "F";

const allSubjects = ["Mathematics", "English", "Science", "Hindi", "SST"];

type MarkValue = string;
type ClassStudentMark = { id: number; roll: string; name: string; maxMarks: number; obtained: MarkValue; grade: string };

const gradeFromMark = (mark: MarkValue) => mark === "" ? "-" : calcGrade(Number(mark));
const clampMarkInput = (value: string, maxMarks: number) => {
  if (value === "") return "";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "";
  return String(Math.min(Math.max(numeric, 0), maxMarks));
};

export default function MarksEntry() {
  const [exam, setExam] = useState("");
  const [klass, setKlass] = useState("");
  const [subject, setSubject] = useState("");
  const [students, setStudents] = useState<ClassStudentMark[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [activeStudent, setActiveStudent] = useState<typeof studentRoster[number] | null>(null);
  const [studentSubjectMarks, setStudentSubjectMarks] = useState<Record<string, MarkValue>>({});
  const [savedClassMarks, setSavedClassMarks] = useState<Record<string, Record<number, MarkValue>>>({});
  const [savedStudentMarks, setSavedStudentMarks] = useState<Record<number, Record<string, MarkValue>>>({});

  const ready = exam && klass && subject;

  const loadStudents = (e = exam, k = klass, s = subject) => {
    if (e && k && s) {
      const key = `${e}|${k}|${s}`;
      const savedMarks = savedClassMarks[key] ?? {};
      setStudents(studentRoster.map(st => {
        const obtained = savedMarks[st.id] ?? "";
        return { ...st, maxMarks: 100, obtained, grade: gradeFromMark(obtained) };
      }));
    } else {
      setStudents([]);
    }
  };

  const updateMarks = (id: number, marks: string, maxMarks: number) => {
    const obtained = clampMarkInput(marks, maxMarks);
    setStudents(prev => prev.map(s => s.id === id ? { ...s, obtained, grade: gradeFromMark(obtained) } : s));
  };

  const handleSave = () => {
    if (!ready) { toast.error("Please select exam, class and subject"); return; }
    const key = `${exam}|${klass}|${subject}`;
    setSavedClassMarks(prev => ({
      ...prev,
      [key]: Object.fromEntries(students.map(s => [s.id, s.obtained])),
    }));
    toast.success("Marks saved successfully!");
  };

  const matchedStudents = studentSearch.trim()
    ? studentRoster.filter(s =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.roll.includes(studentSearch.trim())
      )
    : [];

  const openStudentMarks = (s: typeof studentRoster[number]) => {
    setActiveStudent(s);
    const savedMarks = savedStudentMarks[s.id];
    if (savedMarks) {
      setStudentSubjectMarks(savedMarks);
      return;
    }
    setStudentSubjectMarks(Object.fromEntries(allSubjects.map(sub => [sub, ""])));
  };

  const updateStudentSubjectMark = (sub: string, marks: string) => {
    setStudentSubjectMarks(prev => ({ ...prev, [sub]: clampMarkInput(marks, 100) }));
  };

  const saveStudentMarks = () => {
    if (activeStudent) {
      setSavedStudentMarks(prev => ({ ...prev, [activeStudent.id]: studentSubjectMarks }));
    }
    toast.success(`Marks saved for ${activeStudent?.name}!`);
    setActiveStudent(null);
    setStudentSearch("");
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Marks Entry" subtitle="Enter and update student exam marks"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Exams" }, { label: "Marks Entry" }]}
        actions={<Button onClick={handleSave} disabled={!ready}>Save Marks</Button>}
      />
      <Tabs defaultValue="byClass" className="w-full">
        <TabsList>
          <TabsTrigger value="byClass">By Class & Subject</TabsTrigger>
          <TabsTrigger value="byStudent">Search Student</TabsTrigger>
        </TabsList>

        <TabsContent value="byClass" className="space-y-6 mt-4">
      <div className="flex gap-2 flex-wrap">
        <Select value={exam} onValueChange={(v) => { setExam(v); loadStudents(v, klass, subject); }}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Exam" /></SelectTrigger>
          <SelectContent><SelectItem value="mid">Mid Term</SelectItem><SelectItem value="final">Final</SelectItem><SelectItem value="unit1">Unit Test 1</SelectItem></SelectContent></Select>
        <Select value={klass} onValueChange={(v) => { setKlass(v); loadStudents(exam, v, subject); }}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Class" /></SelectTrigger>
          <SelectContent>{["10-A","10-B","9-A","9-B"].map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
        <Select value={subject} onValueChange={(v) => { setSubject(v); loadStudents(exam, klass, v); }}>
          <SelectTrigger className="w-[130px]"><SelectValue placeholder="Subject" /></SelectTrigger>
          <SelectContent>{allSubjects.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
      </div>
      {!ready ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            Please select <span className="font-medium text-foreground">Exam</span>, <span className="font-medium text-foreground">Class</span> and <span className="font-medium text-foreground">Subject</span> to load students.
          </CardContent>
        </Card>
      ) : (
      <Card>
        <CardHeader><CardTitle className="text-base">Class {klass} — {subject} — {exam === "mid" ? "Mid Term" : exam === "final" ? "Final" : "Unit Test 1"} Exam</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Roll</TableHead><TableHead>Name</TableHead><TableHead>Max Marks</TableHead><TableHead>Obtained</TableHead><TableHead>Grade</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {students.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.roll}</TableCell><TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.maxMarks}</TableCell>
                  <TableCell><Input type="number" className="w-20 h-8" value={s.obtained} placeholder="0" onChange={e => updateMarks(s.id, e.target.value, s.maxMarks)} min={0} max={s.maxMarks} /></TableCell>
                  <TableCell><span className={`px-2 py-1 rounded text-xs font-medium ${s.grade === "-" ? "bg-muted text-muted-foreground" : s.grade === "F" ? "bg-red-100 text-red-700" : s.grade.startsWith("A") ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{s.grade}</span></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      )}
        </TabsContent>

        <TabsContent value="byStudent" className="space-y-4 mt-4">
          <div className="relative max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search student by name or roll number..."
              className="pl-9"
              value={studentSearch}
              onChange={(e) => { setStudentSearch(e.target.value); setActiveStudent(null); }}
            />
          </div>

          {!activeStudent && studentSearch.trim() && (
            <Card>
              <CardContent className="p-0">
                {matchedStudents.length === 0 ? (
                  <div className="py-12 text-center text-sm text-muted-foreground">No students found.</div>
                ) : (
                  <Table>
                    <TableHeader><TableRow>
                      <TableHead>Roll</TableHead><TableHead>Name</TableHead><TableHead className="text-right">Action</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                      {matchedStudents.map(s => (
                        <TableRow key={s.id} className="cursor-pointer" onClick={() => openStudentMarks(s)}>
                          <TableCell>{s.roll}</TableCell>
                          <TableCell className="font-medium">{s.name}</TableCell>
                          <TableCell className="text-right"><Button size="sm" variant="outline">View Marks</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}

          {activeStudent && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{activeStudent.name} — Roll {activeStudent.roll} — All Subjects</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setActiveStudent(null)}>Back</Button>
                    <Button size="sm" onClick={saveStudentMarks}>Save Marks</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Subject</TableHead><TableHead>Max Marks</TableHead><TableHead>Obtained</TableHead><TableHead>Grade</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {allSubjects.map(sub => {
                      const m = studentSubjectMarks[sub] ?? "";
                      const g = gradeFromMark(m);
                      return (
                        <TableRow key={sub}>
                          <TableCell className="font-medium">{sub}</TableCell>
                          <TableCell>100</TableCell>
                          <TableCell><Input type="number" className="w-20 h-8" value={m} placeholder="0" min={0} max={100} onChange={e => updateStudentSubjectMark(sub, e.target.value)} /></TableCell>
                          <TableCell><span className={`px-2 py-1 rounded text-xs font-medium ${g === "-" ? "bg-muted text-muted-foreground" : g === "F" ? "bg-red-100 text-red-700" : g.startsWith("A") ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{g}</span></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-4 pt-3 border-t text-sm">
                  <span className="text-muted-foreground mr-3">Total:</span>
                  <span className="font-bold">{Object.values(studentSubjectMarks).reduce((a, b) => a + (Number(b) || 0), 0)} / {allSubjects.length * 100}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
