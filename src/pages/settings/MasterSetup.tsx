import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const seed: Record<string, string[]> = {
  "Fee Types": ["Tuition Fee", "Admission Fee", "Exam Fee", "Transport Fee", "Lab Fee", "Library Fee", "Sports Fee", "Activity Fee"],
  "Departments": ["Mathematics", "English", "Science", "Hindi", "Social Science", "Computer Science", "Physical Education", "Art & Craft"],
  "Designations": ["Principal", "Vice Principal", "Senior Teacher", "Teacher", "Lab Assistant", "Librarian", "Clerk", "Peon"],
  "Categories": ["General", "OBC", "SC", "ST", "EWS", "NRI", "Foreign National"],
  "Document Types": ["Birth Certificate", "Aadhar Card", "Transfer Certificate", "Report Card", "Passport", "Medical Certificate", "Income Certificate"],
  "Payment Modes": ["Cash", "Cheque", "Bank Transfer", "UPI", "Online", "DD", "Credit Card", "Debit Card"],
  "Holiday Types": ["National Holiday", "Festival", "School Event", "Weather", "Emergency", "Vacation", "Staff Training"],
};

export default function MasterSetup() {
  const [tab, setTab] = useState("Fee Types");
  const [data, setData] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    Object.entries(seed).forEach(([k, v]) => { init[k] = [...v]; });
    return init;
  });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const singular = (k: string) => k.endsWith("s") ? k.slice(0, -1) : k;

  const handleSave = () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    setData(prev => ({ ...prev, [tab]: [...(prev[tab] || []), name.trim()] }));
    toast.success(`${singular(tab)} added successfully`);
    setName("");
    setOpen(false);
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Master Setup" subtitle="Configure system masters and lookups"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }, { label: "Masters" }]}
      />
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap h-auto gap-1">
          {Object.keys(data).map(k => <TabsTrigger key={k} value={k} className="text-xs">{k}</TabsTrigger>)}
        </TabsList>
        {Object.entries(data).map(([key, items]) => (
          <TabsContent key={key} value={key}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{key}</CardTitle>
                <Button size="sm" onClick={() => { setName(""); setOpen(true); }}><Plus className="h-4 w-4 mr-1" />Add</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>#</TableHead><TableHead>Name</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell className="font-medium">{item}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add {singular(tab)}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">{singular(tab)} Name *</Label>
              <Input autoFocus placeholder={`Enter ${singular(tab).toLowerCase()} name`} value={name} onChange={e => setName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSave(); }} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
