import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, Plus, Minus, Save, CalendarDays } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSchoolProfileRequest, listClassSectionsRequest, listTimetablesRequest, upsertTimetableRequest } from "@/api/school-api";
import { TIMETABLE_DAYS } from "@/constants/timetable";

/** First column when starting a fresh timetable (“one slot at first”). */
const INITIAL_SINGLE_PERIOD = ["8:00-8:45"];

const SUBJECT_PREVIEW: Record<string, string> = {
  Math: "bg-blue-50 border-blue-200 text-blue-700",
  English: "bg-green-50 border-green-200 text-green-700",
  Science: "bg-purple-50 border-purple-200 text-purple-700",
  Hindi: "bg-amber-50 border-amber-200 text-amber-700",
  SST: "bg-rose-50 border-rose-200 text-rose-700",
  CS: "bg-cyan-50 border-cyan-200 text-cyan-700",
  PE: "bg-[#4992E0]/10 border-[#4992E0]/30 text-[#4992E0]",
  Art: "bg-pink-50 border-pink-200 text-pink-700",
  Break: "bg-muted text-muted-foreground",
  Lunch: "bg-muted text-muted-foreground",
};

function blankGrid(width: number): Record<string, string[]> {
  const g: Record<string, string[]> = {};
  for (const d of TIMETABLE_DAYS) {
    g[d] = Array(Math.max(width, 1)).fill("");
  }
  return g;
}

export default function TimetablePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /** true after user clicks Create; false on landing-only screen */
  const [flowOpen, setFlowOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["school-profile"],
    queryFn: async () => (await getSchoolProfileRequest()).profile,
  });

  const [academicYear, setAcademicYear] = useState("2026-27");

  useEffect(() => {
    if (profile?.currentAcademicYear) setAcademicYear(profile.currentAcademicYear);
  }, [profile?.currentAcademicYear]);

  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ["class-sections"],
    queryFn: async () => (await listClassSectionsRequest()).items,
  });

  const [classSectionId, setClassSectionId] = useState("");

  const { data: timetables } = useQuery({
    queryKey: ["timetables", academicYear, classSectionId],
    enabled: !!classSectionId && !!academicYear,
    queryFn: async () =>
      (
        await listTimetablesRequest({
          academicYear,
          classSectionId,
        })
      ).items,
  });

  const [periods, setPeriods] = useState<string[]>(INITIAL_SINGLE_PERIOD);
  const [grid, setGrid] = useState<Record<string, string[]>>(() => blankGrid(1));

  const existing = timetables?.[0];

  useEffect(() => {
    if (!classSectionId) return;
    if (existing) {
      const p = existing.periods?.length ? existing.periods : INITIAL_SINGLE_PERIOD;
      setPeriods(p);
      const g: Record<string, string[]> = {};
      for (const d of TIMETABLE_DAYS) {
        const row = existing.schedule.find((x) => x.day === d);
        g[d] = [...(row?.subjects ?? [])].concat(Array(p.length).fill("")).slice(0, p.length);
      }
      setGrid(g);
    } else {
      setPeriods(INITIAL_SINGLE_PERIOD);
      setGrid(blankGrid(INITIAL_SINGLE_PERIOD.length));
    }
  }, [existing, classSectionId]);

  const saveMutation = useMutation({
    mutationFn: async () =>
      upsertTimetableRequest({
        classSectionId,
        academicYear,
        periods,
        schedule: TIMETABLE_DAYS.map((day) => ({ day, subjects: grid[day] ?? Array(periods.length).fill("") })),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["timetables", academicYear, classSectionId] });
      toast({ title: "Timetable saved" });
    },
    onError: (e: Error) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  const classLabel = useMemo(() => sections.find((s) => s.id === classSectionId)?.class ?? "", [sections, classSectionId]);

  const setCell = (day: string, idx: number, value: string) => {
    setGrid((prev) => {
      const row = [...(prev[day] ?? Array(periods.length).fill(""))];
      row[idx] = value;
      return { ...prev, [day]: row };
    });
  };

  const updatePeriodLabel = (idx: number, value: string) => {
    setPeriods((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const addSlot = () => {
    setPeriods((p) => [...p, `Period ${p.length + 1}`]);
    setGrid((prev) => {
      const next: Record<string, string[]> = {};
      for (const d of TIMETABLE_DAYS) {
        next[d] = [...(prev[d] ?? []), ""];
      }
      return next;
    });
  };

  const removeSlot = () => {
    if (periods.length <= 1) {
      toast({ title: "At least one time slot required", variant: "destructive" });
      return;
    }
    setPeriods((p) => p.slice(0, -1));
    setGrid((prev) => {
      const next: Record<string, string[]> = {};
      for (const d of TIMETABLE_DAYS) {
        next[d] = (prev[d] ?? []).slice(0, -1);
      }
      return next;
    });
  };

  const handleCancelFlow = () => {
    setFlowOpen(false);
    setClassSectionId("");
  };

  const showGrid = flowOpen && !!classSectionId;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Timetable"
        subtitle="Create and edit weekly schedules per class section"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Academics" }, { label: "Timetable" }]}
        actions={
          showGrid ? (
            <Button variant="outline" type="button" size="sm" className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          ) : undefined
        }
      />

      {!flowOpen && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-6 py-20 px-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div className="text-center space-y-1 max-w-sm">
              <p className="font-semibold text-lg">Create a timetable</p>
              <p className="text-sm text-muted-foreground">
                Start by selecting the academic year and a class section. The schedule grid opens after you pick a class.
              </p>
            </div>
            <Button type="button" size="lg" className="gap-2" onClick={() => setFlowOpen(true)}>
              <Plus className="h-5 w-5" />
              Create timetable
            </Button>
          </CardContent>
        </Card>
      )}

      {flowOpen && (
        <>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="space-y-2 min-w-[120px]">
                  <Label className="text-xs">Academic year</Label>
                  <Input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="2026-27" className="h-10" />
                </div>
                <div className="space-y-2 flex-1 min-w-[220px] max-w-sm">
                  <Label className="text-xs">Class (from Class & Sections)</Label>
                  <Select
                    value={classSectionId || undefined}
                    onValueChange={setClassSectionId}
                    disabled={sectionsLoading}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder={sectionsLoading ? "Loading classes…" : "Select class section"} />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.class}
                          {c.sections ? ` (${c.sections})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" variant="outline" className="h-10" onClick={handleCancelFlow}>
                  Cancel
                </Button>
              </div>

              {showGrid && (
                <div className="flex flex-wrap gap-2 border-t pt-4">
                  <Button type="button" variant="secondary" size="sm" className="gap-1.5" onClick={addSlot}>
                    <Plus className="h-4 w-4" /> Add slot
                  </Button>
                  <Button type="button" variant="secondary" size="sm" className="gap-1.5" onClick={removeSlot}>
                    <Minus className="h-4 w-4" /> Remove slot
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="gap-1.5 ml-auto bg-primary"
                    disabled={saveMutation.isPending}
                    onClick={() => void saveMutation.mutateAsync()}
                  >
                    <Save className="h-4 w-4" /> Save
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {!classSectionId && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Select a class section above to build the timetable. Time slots begin with one period; use Add slot for more columns.
            </p>
          )}

          {showGrid && (
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium w-36">Day / Period</th>
                      {periods.map((periodLabel, i) => (
                        <th key={i} className="p-2 text-center align-top min-w-[110px]">
                          <Input
                            value={periodLabel}
                            onChange={(e) => updatePeriodLabel(i, e.target.value)}
                            className="h-8 text-xs text-center font-medium px-1"
                          />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TIMETABLE_DAYS.map((day) => (
                      <tr key={day} className="border-b">
                        <td className="p-3 font-medium whitespace-nowrap">{day}</td>
                        {periods.map((_, i) => {
                          const sub = grid[day]?.[i] ?? "";
                          return (
                            <td key={i} className="p-1 align-top">
                              <Input
                                className="h-8 text-xs"
                                value={sub}
                                placeholder="—"
                                onChange={(e) => setCell(day, i, e.target.value)}
                              />
                              {sub ? (
                                <div
                                  className={`mt-1 px-2 py-1 rounded-md border text-xs font-medium ${SUBJECT_PREVIEW[sub] || "bg-muted"}`}
                                >
                                  {sub}
                                </div>
                              ) : null}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs text-muted-foreground p-3 border-t">
                  {classLabel ? `Editing: ${classLabel}` : ""} · {academicYear} · Save persists to the server.
                </p>
              </CardContent>
            </Card>
          )}

        </>
      )}
    </div>
  );
}
