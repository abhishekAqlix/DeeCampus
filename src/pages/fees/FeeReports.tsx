import { PageHeader } from "@/components/erp/PageHeader";
import { KPICard } from "@/components/erp/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const monthlyData = [
  { month: "Apr", collected: 850000, pending: 120000 },
  { month: "May", collected: 780000, pending: 150000 },
  { month: "Jun", collected: 920000, pending: 80000 },
  { month: "Jul", collected: 860000, pending: 140000 },
  { month: "Aug", collected: 910000, pending: 90000 },
  { month: "Sep", collected: 880000, pending: 110000 },
  { month: "Oct", collected: 950000, pending: 70000 },
  { month: "Nov", collected: 830000, pending: 160000 },
  { month: "Dec", collected: 900000, pending: 100000 },
  { month: "Jan", collected: 870000, pending: 130000 },
  { month: "Feb", collected: 940000, pending: 85000 },
  { month: "Mar", collected: 960000, pending: 75000 },
];

const pieData = [
  { name: "Tuition", value: 55 }, { name: "Transport", value: 18 },
  { name: "Admission", value: 12 }, { name: "Exam", value: 8 }, { name: "Other", value: 7 },
];
const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function FeeReports() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Fee Reports" subtitle="Financial analytics and reporting"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Fees & Finance" }, { label: "Reports" }]}
        actions={<Button variant="outline"><Download className="h-4 w-4 mr-2" />Export Report</Button>}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Collection" value="₹1.06 Cr" trend={{ value: 8, isPositive: true }} variant="green" />
        <KPICard title="Total Pending" value="₹12.45 L" variant="red" />
        <KPICard title="Collection Rate" value="89.5%" variant="blue" />
        <KPICard title="This Month" value="₹9.60 L" trend={{ value: 3, isPositive: true }} variant="green" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-base">Monthly Collection vs Pending</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" /><YAxis /><Tooltip />
                <Bar dataKey="collected" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                <Bar dataKey="pending" fill="hsl(var(--destructive))" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Collection by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
