import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const modules = ["Dashboard", "Admissions", "Students", "Staff", "Attendance", "Timetable", "Fees & Finance", "Exams", "Transport", "Communication", "Library", "Reports", "Settings"];
const permissions = ["View", "Create", "Edit", "Delete", "Export"];

const roleDefaults: Record<string, Record<string, boolean[]>> = {
  Admin: Object.fromEntries(modules.map(m => [m, [true, true, true, true, true]])),
  Staff: Object.fromEntries(modules.map(m => [m, m === "Dashboard" || m === "Students" || m === "Attendance" || m === "Exams" ? [true, m !== "Dashboard", m !== "Dashboard", false, true] : [false, false, false, false, false]])),
  Student: Object.fromEntries(modules.map(m => [m, ["Dashboard", "Attendance", "Fees & Finance", "Exams", "Timetable"].includes(m) ? [true, false, false, false, false] : [false, false, false, false, false]])),
};

export default function UserRights() {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title="User Rights" subtitle="Manage role-based access and permissions"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }, { label: "User Rights" }]}
        actions={<Button onClick={() => toast.success("Permissions saved!")}>Save Changes</Button>}
      />
      {Object.entries(roleDefaults).map(([role, perms]) => (
        <Card key={role}>
          <CardHeader><CardTitle className="text-base">{role} Permissions</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow>
                <TableHead>Module</TableHead>
                {permissions.map(p => <TableHead key={p} className="text-center">{p}</TableHead>)}
              </TableRow></TableHeader>
              <TableBody>
                {modules.map(mod => (
                  <TableRow key={mod}>
                    <TableCell className="font-medium">{mod}</TableCell>
                    {perms[mod].map((checked, i) => (
                      <TableCell key={i} className="text-center"><Checkbox defaultChecked={checked} /></TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
