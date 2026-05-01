import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Plus, Eye, Edit, Trash2, MoreHorizontal, Receipt, AlertTriangle, TrendingUp, CheckCircle, Printer } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRole } from "@/contexts/RoleContext";
import { useToast } from "@/hooks/use-toast";

const feeRecords = [
  { id: "FEE001", student: "Aarav Sharma", class: "10-A", total: 45000, paid: 45000, due: 0, status: "paid", lastPayment: "2025-03-15", mode: "Online" },
  { id: "FEE002", student: "Ananya Gupta", class: "8-B", total: 38000, paid: 25000, due: 13000, status: "partial", lastPayment: "2025-02-20", mode: "Cash" },
  { id: "FEE003", student: "Priya Singh", class: "9-C", total: 42000, paid: 0, due: 42000, status: "overdue", lastPayment: "—", mode: "—" },
  { id: "FEE004", student: "Rohit Patel", class: "10-A", total: 45000, paid: 45000, due: 0, status: "paid", lastPayment: "2025-03-10", mode: "Cheque" },
  { id: "FEE005", student: "Sneha Reddy", class: "6-B", total: 32000, paid: 32000, due: 0, status: "paid", lastPayment: "2025-01-05", mode: "Online" },
  { id: "FEE006", student: "Karan Verma", class: "7-A", total: 35000, paid: 20000, due: 15000, status: "partial", lastPayment: "2025-02-10", mode: "Cash" },
  { id: "FEE007", student: "Vikash Kumar", class: "9-C", total: 42000, paid: 10000, due: 32000, status: "overdue", lastPayment: "2024-12-01", mode: "Cash" },
  { id: "FEE008", student: "Divya Mishra", class: "5-A", total: 28000, paid: 28000, due: 0, status: "paid", lastPayment: "2025-03-20", mode: "Online" },
  { id: "FEE009", student: "Arjun Nair", class: "10-A", total: 45000, paid: 30000, due: 15000, status: "partial", lastPayment: "2025-01-15", mode: "Online" },
  { id: "FEE010", student: "Meera Joshi", class: "8-B", total: 38000, paid: 38000, due: 0, status: "paid", lastPayment: "2025-03-18", mode: "Cash" },
];

export default function FeeCollection() {
  const navigate = useNavigate();
  const { permissions } = useRole();
  const { toast } = useToast();
  const [collectOpen, setCollectOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState("");

  const columns = [
    {
      key: "student", header: "Student",
      render: (row: typeof feeRecords[0]) => (
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/fees/${row.id}`)}>
          <Avatar className="h-8 w-8"><AvatarFallback className="bg-accent/10 text-accent text-xs font-medium">{row.student.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
          <div>
            <p className="text-sm font-medium hover:text-accent transition-colors">{row.student}</p>
            <p className="text-xs text-muted-foreground">{row.id} · {row.class}</p>
          </div>
        </div>
      ),
    },
    { key: "total", header: "Total Fee", render: (row: typeof feeRecords[0]) => <span className="font-medium">₹{row.total.toLocaleString()}</span> },
    { key: "paid", header: "Paid", render: (row: typeof feeRecords[0]) => <span className="text-success font-medium">₹{row.paid.toLocaleString()}</span> },
    { key: "due", header: "Due", render: (row: typeof feeRecords[0]) => <span className={row.due > 0 ? "text-destructive font-medium" : "text-muted-foreground"}>₹{row.due.toLocaleString()}</span> },
    { key: "status", header: "Status", render: (row: typeof feeRecords[0]) => <StatusBadge status={row.status as any} /> },
    { key: "lastPayment", header: "Last Payment" },
    { key: "mode", header: "Mode" },
    {
      key: "actions", header: "",
      render: (row: typeof feeRecords[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate(`/fees/${row.id}`)}><Eye className="h-3.5 w-3.5" />View Ledger</DropdownMenuItem>
            {permissions.canAccessFinance && row.due > 0 && <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => setCollectOpen(true)}><Receipt className="h-3.5 w-3.5" />Collect Fee</DropdownMenuItem>}
            <DropdownMenuItem className="gap-2 cursor-pointer"><Printer className="h-3.5 w-3.5" />Print Receipt</DropdownMenuItem>
            {permissions.canDelete && (<><DropdownMenuSeparator /><DropdownMenuItem className="gap-2 cursor-pointer text-destructive" onClick={() => { setSelectedFee(row.student); setCancelOpen(true); }}><Trash2 className="h-3.5 w-3.5" />Cancel</DropdownMenuItem></>)}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Fee Collection"
        subtitle="Manage fee payments, track dues, and generate receipts"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Fees & Finance" }, { label: "Fee Collection" }]}
        actions={
          permissions.canAccessFinance ? (
            <Button className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5" onClick={() => setCollectOpen(true)}>
              <Plus className="h-4 w-4" /> Collect Fee
            </Button>
          ) : undefined
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Collection" value="₹18.2L" change="12%" changeType="up" icon={TrendingUp} variant="navy" />
        <KPICard title="Today's Collection" value="₹1,45,200" subtitle="23 receipts" icon={Receipt} variant="orange" />
        <KPICard title="Pending Dues" value="₹4.8L" change="3.1%" changeType="down" icon={AlertTriangle} variant="warning" />
        <KPICard title="Fully Paid" value="847" subtitle="68% students" icon={CheckCircle} variant="success" />
      </div>
      <DataTable columns={columns} data={feeRecords} searchPlaceholder="Search by student, ID, class..." />

      {/* Collect Fee Modal */}
      <Dialog open={collectOpen} onOpenChange={setCollectOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Collect Fee Payment</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label className="text-xs">Student *</Label><Input placeholder="Search student..." /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="text-xs">Amount *</Label><Input type="number" placeholder="₹ Amount" /></div>
              <div className="space-y-2"><Label className="text-xs">Payment Mode *</Label>
                <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="online">Online</SelectItem><SelectItem value="cheque">Cheque</SelectItem><SelectItem value="dd">DD</SelectItem></SelectContent></Select>
              </div>
            </div>
            <div className="space-y-2"><Label className="text-xs">Fee Type</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="tuition">Tuition Fee</SelectItem><SelectItem value="transport">Transport Fee</SelectItem><SelectItem value="exam">Exam Fee</SelectItem><SelectItem value="hostel">Hostel Fee</SelectItem></SelectContent></Select>
            </div>
            <div className="space-y-2"><Label className="text-xs">Remarks</Label><Input placeholder="Optional remarks" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCollectOpen(false)}>Cancel</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-orange-dark" onClick={() => { setCollectOpen(false); toast({ title: "Payment Collected", description: "Fee receipt has been generated." }); }}>Collect & Generate Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={cancelOpen} onOpenChange={setCancelOpen} title="Cancel Fee Record" description={`Cancel the fee record for ${selectedFee}? This will reverse the payment.`} confirmLabel="Cancel Record" variant="warning" onConfirm={() => toast({ title: "Record Cancelled" })} />
    </div>
  );
}
