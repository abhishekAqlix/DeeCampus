import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { KPICard } from "@/components/erp/KPICard";
import { MapPin, Bus } from "lucide-react";

const buses = [
  { id: 1, vehicle: "DL-01-AB-1234", route: "Route 1 - Dwarka", driver: "Ramesh Kumar", status: "On Route", speed: "35 km/h", lastUpdate: "2 min ago", students: 38 },
  { id: 2, vehicle: "DL-01-CD-5678", route: "Route 2 - Janakpuri", driver: "Suresh Singh", status: "On Route", speed: "28 km/h", lastUpdate: "1 min ago", students: 42 },
  { id: 3, vehicle: "DL-01-EF-9012", route: "Route 3 - Rohini", driver: "Mahesh Yadav", status: "At School", speed: "0 km/h", lastUpdate: "5 min ago", students: 0 },
  { id: 4, vehicle: "DL-01-GH-3456", route: "Route 5 - Pitampura", driver: "Dinesh Sharma", status: "On Route", speed: "42 km/h", lastUpdate: "30 sec ago", students: 10 },
  { id: 5, vehicle: "DL-01-KL-1111", route: "Route 4 - Punjabi Bagh", driver: "Rakesh Verma", status: "Completed", speed: "0 km/h", lastUpdate: "20 min ago", students: 0 },
];

export default function LiveTracking() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Live Tracking" subtitle="Real-time vehicle tracking and monitoring"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Transport" }, { label: "Live Tracking" }]}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Active Vehicles" value="3" variant="green" />
        <KPICard title="At School" value="1" variant="blue" />
        <KPICard title="Completed" value="1" variant="default" />
        <KPICard title="Students in Transit" value="90" variant="amber" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-base">Map View</CardTitle></CardHeader>
          <CardContent>
            <div className="bg-muted rounded-lg h-[300px] flex items-center justify-center text-muted-foreground">
              <div className="text-center"><MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" /><p>Map integration placeholder</p><p className="text-xs">Connect Google Maps API for live tracking</p></div>
            </div>
          </CardContent>
        </Card>
        {buses.map(b => (
          <Card key={b.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Bus className="h-5 w-5 text-primary" /></div>
                  <div>
                    <div className="font-semibold text-sm">{b.vehicle}</div>
                    <div className="text-xs text-muted-foreground">{b.route}</div>
                  </div>
                </div>
                <StatusBadge status={b.status === "On Route" ? "active" : b.status === "At School" ? "pending" : "inactive"} label={b.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div><span className="text-muted-foreground">Driver:</span><br />{b.driver}</div>
                <div><span className="text-muted-foreground">Speed:</span><br />{b.speed}</div>
                <div><span className="text-muted-foreground">Students:</span><br />{b.students}</div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">Last update: {b.lastUpdate}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
