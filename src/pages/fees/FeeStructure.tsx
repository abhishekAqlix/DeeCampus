import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/erp/PageHeader";
import { DataTable } from "@/components/erp/DataTable";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { KPICard } from "@/components/erp/KPICard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Percent } from "lucide-react";
import {
  createFeeStructureRequest,
  deleteFeeStructureRequest,
  getFeeWaiverSettingsRequest,
  getSchoolProfileRequest,
  listFeeStructuresRequest,
  saveFeeWaiverSettingsRequest,
  FeeStructureDto,
  FeeWaiverConcessionDto,
} from "@/api/school-api";

const WAIVER_ROWS: { label: string; key: FeeWaiverConcessionDto["categoryKey"] }[] = [
  { label: "Staff Ward Concession", key: "staff_ward_concession" },
  { label: "SC / ST Category", key: "sc_st_category" },
  { label: "OBC Category", key: "obc_category" },
  { label: "Early Payment Discount", key: "early_payment_discount" },
  { label: "Freedom Fighter Family", key: "freedom_fighter_family" },
  { label: "Girl Child Scholarship", key: "girl_child_scholarship" },
  { label: "Orphan Concession / Welfare Scholarship", key: "orphan_concession_welfare_scholarship" },
  { label: "Sibling Fee Concession", key: "sibling_fee_concession" },
  { label: "EWS Fee Waiver", key: "ews_fee_waiver" },
  { label: "Sponsored Scholarship", key: "sponsored_scholarship" },
  { label: "Sports Concession", key: "sports_concession" },
  { label: "Merit Concession", key: "merit_concession" },
];

type SavedWaiver = { name: string; value: string; type: string };

const rupee = (n: number) => `₹${Math.max(0, Math.round(n)).toLocaleString("en-IN")}`;

const parseAmount = (annual: number) => Number(annual) || 0;

const getWaiverSummary = (annualTotal: number, waiver: SavedWaiver) => {
  const discountValue = Number(waiver.value) || 0;
  const discountAmount = waiver.type === "%" ? (annualTotal * discountValue) / 100 : discountValue;
  return {
    discountAmount,
    payableAmount: Math.max(annualTotal - discountAmount, 0),
  };
};

export default function FeeStructure() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [waiverOpen, setWaiverOpen] = useState(false);
  const [waiverSummaryOpen, setWaiverSummaryOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructureDto | null>(null);
  const [form, setForm] = useState({ classGroup: "", tuition: "", admission: "", exam: "", transport: "", annual: "" });
  const [waivers, setWaivers] = useState<Record<string, { value: string; type: "%" | "₹" }>>(() =>
    Object.fromEntries(WAIVER_ROWS.map((w) => [w.key, { value: "", type: "%" as const }]))
  );
  const [savedWaivers, setSavedWaivers] = useState<SavedWaiver[]>([]);

  const { data: profile } = useQuery({
    queryKey: ["school-profile"],
    queryFn: async () => (await getSchoolProfileRequest()).profile,
  });

  const academicYear = profile?.currentAcademicYear ?? "2026-27";

  const { data = [], isLoading } = useQuery({
    queryKey: ["fee-structures", academicYear],
    queryFn: async () => (await listFeeStructuresRequest(academicYear)).items,
  });

  const waiverQuery = useQuery({
    queryKey: ["fee-waiver-settings"],
    queryFn: async () => (await getFeeWaiverSettingsRequest()).settings,
    enabled: waiverOpen,
  });

  useEffect(() => {
    if (!waiverQuery.data?.concessions) return;
    const next: Record<string, { value: string; type: "%" | "₹" }> = {};
    for (const row of WAIVER_ROWS) next[row.key] = { value: "", type: "%" };
    for (const c of waiverQuery.data.concessions) {
      if (c.value > 0)
        next[c.categoryKey] = {
          value: String(c.value),
          type: c.unit === "rupees" ? "₹" : "%",
        };
    }
    setWaivers(next);
  }, [waiverQuery.data]);

  const saveWaiverMutation = useMutation({
    mutationFn: async (concessions: FeeWaiverConcessionDto[]) => saveFeeWaiverSettingsRequest(concessions),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["fee-waiver-settings"] });
      toast({ title: "Fee waivers saved to database" });
      setWaiverOpen(false);
    },
    onError: (e: Error) => toast({ title: "Save failed", description: e.message, variant: "destructive" }),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      createFeeStructureRequest({
        academicYear,
        classGroup: form.classGroup.trim(),
        tuitionFeeMonthly: Number(form.tuition) || 0,
        admissionFee: Number(form.admission) || 0,
        examFee: Number(form.exam) || 0,
        transportFeeMonthly: Number(form.transport) || 0,
        annualTotal: Number(form.annual) || 0,
        status: "Active",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["fee-structures", academicYear] });
      toast({ title: "Fee structure added" });
      setOpen(false);
      setForm({ classGroup: "", tuition: "", admission: "", exam: "", transport: "", annual: "" });
    },
    onError: (e: Error) => toast({ title: "Failed", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFeeStructureRequest(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["fee-structures", academicYear] });
      toast({ title: "Fee structure removed" });
    },
    onError: (e: Error) => toast({ title: "Delete failed", description: e.message, variant: "destructive" }),
  });

  const tableRows = useMemo(
    () =>
      data.map((row) => ({
        ...row,
        tuitionFee: rupee(row.tuitionFeeMonthly),
        admissionFee: rupee(row.admissionFee),
        examFee: rupee(row.examFee),
        transportFee: rupee(row.transportFeeMonthly),
        annual: rupee(row.annualTotal),
      })),
    [data]
  );

  const columnsFixed = [
    { key: "classGroup" as const, label: "Class Group", sortable: true },
    { key: "tuitionFee" as const, label: "Tuition/mo" },
    { key: "admissionFee" as const, label: "Admission" },
    { key: "examFee" as const, label: "Exam Fee" },
    { key: "transportFee" as const, label: "Transport/mo" },
    { key: "annual" as const, label: "Annual Total" },
    {
      key: "id" as const,
      label: "Actions",
      render: (idVal: string) => {
        const row = data.find((item) => item.id === idVal);
        return (
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              disabled={!row}
              onClick={() => {
                if (!row) return;
                setSelectedStructure(row);
                setWaiverSummaryOpen(true);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive h-8 px-2"
              type="button"
              onClick={() => confirm("Delete?") && void deleteMutation.mutateAsync(idVal)}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
    {
      key: "status" as const,
      label: "Status",
      render: (v: string) => <StatusBadge status="active" label={v} />,
    },
  ];

  const saveWaivers = () => {
    const concessions: FeeWaiverConcessionDto[] = WAIVER_ROWS.map(({ key }) => {
      const w = waivers[key] ?? { value: "", type: "%" as const };
      const value = Number(w.value) || 0;
      return {
        categoryKey: key,
        value,
        unit: w.type === "₹" ? "rupees" : ("percent" as const),
      };
    }).filter((c) => c.value > 0);

    if (concessions.length === 0) {
      toast({ title: "Enter at least one discount", variant: "destructive" });
      return;
    }

    const entries: SavedWaiver[] = concessions.map((c) => {
      const label = WAIVER_ROWS.find((w) => w.key === c.categoryKey)?.label ?? c.categoryKey;
      return { name: label, value: String(c.value), type: c.unit === "percent" ? "%" : "₹" };
    });
    setSavedWaivers(entries);
    void saveWaiverMutation.mutateAsync(concessions);
  };

  const updateWaiver = (field: string, key: "value" | "type", val: string) => {
    setWaivers((prev) => ({ ...prev, [field]: { ...prev[field], [key]: val } }));
  };

  const selectedAnnualTotal = selectedStructure ? parseAmount(selectedStructure.annualTotal) : 0;

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="Fee Structure"
        subtitle={`Define fee structures for academic year ${academicYear}`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Fees & Finance" }, { label: "Fee Structure" }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setWaiverOpen(true)} className="gap-1.5" type="button">
              <Percent className="h-4 w-4" /> Fee Waiver
            </Button>
            <Button type="button" onClick={() => setOpen(true)}>
              + Add Structure
            </Button>
          </div>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <KPICard title="Class Groups" value={String(data.length)} variant="default" />
        <KPICard title="Academic Year" value={academicYear} variant="green" />
        <KPICard title="School" value={profile?.shortName ?? "—"} variant="blue" />
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && <DataTable data={tableRows} columns={columnsFixed} searchKey="classGroup" />}

      {savedWaivers.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Active Fee Waivers & Concessions (saved)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {savedWaivers.map((w, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2 text-sm">
                <span className="text-foreground">{w.name}</span>
                <span className="font-semibold text-primary">{w.type === "%" ? `${w.value}%` : `₹${w.value}`}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Fee Structure</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-xs">Academic Year</Label>
              <Input value={academicYear} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Class Group *</Label>
              <Input
                placeholder="e.g., Class 9 - 10"
                value={form.classGroup}
                onChange={(e) => setForm({ ...form, classGroup: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">Tuition /mo</Label>
                <Input type="number" value={form.tuition} onChange={(e) => setForm({ ...form, tuition: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Admission</Label>
                <Input type="number" value={form.admission} onChange={(e) => setForm({ ...form, admission: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Exam Fee</Label>
                <Input type="number" value={form.exam} onChange={(e) => setForm({ ...form, exam: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Transport /mo</Label>
                <Input type="number" value={form.transport} onChange={(e) => setForm({ ...form, transport: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Annual Total</Label>
              <Input type="number" value={form.annual} onChange={(e) => setForm({ ...form, annual: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="button" disabled={createMutation.isPending || !form.classGroup.trim()} onClick={() => void createMutation.mutateAsync()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={waiverSummaryOpen} onOpenChange={setWaiverSummaryOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" /> Fee Waiver Payable Amount
            </DialogTitle>
          </DialogHeader>
          {selectedStructure && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground">Class Group</p>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{selectedStructure.classGroup}</p>
                  <p className="text-sm font-semibold text-primary">Rs. {selectedAnnualTotal.toLocaleString("en-IN")}</p>
                </div>
              </div>

              {savedWaivers.length > 0 ? (
                <div className="rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-12 bg-secondary/60 px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
                    <span className="col-span-5">Fee Waiver</span>
                    <span className="col-span-2 text-right">Discount</span>
                    <span className="col-span-2 text-right">Reduced</span>
                    <span className="col-span-3 text-right">Payable</span>
                  </div>
                  <div className="divide-y">
                    {savedWaivers.map((waiver) => {
                      const summary = getWaiverSummary(selectedAnnualTotal, waiver);
                      return (
                        <div key={waiver.name} className="grid grid-cols-12 items-center px-3 py-3 text-sm">
                          <span className="col-span-5 font-medium">{waiver.name}</span>
                          <span className="col-span-2 text-right text-muted-foreground">
                            {waiver.type === "%" ? `${waiver.value}%` : `Rs. ${Number(waiver.value) || 0}`}
                          </span>
                          <span className="col-span-2 text-right text-muted-foreground">Rs. {Math.round(summary.discountAmount)}</span>
                          <span className="col-span-3 text-right font-semibold text-primary">Rs. {Math.round(summary.payableAmount)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center">
                  <p className="text-sm font-medium">No fee waiver has been saved yet.</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button type="button" onClick={() => setWaiverSummaryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={waiverOpen} onOpenChange={setWaiverOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-primary" /> Fee Waiver & Concessions
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-xs text-muted-foreground">Values sync to MongoDB via PUT /fee-waiver/settings.</p>
            <div className="space-y-2">
              {WAIVER_ROWS.map((field) => (
                <div key={field.key} className="grid grid-cols-12 gap-2 items-center">
                  <Label className="col-span-6 text-xs font-normal">{field.label}</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    className="col-span-4 h-9"
                    value={waivers[field.key]?.value ?? ""}
                    onChange={(e) => updateWaiver(field.key, "value", e.target.value)}
                  />
                  <Select value={waivers[field.key]?.type ?? "%"} onValueChange={(v) => updateWaiver(field.key, "type", v)}>
                    <SelectTrigger className="col-span-2 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="%">%</SelectItem>
                      <SelectItem value="₹">₹</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWaiverOpen(false)} type="button">
              Cancel
            </Button>
            <Button type="button" disabled={saveWaiverMutation.isPending} onClick={saveWaivers}>
              Save Waivers
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
