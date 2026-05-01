import { LucideIcon, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  variant?: "default" | "orange" | "navy" | "success" | "warning" | "info" | "blue" | "green" | "red" | "amber";
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
}

const variantMap: Record<string, string> = {
  blue: "info", green: "success", red: "warning", amber: "warning",
};

const coreVariantStyles: Record<string, string> = {
  default: "bg-card border",
  orange: "bg-gradient-to-br from-orange to-orange-dark text-accent-foreground border-0",
  navy: "bg-gradient-to-br from-navy to-navy-dark text-primary-foreground border-0",
  success: "bg-card border border-success/20",
  warning: "bg-card border border-warning/20",
  info: "bg-card border border-info/20",
};

const coreIconStyles: Record<string, string> = {
  default: "bg-secondary text-muted-foreground",
  orange: "bg-orange-light/30 text-accent-foreground",
  navy: "bg-navy-light/30 text-primary-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

export function KPICard({ title, value, change, changeType = "neutral", icon: Icon, variant = "default", subtitle, trend }: KPICardProps) {
  const resolvedVariant = variantMap[variant] || variant;
  const variantStyle = coreVariantStyles[resolvedVariant] || coreVariantStyles.default;
  const iconStyle = coreIconStyles[resolvedVariant] || coreIconStyles.default;
  const IconComp = Icon || Activity;

  const effectiveChange = change || (trend ? `${trend.value}%` : undefined);
  const effectiveChangeType = change ? changeType : trend ? (trend.isPositive ? "up" : "down") : changeType;

  return (
    <div className={cn("rounded-lg p-5 animate-fade-in shadow-sm", variantStyle)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className={cn("text-xs font-medium uppercase tracking-wider", resolvedVariant === "orange" || resolvedVariant === "navy" ? "opacity-80" : "text-muted-foreground")}>{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className={cn("text-xs", resolvedVariant === "orange" || resolvedVariant === "navy" ? "opacity-70" : "text-muted-foreground")}>{subtitle}</p>}
        </div>
        <div className={cn("p-2.5 rounded-lg", iconStyle)}>
          <IconComp className="h-5 w-5" />
        </div>
      </div>
      {effectiveChange && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className={cn("text-xs font-semibold",
            effectiveChangeType === "up" && (resolvedVariant === "orange" || resolvedVariant === "navy" ? "text-green-300" : "text-success"),
            effectiveChangeType === "down" && (resolvedVariant === "orange" || resolvedVariant === "navy" ? "text-red-300" : "text-destructive"),
            effectiveChangeType === "neutral" && (resolvedVariant === "orange" || resolvedVariant === "navy" ? "opacity-70" : "text-muted-foreground"),
          )}>
            {effectiveChangeType === "up" ? "↑" : effectiveChangeType === "down" ? "↓" : "→"} {effectiveChange}
          </span>
          <span className={cn("text-xs", resolvedVariant === "orange" || resolvedVariant === "navy" ? "opacity-60" : "text-muted-foreground")}>vs last month</span>
        </div>
      )}
    </div>
  );
}
