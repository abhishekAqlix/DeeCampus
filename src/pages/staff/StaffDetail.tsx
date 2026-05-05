import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/erp/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRole } from "@/contexts/RoleContext";
import { ArrowLeft } from "lucide-react";
import { getStaffRequest } from "@/api/school-api";

const oid = (s: string | undefined) => !!s && /^[a-f\d]{24}$/i.test(String(s));

export default function StaffDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { permissions } = useRole();

  const valid = oid(id);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["staff", id],
    enabled: valid,
    queryFn: async () => (await getStaffRequest(id!)).item,
  });

  if (!valid) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Invalid staff link.</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/staff")}>
          Back
        </Button>
      </div>
    );
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (isError || !data) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">{(error as Error)?.message ?? "Staff not found."}</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/staff")}>
          Back
        </Button>
      </div>
    );
  }

  const s = data;

  return (
    <div className="space-y-6 max-w-[1000px]">
      <PageHeader
        title={s.fullName}
        subtitle={`${s.employeeCode} · ${s.designation} · ${s.department}`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Staff", href: "/staff" }, { label: s.fullName }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/staff")} className="gap-1">
              <ArrowLeft className="h-3.5 w-3.5" /> All staff
            </Button>
            {permissions.canEdit && (
              <Button size="sm" onClick={() => navigate(`/staff/${s.id}/edit`)}>
                Edit
              </Button>
            )}
          </div>
        }
      />
      <Card>
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="font-medium">{s.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="font-medium">{s.phone}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Join date</p>
            <p className="font-medium">{s.joinDate || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="font-medium">{s.status}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-muted-foreground">Address</p>
            <p className="font-medium">{s.address || "—"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
