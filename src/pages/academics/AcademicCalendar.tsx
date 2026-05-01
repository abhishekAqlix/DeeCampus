import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { date: "01 Apr 2026", event: "New Academic Session Begins", type: "Academic", status: "Upcoming" },
  { date: "05 Apr 2026", event: "Parent-Teacher Meeting", type: "Meeting", status: "Upcoming" },
  { date: "10 Apr 2026", event: "Science Exhibition", type: "Event", status: "Upcoming" },
  { date: "14 Apr 2026", event: "Ambedkar Jayanti", type: "Holiday", status: "Holiday" },
  { date: "21 Apr 2026", event: "Unit Test I Begins", type: "Exam", status: "Upcoming" },
  { date: "01 May 2026", event: "May Day", type: "Holiday", status: "Holiday" },
  { date: "15 May 2026", event: "Sports Day", type: "Event", status: "Upcoming" },
  { date: "01 Jun 2026", event: "Summer Vacation Begins", type: "Holiday", status: "Holiday" },
  { date: "01 Jul 2026", event: "School Reopens", type: "Academic", status: "Upcoming" },
  { date: "15 Aug 2026", event: "Independence Day", type: "Holiday", status: "Holiday" },
];

const typeColors: Record<string, string> = {
  Academic: "active", Holiday: "cancelled", Event: "pending", Exam: "draft", Meeting: "approved"
};

export default function AcademicCalendar() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState(seed);
  const [form, setForm] = useState({ event: "", date: "", type: "Event" });

  const save = () => {
    if (!form.event.trim() || !form.date) { toast({ title: "Event and date required", variant: "destructive" }); return; }
    const d = new Date(form.date);
    const formatted = `${String(d.getDate()).padStart(2, "0")} ${d.toLocaleString("en", { month: "short" })} ${d.getFullYear()}`;
    setEvents(prev => [...prev, { date: formatted, event: form.event, type: form.type, status: form.type === "Holiday" ? "Holiday" : "Upcoming" }]);
    setOpen(false); setForm({ event: "", date: "", type: "Event" });
    toast({ title: "Event added successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Academic Calendar" subtitle="Manage events, holidays, and academic schedule"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academics" }, { label: "Calendar" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Add Event</Button>}
      />
      <Card>
        <CardHeader><CardTitle className="text-base">2026-27 Academic Calendar</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <div className="text-xs text-muted-foreground">{e.date.split(" ")[1]}</div>
                    <div className="text-xl font-bold">{e.date.split(" ")[0]}</div>
                  </div>
                  <div>
                    <div className="font-medium">{e.event}</div>
                    <div className="text-xs text-muted-foreground">{e.type}</div>
                  </div>
                </div>
                <StatusBadge status={typeColors[e.type] as any} label={e.status} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Event</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Event Title *</Label><Input value={form.event} onChange={e => setForm({ ...form, event: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Date *</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Holiday">Holiday</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Exam">Exam</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
