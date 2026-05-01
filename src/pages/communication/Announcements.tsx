import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { title: "Annual Day Celebration", date: "03 Apr 2026", audience: "All", priority: "High", content: "Annual Day will be celebrated on 20th April. All students must participate in at least one activity.", status: "Published" },
  { title: "PTM Schedule", date: "01 Apr 2026", audience: "Parents", priority: "Medium", content: "Parent-Teacher Meeting scheduled for 15th April, 10 AM - 1 PM.", status: "Published" },
  { title: "Summer Uniform Notice", date: "28 Mar 2026", audience: "Students", priority: "Medium", content: "Students must switch to summer uniforms from 1st April.", status: "Published" },
  { title: "Fee Payment Reminder", date: "25 Mar 2026", audience: "Parents", priority: "High", content: "Last date for fee payment is 31st March. Late fee will be applicable.", status: "Published" },
  { title: "Staff Training Workshop", date: "22 Mar 2026", audience: "Staff", priority: "Low", content: "Mandatory training on new ERP system on 28th March.", status: "Draft" },
];

export default function Announcements() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(seed);
  const [form, setForm] = useState({ title: "", content: "", audience: "All", priority: "Medium" });

  const save = () => {
    if (!form.title.trim() || !form.content.trim()) { toast({ title: "Title and content required", variant: "destructive" }); return; }
    const today = new Date();
    const formatted = `${String(today.getDate()).padStart(2,"0")} ${today.toLocaleString("en",{month:"short"})} ${today.getFullYear()}`;
    setList(prev => [{ title: form.title, date: formatted, audience: form.audience, priority: form.priority, content: form.content, status: "Published" }, ...prev]);
    setOpen(false); setForm({ title: "", content: "", audience: "All", priority: "Medium" });
    toast({ title: "Announcement published successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Announcements" subtitle="Create and manage announcements"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Communication" }, { label: "Announcements" }]}
        actions={<Button onClick={() => setOpen(true)}><Megaphone className="h-4 w-4 mr-2" />New Announcement</Button>}
      />
      <div className="space-y-3">
        {list.map((a, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-sm text-muted-foreground">{a.content}</div>
                  <div className="flex gap-2 mt-2">
                    <StatusBadge status={a.status === "Published" ? "active" : "draft"} label={a.status} />
                    <StatusBadge status={a.priority === "High" ? "overdue" : a.priority === "Medium" ? "pending" : "active"} label={a.priority} />
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{a.audience}</span>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{a.date}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Announcement</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-2"><Label className="text-xs">Content *</Label><Textarea rows={4} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Audience</Label>
                <Select value={form.audience} onValueChange={v => setForm({ ...form, audience: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Students">Students</SelectItem>
                    <SelectItem value="Parents">Parents</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
