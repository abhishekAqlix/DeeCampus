import { cn } from "@/lib/utils";

export type StatusType =
  | "active" | "inactive" | "pending" | "approved" | "draft"
  | "paid" | "partial" | "overdue" | "cancelled"
  | "present" | "absent" | "late"
  | "converted" | "dropped" | "new" | "follow-up";

const statusStyles: Record<StatusType, string> = {
  active: "bg-success/10 text-success border-success/20",
  inactive: "bg-muted text-muted-foreground border-muted",
  pending: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-success/10 text-success border-success/20",
  draft: "bg-muted text-muted-foreground border-muted",
  paid: "bg-success/10 text-success border-success/20",
  partial: "bg-orange/10 text-orange border-orange/20",
  overdue: "bg-destructive/10 text-destructive border-destructive/20",
  cancelled: "bg-muted text-muted-foreground border-muted",
  present: "bg-success/10 text-success border-success/20",
  absent: "bg-destructive/10 text-destructive border-destructive/20",
  late: "bg-warning/10 text-warning border-warning/20",
  converted: "bg-info/10 text-info border-info/20",
  dropped: "bg-destructive/10 text-destructive border-destructive/20",
  new: "bg-info/10 text-info border-info/20",
  "follow-up": "bg-orange/10 text-orange border-orange/20",
};

const statusLabels: Record<StatusType, string> = {
  active: "Active", inactive: "Inactive", pending: "Pending", approved: "Approved",
  draft: "Draft", paid: "Paid", partial: "Partially Paid", overdue: "Overdue",
  cancelled: "Cancelled", present: "Present", absent: "Absent", late: "Late",
  converted: "Converted", dropped: "Dropped", new: "New", "follow-up": "Follow Up",
};

export function StatusBadge({ status, label, className }: { status: StatusType; label?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", statusStyles[status], className)}>
      <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", {
        "bg-success": ["active", "approved", "paid", "present"].includes(status),
        "bg-warning": ["pending", "late"].includes(status),
        "bg-destructive": ["overdue", "absent", "dropped", "cancelled"].includes(status),
        "bg-orange": ["partial", "follow-up"].includes(status),
        "bg-info": ["converted", "new"].includes(status),
        "bg-muted-foreground": ["inactive", "draft"].includes(status),
      })} />
      {label || statusLabels[status]}
    </span>
  );
}
