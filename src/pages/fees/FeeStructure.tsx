import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { KPICard } from "@/components/erp/KPICard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Percent } from "lucide-react";

const seed = [
  { id: 1, class: "Nursery - UKG", tuitionFee: "₹3,000", admissionFee: "₹15,000", examFee: "₹1,000", transportFee: "₹2,500", annual: "₹55,000", status: "Active" },
  { id: 2, class: "Class 1 - 5", tuitionFee: "₹3,500", admissionFee: "₹18,000", examFee: "₹1,200", transportFee: "₹2,500", annual: "₹65,000", status: "Active" },
  { id: 3, class: "Class 6 - 8", tuitionFee: "₹4,000", admissionFee: "₹20,000", examFee: "₹1,500", transportFee: "₹3,000", annual: "₹78,000", status: "Active" },
  { id: 4, class: "Class 9 - 10", tuitionFee: "₹4,500", admissionFee: "₹22,000", examFee: "₹2,000", transportFee: "₹3,000", annual: "₹90,000", status: "Active" },
  { id: 5, class: "Class 11 - 12 (Science)", tuitionFee: "₹5,500", admissionFee: "₹25,000", examFee: "₹2,500", transportFee: "₹3,500", annual: "₹1,10,000", status: "Active" },
  { id: 6, class: "Class 11 - 12 (Commerce)", tuitionFee: "₹5,000", admissionFee: "₹22,000", examFee: "₹2,000", transportFee: "₹3,500", annual: "₹98,000", status: "Active" },
];

const waiverFields = [
  "Staff Ward Concession",
  "Sports Concession",
  "Merit Concession",
  "SC / ST Category",
  "OBC Category",
  "Early Payment Discount",
  "Freedom Fighter Family",
  "Girl Child Scholarship",
  "Orphan Concession / Welfare Scholarship",
  "Sibling Fee Concession",
  "EWS Fee Waiver",
  "Sponsored Scholarship",
];

type FeeStructureRow = typeof seed[number];
type SavedWaiver = { name: string; value: string; type: string };

const parseAmount = (amount: string) => Number(amount.replace(/[^\d.]/g, "")) || 0;
const formatAmount = (amount: number) => `Rs. ${Math.max(0, Math.round(amount)).toLocaleString("en-IN")}`;

const getWaiverSummary = (annualTotal: number, waiver: SavedWaiver) => {
  const discountValue = Number(waiver.value) || 0;
  const discountAmount = waiver.type === "%" ? (annualTotal * discountValue) / 100 : discountValue;
  return {
    discountAmount,
    payableAmount: Math.max(annualTotal - discountAmount, 0),
  };
};

export default function FeeStructure() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ class: "", tuition: "", admission: "", exam: "", transport: "", annual: "" });
  const [waiverOpen, setWaiverOpen] = useState(false);
  const [waiverSummaryOpen, setWaiverSummaryOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructureRow | null>(null);
  const [waivers, setWaivers] = useState<Record<string, { value: string; type: "%" | "₹" }>>(
    () => Object.fromEntries(waiverFields.map(f => [f, { value: "", type: "%" }]))
  );
  const [savedWaivers, setSavedWaivers] = useState<SavedWaiver[]>([]);

  const columns = [
    { key: "class" as const, label: "Class Group", sortable: true },
    { key: "tuitionFee" as const, label: "Tuition/mo" },
    { key: "admissionFee" as const, label: "Admission" },
    { key: "examFee" as const, label: "Exam Fee" },
    { key: "transportFee" as const, label: "Transport/mo" },
    { key: "annual" as const, label: "Annual Total" },
    {
      key: "id" as const,
      label: "Fee Waiver",
      render: (id: number) => {
        const row = data.find(item => item.id === id);
        return (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="View reduced payable amount"
            onClick={(event) => {
              event.stopPropagation();
              if (!row) return;
              setSelectedStructure(row);
              setWaiverSummaryOpen(true);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
    { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status="active" label={v} /> },
  ];

  const save = () => {
    if (!form.class.trim()) { toast({ title: "Class group required", variant: "destructive" }); return; }
    setData(prev => [...prev, { id: prev.length + 1, class: form.class, tuitionFee: `₹${form.tuition || 0}`, admissionFee: `₹${form.admission || 0}`, examFee: `₹${form.exam || 0}`, transportFee: `₹${form.transport || 0}`, annual: `₹${form.annual || 0}`, status: "Active" }]);
    setOpen(false); setForm({ class: "", tuition: "", admission: "", exam: "", transport: "", annual: "" });
    toast({ title: "Fee structure added successfully" });
  };

  const saveWaivers = () => {
    const entries = Object.entries(waivers)
      .filter(([, v]) => v.value.trim() !== "" && Number(v.value) > 0)
      .map(([name, v]) => ({ name, value: v.value, type: v.type }));
    if (entries.length === 0) { toast({ title: "Please enter at least one discount", variant: "destructive" }); return; }
    setSavedWaivers(entries);
    setWaiverOpen(false);
    toast({ title: `${entries.length} fee waiver(s) saved successfully` });
  };

  const updateWaiver = (field: string, key: "value" | "type", val: string) => {
    setWaivers(prev => ({ ...prev, [field]: { ...prev[field], [key]: val } }));
  };

  const selectedAnnualTotal = selectedStructure ? parseAmount(selectedStructure.annual) : 0;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Fee Structure" subtitle="Define and manage fee structures per class"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Fees & Finance" }, { label: "Fee Structure" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setWaiverOpen(true)} className="gap-1.5">
              <Percent className="h-4 w-4" /> Fee Waiver
            </Button>
            <Button onClick={() => setOpen(true)}>+ Add Structure</Button>
          </div>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <KPICard title="Fee Categories" value="8" variant="blue" />
        <KPICard title="Class Groups" value={String(data.length)} variant="default" />
        <KPICard title="Academic Year" value="2026-27" variant="green" />
      </div>
      <DataTable data={data} columns={columns} searchKey="class" />

      {savedWaivers.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Active Fee Waivers & Concessions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {savedWaivers.map((w, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
                <span className="text-foreground">{w.name}</span>
                <span className="font-semibold text-primary">{w.type === "%" ? `${w.value}%` : `₹${w.value}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Fee Structure</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Class Group *</Label><Input placeholder="e.g., Class 9 - 10" value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Tuition /mo</Label><Input type="number" value={form.tuition} onChange={e => setForm({ ...form, tuition: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Admission</Label><Input type="number" value={form.admission} onChange={e => setForm({ ...form, admission: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Exam Fee</Label><Input type="number" value={form.exam} onChange={e => setForm({ ...form, exam: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Transport /mo</Label><Input type="number" value={form.transport} onChange={e => setForm({ ...form, transport: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Annual Total</Label><Input type="number" value={form.annual} onChange={e => setForm({ ...form, annual: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={waiverSummaryOpen} onOpenChange={setWaiverSummaryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Eye className="h-5 w-5 text-primary" /> Fee Waiver Payable Amount</DialogTitle>
          </DialogHeader>
          {selectedStructure && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Class Group</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{selectedStructure.class}</p>
                  <p className="text-sm font-semibold text-primary">{formatAmount(selectedAnnualTotal)}</p>
                </div>
              </div>

              {savedWaivers.length > 0 ? (
                <div className="rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-12 bg-secondary/60 px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                    <span className="col-span-5">Fee Waiver</span>
                    <span className="col-span-2 text-right">Discount</span>
                    <span className="col-span-2 text-right">Reduced</span>
                    <span className="col-span-3 text-right">Payable</span>
                  </div>
                  <div className="divide-y">
                    {savedWaivers.map((waiver) => {
                      const summary = getWaiverSummary(selectedAnnualTotal, waiver);
                      return (
                        <div key={waiver.name} className="grid grid-cols-12 items-center px-3 py-3 text-sm">
                          <span className="col-span-5 font-medium">{waiver.name}</span>
                          <span className="col-span-2 text-right text-muted-foreground">{waiver.type === "%" ? `${waiver.value}%` : formatAmount(Number(waiver.value) || 0)}</span>
                          <span className="col-span-2 text-right text-muted-foreground">{formatAmount(summary.discountAmount)}</span>
                          <span className="col-span-3 text-right font-semibold text-primary">{formatAmount(summary.payableAmount)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm font-medium">No fee waiver has been saved yet.</p>
                  <p className="mt-1 text-xs text-muted-foreground">Add a waiver first to see the reduced payable amount.</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {savedWaivers.length === 0 && (
              <Button variant="outline" onClick={() => { setWaiverSummaryOpen(false); setWaiverOpen(true); }}>Add Waiver</Button>
            )}
            <Button onClick={() => setWaiverSummaryOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={waiverOpen} onOpenChange={setWaiverOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Percent className="h-5 w-5 text-primary" /> Fee Waiver & Concessions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">Set discount value and type for each concession category. Leave blank to skip.</p>
            <div className="space-y-2">
              {waiverFields.map((field) => (
                <div key={field} className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-6 text-xs font-normal">{field}</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="col-span-4 h-9"
                    value={waivers[field].value}
                    onChange={(e) => updateWaiver(field, "value", e.target.value)}
                  />
                  <Select value={waivers[field].type} onValueChange={(v) => updateWaiver(field, "type", v)}>
                    <SelectTrigger className="col-span-2 h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="%">%</SelectItem>
                      <SelectItem value="₹">₹</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWaiverOpen(false)}>Cancel</Button>
            <Button onClick={saveWaivers}>Save Waivers</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
