import { useRole, UserRole } from "@/contexts/RoleContext";
import { Shield, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const roleConfig: Record<UserRole, { label: string; icon: any; color: string }> = {
  admin: { label: "Admin", icon: Shield, color: "bg-accent text-accent-foreground" },
  staff: { label: "Staff", icon: Users, color: "bg-info text-info-foreground" },
  // student: { label: "Student", icon: GraduationCap, color: "bg-success text-success-foreground" },
};

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
      {(Object.keys(roleConfig) as UserRole[]).map((r) => {
        const config = roleConfig[r];
        const Icon = config.icon;
        const active = role === r;
        return (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
              active ? config.color : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {config.label}
          </button>
        );
      })}
    </div>
  );
}
