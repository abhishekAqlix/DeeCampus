import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  PERMISSION_ACTIONS,
  PERMISSION_MODULES,
  PermissionModule,
  defaultPermissionMatrix,
  emptyPermissionRow,
} from "@/constants/permission-modules";
import {
  getMyRolePermissionRequest,
  listRolePermissionsRequest,
  RolePermissionDto,
  saveRolePermissionsRequest,
} from "@/api/school-api";
import { useRole } from "@/contexts/RoleContext";

type Matrix = Record<string, Record<string, boolean[]>>;

function normalizeModules(doc: RolePermissionDto | undefined): Record<PermissionModule, boolean[]> {
  const base = defaultPermissionMatrix();
  if (!doc?.modules) return base;
  for (const mod of PERMISSION_MODULES) {
    const row = doc.modules[mod];
    base[mod] = Array.isArray(row) && row.length >= 5 ? row.slice(0, 5).map(Boolean) : emptyPermissionRow();
  }
  return base;
}

function toState(items: RolePermissionDto[]): Matrix {
  const m: Matrix = {};
  for (const row of items) {
    const norm = normalizeModules(row);
    m[row.role] = norm as unknown as Record<string, boolean[]>;
  }
  return m;
}

const SEED_ROLES = ["Admin", "Teacher", "Staff", "Student"];

export default function UserRights() {
  const { backendRole } = useRole();
  const queryClient = useQueryClient();
  const isAdmin = backendRole === "Admin";

  const adminQuery = useQuery({
    queryKey: ["role-permissions", "admin"],
    queryFn: async () => (await listRolePermissionsRequest()).items,
    enabled: isAdmin,
  });

  const selfQuery = useQuery({
    queryKey: ["role-permissions", "me"],
    queryFn: async () => (await getMyRolePermissionRequest()).item,
    enabled: !isAdmin,
  });

  const [state, setState] = useState<Matrix>({});

  useEffect(() => {
    if (!isAdmin && selfQuery.data) {
      const item = selfQuery.data;
      setState({
        [item.role]: normalizeModules(item) as unknown as Record<string, boolean[]>,
      });
      return;
    }
    if (isAdmin && adminQuery.data !== undefined) {
      if (adminQuery.data.length === 0) {
        const initial: Matrix = {};
        for (const r of SEED_ROLES) initial[r] = defaultPermissionMatrix() as unknown as Record<string, boolean[]>;
        setState(initial);
      } else {
        setState(toState(adminQuery.data));
      }
    }
  }, [isAdmin, adminQuery.data, selfQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (permissions: Matrix) => saveRolePermissionsRequest(permissions),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["role-permissions"] });
      toast.success("Permissions saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const roles = useMemo(() => Object.keys(state).sort(), [state]);

  const toggle = (role: string, mod: PermissionModule, idx: number, checked: boolean) => {
    setState((prev) => {
      const next: Matrix = { ...prev };
      const rowMap = { ...(next[role] ?? {}) };
      const row = [...((rowMap[mod] as boolean[] | undefined) ?? emptyPermissionRow())];
      row[idx] = checked;
      if (idx === 0 && !checked) {
        for (let i = 1; i < 5; i++) row[i] = false;
      }
      rowMap[mod] = row;
      next[role] = rowMap;
      return next;
    });
  };

  const permissionTable = (role: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Module</TableHead>
          {PERMISSION_ACTIONS.map((p) => (
            <TableHead key={p} className="text-center">
              {p}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {PERMISSION_MODULES.map((mod) => (
          <TableRow key={`${role}-${mod}`}>
            <TableCell className="font-medium">{mod}</TableCell>
            {PERMISSION_ACTIONS.map((_p, i) => (
              <TableCell key={i} className="text-center">
                <Checkbox
                  checked={Boolean(state[role]?.[mod]?.[i])}
                  disabled={!isAdmin}
                  onCheckedChange={(v) => toggle(role, mod, i, v === true)}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const loadingRow = isAdmin ? adminQuery.isLoading : selfQuery.isLoading;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="User Rights"
        subtitle="Role permissions stored alongside your MongoDB deployment"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }, { label: "User Rights" }]}
        actions={
          isAdmin ? (
            <Button onClick={() => saveMutation.mutate(state)} disabled={saveMutation.isPending}>
              Save Changes
            </Button>
          ) : undefined
        }
      />
      {loadingRow && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!isAdmin && !loadingRow && (
        <p className="text-sm text-muted-foreground">Showing effective permissions for your account.</p>
      )}
      {!loadingRow &&
        roles.map((role) => (
          <Card key={role}>
            <CardHeader>
              <CardTitle className="text-base">{role} Permissions</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">{permissionTable(role)}</CardContent>
          </Card>
        ))}
    </div>
  );
}
