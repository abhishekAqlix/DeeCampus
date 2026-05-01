import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { KPICard } from "@/components/erp/KPICard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: 1, staff: "Rajesh Thakur", designation: "Senior Teacher", basic: "₹45,000", allowances: "₹12,000", deductions: "₹5,400", net: "₹51,600", status: "Paid" },
  { id: 2, staff: "Sunita Sharma", designation: "Teacher", basic: "₹38,000", allowances: "₹10,000", deductions: "₹4,560", net: "₹43,440", status: "Paid" },
  { id: 3, staff: "Amit Verma", designation: "Lab Assistant", basic: "₹25,000", allowances: "₹6,000", deductions: "₹3,000", net: "₹28,000", status: "Processing" },
  { id: 4, staff: "Priya Kapoor", designation: "Teacher", basic: "₹40,000", allowances: "₹11,000", deductions: "₹4,800", net: "₹46,200", status: "Pending" },
  { id: 5, staff: "Deepak Singh", designation: "PT Teacher", basic: "₹30,000", allowances: "₹8,000", deductions: "₹3,600", net: "₹34,400", status: "Paid" },
  { id: 6, staff: "Meena Gupta", designation: "Teacher", basic: "₹42,000", allowances: "₹11,500", deductions: "₹5,040", net: "₹48,460", status: "Paid" },
];

const columns = [
  { key: "staff" as const, label: "Staff Name", sortable: true },
  { key: "designation" as const, label: "Designation" },
  { key: "basic" as const, label: "Basic" },
  { key: "allowances" as const, label: "Allowances" },
  { key: "deductions" as const, label: "Deductions" },
  { key: "net" as const, label: "Net Salary" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "Paid" ? "paid" : v === "Processing" ? "pending" : "draft"} label={v} /> },
];

export default function Payroll() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ month: "April 2026", department: "All", payDate: "" });

  const save = () => {
    if (!form.payDate) { toast({ title: "Pay date required", variant: "destructive" }); return; }
    setData(prev => prev.map(p => p.status === "Pending" || p.status === "Processing" ? { ...p, status: "Paid" } : p));
    setOpen(false);
    toast({ title: `Payroll for ${form.month} processed successfully` });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Payroll" subtitle="Monthly salary processing and management"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staff" }, { label: "Payroll" }]}
        actions={<Button onClick={() => setOpen(true)}>Process Payroll</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Payroll" value="₹8,42,000" variant="blue" />
        <KPICard title="Paid" value="32" variant="green" />
        <KPICard title="Pending" value="8" variant="amber" />
        <KPICard title="Processing" value="5" variant="default" />
      </div>
      <DataTable data={data} columns={columns} searchKey="staff" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Process Payroll</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Pay Period</Label>
              <Select value={form.month} onValueChange={v => setForm({ ...form, month: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="April 2026">April 2026</SelectItem>
                  <SelectItem value="March 2026">March 2026</SelectItem>
                  <SelectItem value="February 2026">February 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label className="text-xs">Department</Label>
              <Select value={form.department} onValueChange={v => setForm({ ...form, department: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  <SelectItem value="Teaching">Teaching</SelectItem>
                  <SelectItem value="Non-Teaching">Non-Teaching</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label className="text-xs">Pay Date *</Label><Input type="date" value={form.payDate} onChange={e => setForm({ ...form, payDate: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Process</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
