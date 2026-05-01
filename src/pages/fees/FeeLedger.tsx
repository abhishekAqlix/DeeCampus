import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { KPICard } from "@/components/erp/KPICard";
import { useParams } from "react-router-dom";

const transactions = [
  { date: "10 Apr 2026", particular: "Tuition Fee - April", debit: "₹4,500", credit: "", balance: "₹4,500", mode: "—", status: "Pending" },
  { date: "05 Apr 2026", particular: "Transport Fee - April", debit: "₹3,000", credit: "", balance: "₹7,500", mode: "—", status: "Pending" },
  { date: "15 Mar 2026", particular: "Payment Received", debit: "", credit: "₹7,500", balance: "₹0", mode: "Online", status: "Paid" },
  { date: "01 Mar 2026", particular: "Tuition Fee - March", debit: "₹4,500", credit: "", balance: "₹4,500", mode: "—", status: "Paid" },
  { date: "01 Mar 2026", particular: "Transport Fee - March", debit: "₹3,000", credit: "", balance: "₹7,500", mode: "—", status: "Paid" },
  { date: "01 Feb 2026", particular: "Exam Fee - Term 2", debit: "₹2,000", credit: "", balance: "₹2,000", mode: "—", status: "Paid" },
  { date: "10 Feb 2026", particular: "Payment Received", debit: "", credit: "₹9,500", balance: "₹0", mode: "Cash", status: "Paid" },
];

export default function FeeLedger() {
  const { id } = useParams();
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Fee Ledger" subtitle={`Student fee ledger — ID: ${id || "STU001"}`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Fees & Finance" }, { label: "Ledger" }]}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Fees" value="₹90,000" variant="blue" />
        <KPICard title="Paid" value="₹52,500" variant="green" />
        <KPICard title="Pending" value="₹7,500" variant="amber" />
        <KPICard title="Discount" value="₹5,000" variant="default" />
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Transaction History</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Date</TableHead><TableHead>Particular</TableHead><TableHead>Debit</TableHead><TableHead>Credit</TableHead><TableHead>Balance</TableHead><TableHead>Mode</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {transactions.map((t, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs">{t.date}</TableCell><TableCell>{t.particular}</TableCell>
                  <TableCell className="text-red-600">{t.debit}</TableCell><TableCell className="text-green-600">{t.credit}</TableCell>
                  <TableCell className="font-medium">{t.balance}</TableCell><TableCell>{t.mode}</TableCell>
                  <TableCell><StatusBadge status={t.status === "Paid" ? "paid" : "pending"} label={t.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
