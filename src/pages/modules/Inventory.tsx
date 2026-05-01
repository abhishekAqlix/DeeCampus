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
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: 1, name: "Whiteboard Markers", category: "Stationery", quantity: 250, minStock: 50, unit: "Pcs", lastPurchase: "15 Mar 2026", status: "In Stock" },
  { id: 2, name: "A4 Paper Ream", category: "Stationery", quantity: 15, minStock: 20, unit: "Reams", lastPurchase: "10 Mar 2026", status: "Low Stock" },
  { id: 3, name: "Lab Beakers", category: "Lab Equipment", quantity: 45, minStock: 10, unit: "Pcs", lastPurchase: "01 Feb 2026", status: "In Stock" },
  { id: 4, name: "Projector Lamps", category: "Electronics", quantity: 3, minStock: 5, unit: "Pcs", lastPurchase: "20 Jan 2026", status: "Low Stock" },
  { id: 5, name: "Cleaning Liquid", category: "Housekeeping", quantity: 20, minStock: 10, unit: "Ltrs", lastPurchase: "25 Mar 2026", status: "In Stock" },
  { id: 6, name: "First Aid Kit", category: "Medical", quantity: 0, minStock: 5, unit: "Kits", lastPurchase: "01 Dec 2025", status: "Out of Stock" },
];

const columns = [
  { key: "name" as const, label: "Item", sortable: true },
  { key: "category" as const, label: "Category" },
  { key: "quantity" as const, label: "Qty" },
  { key: "minStock" as const, label: "Min Stock" },
  { key: "unit" as const, label: "Unit" },
  { key: "lastPurchase" as const, label: "Last Purchase" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "In Stock" ? "active" : v === "Low Stock" ? "pending" : "cancelled"} label={v} /> },
];

export default function InventoryPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ name: "", category: "Stationery", quantity: "", minStock: "", unit: "Pcs" });

  const save = () => {
    if (!form.name.trim()) { toast({ title: "Item name required", variant: "destructive" }); return; }
    const q = Number(form.quantity) || 0; const min = Number(form.minStock) || 0;
    const today = new Date();
    const formatted = `${String(today.getDate()).padStart(2,"0")} ${today.toLocaleString("en",{month:"short"})} ${today.getFullYear()}`;
    setData(prev => [...prev, { id: prev.length + 1, name: form.name, category: form.category, quantity: q, minStock: min, unit: form.unit, lastPurchase: formatted, status: q === 0 ? "Out of Stock" : q < min ? "Low Stock" : "In Stock" }]);
    setOpen(false); setForm({ name: "", category: "Stationery", quantity: "", minStock: "", unit: "Pcs" });
    toast({ title: "Item added successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Inventory" subtitle="Track school supplies and equipment"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Inventory" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Add Item</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Items" value={String(486 + (data.length - seed.length))} variant="blue" />
        <KPICard title="In Stock" value="412" variant="green" />
        <KPICard title="Low Stock" value="38" variant="amber" />
        <KPICard title="Out of Stock" value="12" variant="red" />
      </div>
      <DataTable data={data} columns={columns} searchKey="name" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Item</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Item Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Stationery">Stationery</SelectItem>
                    <SelectItem value="Lab Equipment">Lab Equipment</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                    <SelectItem value="Medical">Medical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Unit</Label>
                <Select value={form.unit} onValueChange={v => setForm({ ...form, unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pcs">Pcs</SelectItem>
                    <SelectItem value="Reams">Reams</SelectItem>
                    <SelectItem value="Ltrs">Ltrs</SelectItem>
                    <SelectItem value="Kits">Kits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Quantity</Label><Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Min Stock</Label><Input type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} /></div>
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
