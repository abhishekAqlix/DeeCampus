import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const integrations = [
  { name: "WhatsApp Business API", description: "Send automated messages, fee reminders, and announcements", status: "Connected", icon: "💬" },
  { name: "Payment Gateway (Razorpay)", description: "Accept online fee payments from parents", status: "Connected", icon: "💳" },
  { name: "SMS Gateway", description: "Send SMS notifications for attendance and alerts", status: "Connected", icon: "📱" },
  { name: "Google Workspace", description: "Sync with Google Classroom and Calendar", status: "Disconnected", icon: "🔗" },
  { name: "Email (SMTP)", description: "Send email notifications and reports", status: "Connected", icon: "📧" },
  { name: "Biometric Attendance", description: "Sync biometric device data for staff attendance", status: "Connected", icon: "👆" },
  { name: "GPS Tracking (Transport)", description: "Real-time vehicle tracking integration", status: "Disconnected", icon: "📍" },
  { name: "Tally / Accounting Software", description: "Export financial data to accounting software", status: "Disconnected", icon: "📊" },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="Integrations" subtitle="Manage third-party service integrations"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }, { label: "Integrations" }]}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((intg, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-xl">{intg.icon}</div>
                <div>
                  <div className="font-medium text-sm">{intg.name}</div>
                  <div className="text-xs text-muted-foreground">{intg.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={intg.status === "Connected" ? "active" : "inactive"} label={intg.status} />
                <Switch defaultChecked={intg.status === "Connected"} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
