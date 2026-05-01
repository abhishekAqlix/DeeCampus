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
  { id: 1, date: "01 Apr 2026", category: "Salary", description: "March staff salary", amount: "₹8,42,000", paidTo: "Staff Account", mode: "Bank Transfer", status: "Approved" },
  { id: 2, date: "28 Mar 2026", category: "Maintenance", description: "Building repair work", amount: "₹45,000", paidTo: "ABC Contractors", mode: "Cheque", status: "Approved" },
  { id: 3, date: "25 Mar 2026", category: "Supplies", description: "Lab equipment purchase", amount: "₹1,25,000", paidTo: "Lab Supplies Co.", mode: "Bank Transfer", status: "Pending" },
  { id: 4, date: "20 Mar 2026", category: "Utilities", description: "Electricity bill - March", amount: "₹78,000", paidTo: "BSES", mode: "Online", status: "Approved" },
  { id: 5, date: "18 Mar 2026", category: "Transport", description: "Diesel for buses", amount: "₹65,000", paidTo: "HP Petrol Pump", mode: "Cash", status: "Approved" },
  { id: 6, date: "15 Mar 2026", category: "Events", description: "Annual Day decorations", amount: "₹35,000", paidTo: "Event Decor Ltd", mode: "UPI", status: "Pending" },
];

const columns = [
  { key: "date" as const, label: "Date" },
  { key: "category" as const, label: "Category" },
  { key: "description" as const, label: "Description", sortable: true },
  { key: "amount" as const, label: "Amount" },
  { key: "paidTo" as const, label: "Paid To" },
  { key: "mode" as const, label: "Mode" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "Approved" ? "approved" : "pending"} label={v} /> },
];

const fmt = (s: string) => { const d = new Date(s); return `${String(d.getDate()).padStart(2,"0")} ${d.toLocaleString("en",{month:"short"})} ${d.getFullYear()}`; };

export default function ExpenseManagement() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ date: "", category: "Maintenance", description: "", amount: "", paidTo: "", mode: "Bank Transfer" });

  const save = () => {
    if (!form.date || !form.description.trim() || !form.amount) { toast({ title: "Required fields missing", variant: "destructive" }); return; }
    setData(prev => [{ id: prev.length + 1, date: fmt(form.date), category: form.category, description: form.description, amount: `₹${Number(form.amount).toLocaleString("en-IN")}`, paidTo: form.paidTo, mode: form.mode, status: "Pending" }, ...prev]);
    setOpen(false); setForm({ date: "", category: "Maintenance", description: "", amount: "", paidTo: "", mode: "Bank Transfer" });
    toast({ title: "Expense added successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Expense Management" subtitle="Track and manage school expenses"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Fees & Finance" }, { label: "Expenses" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Add Expense</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Expenses" value="₹11.90 L" variant="red" />
        <KPICard title="This Month" value="₹8.87 L" variant="amber" />
        <KPICard title="Pending Approval" value="₹1.60 L" variant="default" />
        <KPICard title="Categories" value="12" variant="blue" />
      </div>
      <DataTable data={data} columns={columns} searchKey="description" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Date *</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salary">Salary</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Description *</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Amount *</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Paid To</Label><Input value={form.paidTo} onChange={e => setForm({ ...form, paidTo: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Payment Mode</Label>
              <Select value={form.mode} onValueChange={v => setForm({ ...form, mode: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                </SelectContent>
              </Select>
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
