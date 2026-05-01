import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/erp/PageHeader";
import { KPICard } from "@/components/erp/KPICard";
import { Button } from "@/components/ui/button";
import { GripVertical, BookOpen, Calendar, Tag } from "lucide-react";

type EnquiryItem = {
  id: string;
  name: string;
  class: string;
  date: string;
  source: string;
};

type Stage = {
  name: string;
  headerColor: string;
  columnBg: string;
  badgeVariant: string;
  items: EnquiryItem[];
};

const initialStages: Stage[] = [
  {
    name: "New",
    headerColor: "border-t-blue-400",
    columnBg: "bg-blue-50/50",
    badgeVariant: "bg-blue-100 text-blue-700",
    items: [
      { id: "1", name: "Aarav Mehta", class: "Class 5", date: "28 Mar 2026", source: "Walk-in" },
      { id: "2", name: "Priya Singh", class: "Class 3", date: "27 Mar 2026", source: "Website" },
      { id: "3", name: "Rohan Gupta", class: "Class 8", date: "26 Mar 2026", source: "Referral" },
    ],
  },
  {
    name: "Follow-up",
    headerColor: "border-t-amber-400",
    columnBg: "bg-amber-50/50",
    badgeVariant: "bg-amber-100 text-amber-700",
    items: [
      { id: "4", name: "Sneha Joshi", class: "Class 6", date: "25 Mar 2026", source: "Social Media" },
      { id: "5", name: "Karan Patel", class: "Class 2", date: "24 Mar 2026", source: "Walk-in" },
    ],
  },
  {
    name: "Pending",
    headerColor: "border-t-orange-400",
    columnBg: "bg-orange-50/50",
    badgeVariant: "bg-orange-100 text-orange-700",
    items: [
      { id: "6", name: "Anika Sharma", class: "Class 1", date: "22 Mar 2026", source: "Newspaper" },
      { id: "7", name: "Vivek Kumar", class: "Class 9", date: "20 Mar 2026", source: "Referral" },
    ],
  },
  {
    name: "Converted",
    headerColor: "border-t-green-400",
    columnBg: "bg-green-50/50",
    badgeVariant: "bg-green-100 text-green-700",
    items: [
      { id: "8", name: "Diya Reddy", class: "Class 4", date: "18 Mar 2026", source: "Website" },
    ],
  },
  {
    name: "Dropped",
    headerColor: "border-t-red-400",
    columnBg: "bg-red-50/50",
    badgeVariant: "bg-red-100 text-red-700",
    items: [
      { id: "9", name: "Amit Verma", class: "Class 7", date: "15 Mar 2026", source: "Walk-in" },
    ],
  },
];

export default function AdmissionPipeline() {
  const navigate = useNavigate();
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [dragging, setDragging] = useState<{ stageIdx: number; itemId: string } | null>(null);
  const [dragOverStage, setDragOverStage] = useState<number | null>(null);

  const totalEnquiries = stages.reduce((sum, s) => sum + s.items.length, 0);
  const convertedCount = stages.find(s => s.name === "Converted")?.items.length ?? 0;
  const conversionRate = totalEnquiries > 0 ? Math.round((convertedCount / totalEnquiries) * 100) : 0;

  const handleDragStart = (e: React.DragEvent, stageIdx: number, itemId: string) => {
    e.dataTransfer.effectAllowed = "move";
    setDragging({ stageIdx, itemId });
  };

  const handleDragOver = (e: React.DragEvent, stageIdx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stageIdx);
  };

  const handleDrop = (e: React.DragEvent, targetStageIdx: number) => {
    e.preventDefault();
    if (!dragging || dragging.stageIdx === targetStageIdx) {
      setDragging(null);
      setDragOverStage(null);
      return;
    }

    setStages(prev => {
      const next = prev.map(s => ({ ...s, items: [...s.items] }));
      const srcItems = next[dragging.stageIdx].items;
      const itemIdx = srcItems.findIndex(it => it.id === dragging.itemId);
      if (itemIdx === -1) return prev;
      const [moved] = srcItems.splice(itemIdx, 1);
      next[targetStageIdx].items.push(moved);
      return next;
    });

    setDragging(null);
    setDragOverStage(null);
  };

  const handleDragEnd = () => {
    setDragging(null);
    setDragOverStage(null);
  };

  const isDraggingItem = (stageIdx: number, itemId: string) =>
    dragging?.stageIdx === stageIdx && dragging?.itemId === itemId;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Admission Pipeline"
        subtitle="Track enquiries across admission stages — drag cards between columns to update stage"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Admissions" }, { label: "Pipeline" }]}
        actions={
          <Button onClick={() => navigate("/admissions/enquiries/new")}>
            + New Enquiry
          </Button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard title="Total Enquiries" value={String(totalEnquiries)} trend={{ value: 12, isPositive: true }} variant="blue" />
        <KPICard title="New" value={String(stages[0].items.length)} variant="default" />
        <KPICard title="Follow-up" value={String(stages[1].items.length)} variant="amber" />
        <KPICard title="Converted" value={String(convertedCount)} variant="green" />
        <KPICard title="Conversion Rate" value={`${conversionRate}%`} trend={{ value: 5, isPositive: true }} variant="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 min-h-[400px]">
        {stages.map((stage, stageIdx) => (
          <div
            key={stage.name}
            onDragOver={e => handleDragOver(e, stageIdx)}
            onDrop={e => handleDrop(e, stageIdx)}
            onDragLeave={() => setDragOverStage(null)}
            className={`flex flex-col rounded-xl border-t-4 ${stage.headerColor} border border-border/60 transition-all duration-150 ${
              dragOverStage === stageIdx && dragging?.stageIdx !== stageIdx
                ? "ring-2 ring-primary ring-offset-1 bg-primary/5"
                : stage.columnBg
            }`}
          >
            {/* Column header */}
            <div className="px-3 pt-3 pb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">{stage.name}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stage.badgeVariant}`}>
                {stage.items.length}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 px-2 pb-3 space-y-2 min-h-[120px]">
              {stage.items.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={e => handleDragStart(e, stageIdx, item.id)}
                  onDragEnd={handleDragEnd}
                  className={`group bg-background rounded-lg border border-border/60 p-3 text-xs space-y-2 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all duration-150 select-none ${
                    isDraggingItem(stageIdx, item.id) ? "opacity-40 scale-95 ring-2 ring-primary" : "opacity-100"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-sm text-foreground leading-tight">{item.name}</span>
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-muted-foreground mt-0.5 shrink-0" />
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <BookOpen className="h-3 w-3 shrink-0" />
                    <span>{item.class}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="h-3 w-3 shrink-0" />
                      <span>{item.source}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty drop target hint */}
              {stage.items.length === 0 && (
                <div className={`rounded-lg border-2 border-dashed h-20 flex items-center justify-center text-xs text-muted-foreground transition-colors ${
                  dragOverStage === stageIdx ? "border-primary text-primary bg-primary/5" : "border-border/40"
                }`}>
                  Drop here
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
