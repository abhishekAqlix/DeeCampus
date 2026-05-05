import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { listAuditLogsRequest } from "@/api/school-api";

const columns = [
  { key: "timestamp" as const, label: "Timestamp", sortable: true },
  { key: "user" as const, label: "User" },
  {
    key: "action" as const,
    label: "Action",
    render: (v: string) => (
      <StatusBadge
        status={v === "Created" ? "active" : v === "Updated" ? "pending" : "cancelled"}
        label={v}
      />
    ),
  },
  { key: "module" as const, label: "Module" },
  { key: "description" as const, label: "Description" },
  { key: "ip" as const, label: "IP Address" },
];

export default function AuditLogs() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: async () => (await listAuditLogsRequest({ limit: 500 })).logs,
  });

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Audit Logs"
        subtitle="Track all system activity and changes"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }, { label: "Audit Logs" }]}
        actions={
          <Button variant="outline" type="button">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        }
      />
      {isLoading && <p className="text-sm text-muted-foreground">Loading logs…</p>}
      {isError && <p className="text-sm text-destructive">{(error as Error).message}</p>}
      {!isLoading && !isError && data && <DataTable data={data} columns={columns} searchKey="description" />}
    </div>
  );
}
