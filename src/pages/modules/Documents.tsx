import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/erp/FileUpload";
import { useToast } from "@/hooks/use-toast";

const seed = [
  { id: 1, name: "School Registration Certificate", category: "Legal", uploadedBy: "Admin", uploadDate: "15 Jan 2026", size: "2.4 MB", type: "PDF" },
  { id: 2, name: "CBSE Affiliation Letter", category: "Legal", uploadedBy: "Admin", uploadDate: "15 Jan 2026", size: "1.8 MB", type: "PDF" },
  { id: 3, name: "Staff Policy Manual", category: "HR", uploadedBy: "HR Team", uploadDate: "10 Feb 2026", size: "5.2 MB", type: "PDF" },
  { id: 4, name: "Fee Structure 2026-27", category: "Finance", uploadedBy: "Accounts", uploadDate: "01 Mar 2026", size: "0.8 MB", type: "Excel" },
  { id: 5, name: "Annual Calendar", category: "Academic", uploadedBy: "Admin", uploadDate: "20 Mar 2026", size: "1.2 MB", type: "PDF" },
  { id: 6, name: "Safety Compliance Report", category: "Legal", uploadedBy: "Admin", uploadDate: "25 Mar 2026", size: "3.5 MB", type: "PDF" },
];

const columns = [
  { key: "name" as const, label: "Document Name", sortable: true },
  { key: "category" as const, label: "Category" },
  { key: "uploadedBy" as const, label: "Uploaded By" },
  { key: "uploadDate" as const, label: "Date" },
  { key: "size" as const, label: "Size" },
  { key: "type" as const, label: "Type" },
];

export default function DocumentsPage() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(seed);
  const [form, setForm] = useState({ name: "", category: "Legal" });

  const save = () => {
    if (!form.name.trim()) { toast({ title: "Document name required", variant: "destructive" }); return; }
    const today = new Date();
    const formatted = `${String(today.getDate()).padStart(2, "0")} ${today.toLocaleString("en", { month: "short" })} ${today.getFullYear()}`;
    setData(prev => [{ id: prev.length + 1, name: form.name, category: form.category, uploadedBy: "Admin", uploadDate: formatted, size: "1.0 MB", type: "PDF" }, ...prev]);
    setOpen(false); setForm({ name: "", category: "Legal" });
    toast({ title: "Document uploaded successfully" });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Documents" subtitle="Central document management system"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Documents" }]}
        actions={<Button onClick={() => setOpen(true)}><FileUp className="h-4 w-4 mr-2" />Upload Document</Button>}
      />
      <DataTable data={data} columns={columns} searchKey="name" />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Upload Document</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Document Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label className="text-xs">Category</Label>
              <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Legal">Legal</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FileUpload label="File" maxFiles={1} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
