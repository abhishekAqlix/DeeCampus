import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: 1, name: "Fee Reminder", channel: "WhatsApp", category: "Finance", variables: "{{name}}, {{amount}}, {{due_date}}", lastUsed: "01 Apr 2026", status: "Active" },
  { id: 2, name: "Attendance Alert", channel: "SMS", category: "Attendance", variables: "{{name}}, {{date}}", lastUsed: "03 Apr 2026", status: "Active" },
  { id: 3, name: "Exam Schedule", channel: "Email", category: "Exams", variables: "{{name}}, {{exam}}, {{date}}", lastUsed: "25 Mar 2026", status: "Active" },
  { id: 4, name: "PTM Invitation", channel: "WhatsApp", category: "Events", variables: "{{name}}, {{date}}, {{time}}", lastUsed: "20 Mar 2026", status: "Active" },
  { id: 5, name: "Bus Route Change", channel: "SMS", category: "Transport", variables: "{{name}}, {{route}}, {{time}}", lastUsed: "15 Mar 2026", status: "Draft" },
  { id: 6, name: "Welcome Message", channel: "Email", category: "Admission", variables: "{{name}}, {{class}}", lastUsed: "10 Mar 2026", status: "Active" },
];

const columns = [
  { key: "name" as const, label: "Template Name", sortable: true },
  { key: "channel" as const, label: "Channel" },
  { key: "category" as const, label: "Category" },
  { key: "variables" as const, label: "Variables" },
  { key: "lastUsed" as const, label: "Last Used" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "Active" ? "active" : "draft"} label={v} /> },
];

export default function Templates() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ name: "", channel: "Email", category: "Finance", body: "" });

  const save = () => {
    if (!form.name.trim() || !form.body.trim()) { toast({ title: "Name and body required", variant: "destructive" }); return; }
    const vars = (form.body.match(/{{[^}]+}}/g) || []).join(", ") || "—";
    setData(prev => [{ id: prev.length + 1, name: form.name, channel: form.channel, category: form.category, variables: vars, lastUsed: "—", status: "Draft" }, ...prev]);
    setOpen(false); setForm({ name: "", channel: "Email", category: "Finance", body: "" });
    toast({ title: "Template created successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Message Templates" subtitle="Manage communication templates"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Communication" }, { label: "Templates" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Create Template</Button>}
      />
      <DataTable data={data} columns={columns} searchKey="name" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Template</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Template Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Channel</Label>
                <Select value={form.channel} onValueChange={v => setForm({ ...form, channel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="SMS">SMS</SelectItem>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Attendance">Attendance</SelectItem>
                    <SelectItem value="Exams">Exams</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Admission">Admission</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Message Body * (use {`{{variable}}`} for dynamic values)</Label><Textarea rows={4} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} /></div>
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
