import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { KPICard } from "@/components/erp/KPICard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: 1, subject: "Mathematics", topic: "Quadratic Equations", type: "MCQ", difficulty: "Medium", marks: 2, createdBy: "Mr. Thakur", status: "Approved" },
  { id: 2, subject: "Mathematics", topic: "Trigonometry", type: "Short Answer", difficulty: "Hard", marks: 5, createdBy: "Mr. Thakur", status: "Approved" },
  { id: 3, subject: "Science", topic: "Chemical Reactions", type: "MCQ", difficulty: "Easy", marks: 1, createdBy: "Mrs. Sharma", status: "Approved" },
  { id: 4, subject: "English", topic: "Comprehension", type: "Long Answer", difficulty: "Medium", marks: 10, createdBy: "Mrs. Gupta", status: "Draft" },
  { id: 5, subject: "Science", topic: "Light & Reflection", type: "MCQ", difficulty: "Medium", marks: 2, createdBy: "Mr. Verma", status: "Approved" },
  { id: 6, subject: "Hindi", topic: "Grammar", type: "Short Answer", difficulty: "Easy", marks: 3, createdBy: "Mrs. Kapoor", status: "Pending" },
  { id: 7, subject: "SST", topic: "French Revolution", type: "Long Answer", difficulty: "Hard", marks: 8, createdBy: "Mr. Singh", status: "Approved" },
];

const columns = [
  { key: "subject" as const, label: "Subject", sortable: true },
  { key: "topic" as const, label: "Topic" },
  { key: "type" as const, label: "Type" },
  { key: "difficulty" as const, label: "Difficulty", render: (v: string) => <StatusBadge status={v === "Easy" ? "active" : v === "Medium" ? "pending" : "dropped"} label={v} /> },
  { key: "marks" as const, label: "Marks" },
  { key: "createdBy" as const, label: "Created By" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "Approved" ? "approved" : v === "Draft" ? "draft" : "pending"} label={v} /> },
];

export default function QuestionBank() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ subject: "Mathematics", topic: "", type: "MCQ", difficulty: "Medium", marks: "", question: "" });

  const save = () => {
    if (!form.topic.trim() || !form.question.trim()) { toast({ title: "Topic and question required", variant: "destructive" }); return; }
    setData(prev => [{ id: prev.length + 1, subject: form.subject, topic: form.topic, type: form.type, difficulty: form.difficulty, marks: Number(form.marks) || 1, createdBy: "Admin", status: "Draft" }, ...prev]);
    setOpen(false); setForm({ subject: "Mathematics", topic: "", type: "MCQ", difficulty: "Medium", marks: "", question: "" });
    toast({ title: "Question added successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Question Bank" subtitle="Manage questions for exam papers"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Exams" }, { label: "Question Bank" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Add Question</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Questions" value={String(1245 + (data.length - seed.length))} variant="blue" />
        <KPICard title="Subjects" value="8" variant="default" />
        <KPICard title="Approved" value="1,102" variant="green" />
        <KPICard title="Pending Review" value="42" variant="amber" />
      </div>
      <DataTable data={data} columns={columns} searchKey="topic" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Question</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Subject</Label>
                <Select value={form.subject} onValueChange={v => setForm({ ...form, subject: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Mathematics","Science","English","Hindi","SST","Computer Science"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Topic *</Label><Input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Question *</Label><Textarea rows={3} value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2"><Label className="text-xs">Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MCQ">MCQ</SelectItem>
                    <SelectItem value="Short Answer">Short Answer</SelectItem>
                    <SelectItem value="Long Answer">Long Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Difficulty</Label>
                <Select value={form.difficulty} onValueChange={v => setForm({ ...form, difficulty: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Marks</Label><Input type="number" value={form.marks} onChange={e => setForm({ ...form, marks: e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
