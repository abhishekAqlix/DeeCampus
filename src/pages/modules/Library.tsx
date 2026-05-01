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
  { id: 1, title: "Mathematics for Class 10", author: "R.D. Sharma", isbn: "978-81-7658-123", category: "Textbook", copies: 25, available: 18, status: "Available" },
  { id: 2, title: "English Grammar", author: "Wren & Martin", isbn: "978-81-2190-456", category: "Reference", copies: 15, available: 3, status: "Low Stock" },
  { id: 3, title: "Harry Potter", author: "J.K. Rowling", isbn: "978-0-7475-789", category: "Fiction", copies: 8, available: 0, status: "All Issued" },
  { id: 4, title: "Science Lab Manual", author: "NCERT", isbn: "978-81-7450-321", category: "Textbook", copies: 30, available: 22, status: "Available" },
  { id: 5, title: "India After Independence", author: "Bipan Chandra", isbn: "978-0-1430-654", category: "History", copies: 10, available: 7, status: "Available" },
  { id: 6, title: "Computer Fundamentals", author: "P.K. Sinha", isbn: "978-81-7656-987", category: "Reference", copies: 12, available: 5, status: "Available" },
];

const columns = [
  { key: "title" as const, label: "Title", sortable: true },
  { key: "author" as const, label: "Author" },
  { key: "isbn" as const, label: "ISBN" },
  { key: "category" as const, label: "Category" },
  { key: "copies" as const, label: "Copies" },
  { key: "available" as const, label: "Available" },
  { key: "status" as const, label: "Status", render: (v: string) => <StatusBadge status={v === "Available" ? "active" : v === "Low Stock" ? "pending" : "cancelled"} label={v} /> },
];

export default function LibraryPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ title: "", author: "", isbn: "", category: "Textbook", copies: "" });

  const save = () => {
    if (!form.title.trim() || !form.author.trim()) { toast({ title: "Title and author required", variant: "destructive" }); return; }
    const c = Number(form.copies) || 1;
    setData(prev => [...prev, { id: prev.length + 1, title: form.title, author: form.author, isbn: form.isbn, category: form.category, copies: c, available: c, status: "Available" }]);
    setOpen(false); setForm({ title: "", author: "", isbn: "", category: "Textbook", copies: "" });
    toast({ title: "Book added successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Library" subtitle="Manage books, issues, and returns"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Library" }]}
        actions={<Button onClick={() => setOpen(true)}>+ Add Book</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Books" value="4,520" variant="blue" />
        <KPICard title="Issued" value="342" variant="amber" />
        <KPICard title="Overdue" value="18" variant="red" />
        <KPICard title="New Arrivals" value="24" variant="green" />
      </div>
      <DataTable data={data} columns={columns} searchKey="title" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Book</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Author *</Label><Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">ISBN</Label><Input value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} /></div>
              <div className="space-y-2"><Label className="text-xs">Category</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Textbook">Textbook</SelectItem>
                    <SelectItem value="Reference">Reference</SelectItem>
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="History">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Copies</Label><Input type="number" value={form.copies} onChange={e => setForm({ ...form, copies: e.target.value })} /></div>
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
