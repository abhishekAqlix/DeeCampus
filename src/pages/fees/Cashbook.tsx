import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { KPICard } from "@/components/erp/KPICard";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const entries = [
  { date: "03 Apr 2026", voucherNo: "V-2026-0412", particular: "Fee Collection - Class 10", receipt: "₹45,000", payment: "", balance: "₹2,85,000", mode: "Cash" },
  { date: "03 Apr 2026", voucherNo: "V-2026-0411", particular: "Stationery Purchase", receipt: "", payment: "₹5,200", balance: "₹2,40,000", mode: "Cash" },
  { date: "02 Apr 2026", voucherNo: "V-2026-0410", particular: "Fee Collection - Class 8", receipt: "₹32,000", payment: "", balance: "₹2,45,200", mode: "Online" },
  { date: "02 Apr 2026", voucherNo: "V-2026-0409", particular: "Electricity Bill", receipt: "", payment: "₹78,000", balance: "₹2,13,200", mode: "Bank Transfer" },
  { date: "01 Apr 2026", voucherNo: "V-2026-0408", particular: "Opening Balance", receipt: "₹2,91,200", payment: "", balance: "₹2,91,200", mode: "—" },
  { date: "01 Apr 2026", voucherNo: "V-2026-0407", particular: "Fee Collection - Walk-in", receipt: "₹15,000", payment: "", balance: "₹3,06,200", mode: "Cash" },
];

export default function Cashbook() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Cashbook" subtitle="Daily cash receipts and payments register"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Fees & Finance" }, { label: "Cashbook" }]}
        actions={<Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Opening Balance" value="₹2,91,200" variant="blue" />
        <KPICard title="Total Receipts" value="₹92,000" variant="green" />
        <KPICard title="Total Payments" value="₹83,200" variant="red" />
        <KPICard title="Closing Balance" value="₹3,00,000" variant="green" />
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">Today's Transactions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Date</TableHead><TableHead>Voucher No</TableHead><TableHead>Particular</TableHead>
              <TableHead>Receipt</TableHead><TableHead>Payment</TableHead><TableHead>Balance</TableHead><TableHead>Mode</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {entries.map((e, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs">{e.date}</TableCell><TableCell className="text-xs">{e.voucherNo}</TableCell>
                  <TableCell>{e.particular}</TableCell>
                  <TableCell className="text-green-600 font-medium">{e.receipt}</TableCell>
                  <TableCell className="text-red-600 font-medium">{e.payment}</TableCell>
                  <TableCell className="font-medium">{e.balance}</TableCell>
                  <TableCell className="text-xs">{e.mode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
