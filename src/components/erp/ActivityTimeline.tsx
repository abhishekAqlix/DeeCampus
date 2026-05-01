import { Clock } from "lucide-react";

interface TimelineItem {
  title: string;
  description?: string;
  time: string;
  type?: "info" | "success" | "warning" | "error" | "default";
}

interface ActivityTimelineProps {
  items: TimelineItem[];
}

const dotColors = {
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-destructive",
  default: "bg-muted-foreground",
};

export function ActivityTimeline({ items }: ActivityTimelineProps) {
  return (
    <div className="space-y-0">
      {items.map((item, i) => (
        <div key={i} className="flex gap-3 pb-4 last:pb-0">
          <div className="flex flex-col items-center">
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${dotColors[item.type || "default"]}`} />
            {i < items.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <p className="text-sm font-medium">{item.title}</p>
            {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> {item.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
