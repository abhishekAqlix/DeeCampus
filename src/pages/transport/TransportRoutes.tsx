import { useState } from "react";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { KPICard } from "@/components/erp/KPICard";
import { ConfirmDialog } from "@/components/erp/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Edit, Trash2, MoreHorizontal, Bus, MapPin, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";

const routes = [
  { id: "RT001", name: "Route 1 - North", stops: 8, students: 32, driver: "Ram Singh", vehicle: "KA-01-1234", status: "active" },
  { id: "RT002", name: "Route 2 - South", stops: 6, students: 28, driver: "Suresh Kumar", vehicle: "KA-01-5678", status: "active" },
  { id: "RT003", name: "Route 3 - East", stops: 10, students: 35, driver: "Mahesh Yadav", vehicle: "KA-01-9012", status: "active" },
  { id: "RT004", name: "Route 4 - West", stops: 7, students: 25, driver: "Dinesh Sharma", vehicle: "KA-01-3456", status: "active" },
  { id: "RT005", name: "Route 5 - Central", stops: 5, students: 20, driver: "Kailash Nath", vehicle: "KA-01-7890", status: "inactive" },
];

type TransportRoute = typeof routes[number];

const vehicles = ["KA-01-1234", "KA-01-5678", "KA-01-9012", "KA-01-3456", "KA-01-7890"];
const drivers = ["Ram Singh", "Suresh Kumar", "Mahesh Yadav", "Dinesh Sharma", "Kailash Nath"];

export default function TransportRoutes() {
  const { permissions } = useRole();
  const { toast } = useToast();
  const [data, setData] = useState<TransportRoute[]>(routes);
  const [form, setForm] = useState({ name: "", vehicle: "", driver: "", stops: "" });
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingName, setDeletingName] = useState("");

  const saveRoute = () => {
    if (!form.name.trim() || !form.vehicle || !form.driver) {
      toast({ title: "Required fields missing", description: "Please enter route name, vehicle and driver.", variant: "destructive" });
      return;
    }

    const nextId = `RT${String(data.length + 1).padStart(3, "0")}`;
    setData(prev => [
      ...prev,
      {
        id: nextId,
        name: form.name.trim(),
        stops: Number(form.stops) || 0,
        students: 0,
        driver: form.driver,
        vehicle: form.vehicle,
        status: "active",
      },
    ]);
    setForm({ name: "", vehicle: "", driver: "", stops: "" });
    setCreateOpen(false);
    toast({ title: "Route Created" });
  };

  const columns = [
    {
      key: "name", header: "Route",
      render: (row: TransportRoute) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center"><Bus className="h-4 w-4 text-accent" /></div>
          <div><p className="text-sm font-medium">{row.name}</p><p className="text-xs text-muted-foreground">{row.id}</p></div>
        </div>
      ),
    },
    { key: "stops", header: "Stops" },
    { key: "students", header: "Students" },
    { key: "driver", header: "Driver" },
    { key: "vehicle", header: "Vehicle" },
    { key: "status", header: "Status", render: (row: TransportRoute) => <StatusBadge status={row.status as any} /> },
    {
      key: "actions", header: "",
      render: (row: TransportRoute) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="gap-2 cursor-pointer"><Eye className="h-3.5 w-3.5" />View</DropdownMenuItem>
            {permissions.canEdit && <DropdownMenuItem className="gap-2 cursor-pointer"><Edit className="h-3.5 w-3.5" />Edit</DropdownMenuItem>}
            {permissions.canDelete && (<><DropdownMenuSeparator /><DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => { setDeletingName(row.name); setDeleteOpen(true); }}><Trash2 className="h-3.5 w-3.5" />Delete</DropdownMenuItem></>)}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Transport Routes"
        subtitle="Manage bus routes, stops, and student assignments"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Transport" }, { label: "Routes" }]}
        actions={permissions.canManageTransport ? <Button className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5" onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Add Route</Button> : undefined}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total Routes" value={String(data.length)} icon={MapPin} variant="info" />
        <KPICard title="Students on Transport" value="328" icon={Users} />
        <KPICard title="Active Vehicles" value="12" icon={Bus} variant="success" />
      </div>
      <DataTable columns={columns} data={data} searchPlaceholder="Search routes..." />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Add Route</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Route Name *</Label><Input placeholder="e.g., Route 6 - Northwest" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Vehicle *</Label>
                <Select value={form.vehicle} onValueChange={v => setForm({ ...form, vehicle: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{vehicles.map(vehicle => <SelectItem key={vehicle} value={vehicle}>{vehicle}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-2"><Label className="text-xs">Driver *</Label>
                <Select value={form.driver} onValueChange={v => setForm({ ...form, driver: v })}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{drivers.map(driver => <SelectItem key={driver} value={driver}>{driver}</SelectItem>)}</SelectContent></Select>
              </div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Number of Stops</Label><Input type="number" placeholder="Number of stops" value={form.stops} onChange={e => setForm({ ...form, stops: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-orange-dark" onClick={saveRoute}>Add Route</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} title="Delete Route" description={`Delete ${deletingName}? Assigned students will be unlinked.`} confirmLabel="Delete" onConfirm={() => toast({ title: "Route Deleted" })} />
    </div>
  );
}
