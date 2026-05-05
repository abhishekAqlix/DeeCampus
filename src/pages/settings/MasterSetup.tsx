import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { createMasterRequest, deleteMasterRequest, listMastersRequest, MasterType } from "@/api/school-api";

const TABS: MasterType[] = [
  "Fee Types",
  "Classes",
  "Departments",
  "Designations",
  "Roles",
  "Document Types",
  "Payment Modes",
  "Holiday Types",
  "Academic Years",
];

export default function MasterSetup() {
  const [tab, setTab] = useState<MasterType>("Fee Types");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["masters"],
    queryFn: () => listMastersRequest(),
  });

  const itemsByType = data?.masters ?? {};

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const createMutation = useMutation({
    mutationFn: (params: { type: MasterType; name: string }) => createMasterRequest(params.type, params.name),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["masters"] });
      toast.success("Saved");
      setName("");
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (params: { type: MasterType; id: string }) => deleteMasterRequest(params.type, params.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["masters"] });
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const singular = (k: string) => (k.endsWith("s") ? k.slice(0, -1) : k);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    void createMutation.mutateAsync({ type: tab, name: name.trim() });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Master Setup"
        subtitle="Configure system masters and lookups"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }, { label: "Masters" }]}
      />
      {isLoading && <p className="text-sm text-muted-foreground">Loading masters…</p>}
      {!isLoading && (
        <Tabs value={tab} onValueChange={(v) => setTab(v as MasterType)}>
          <TabsList className="flex-wrap h-auto gap-1">
            {TABS.map((k) => (
              <TabsTrigger key={k} value={k} className="text-xs">
                {k}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((key) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">{key}</CardTitle>
                  <Button size="sm" onClick={() => { setName(""); setOpen(true); }}>
                    <Plus className="h-4 w-4 mr-1" />Add
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(itemsByType[key] ?? []).map((item, i) => (
                        <TableRow key={item.id}>
                          <TableCell>{i + 1}</TableCell>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => {
                                if (!confirm(`Delete "${item.name}"?`)) return;
                                void deleteMutation.mutateAsync({ type: key, id: item.id });
                              }}
                              type="button"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
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
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {singular(tab)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">{singular(tab)} Name *</Label>
              <Input
                autoFocus
                placeholder={`Enter ${singular(tab).toLowerCase()} name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={createMutation.isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
