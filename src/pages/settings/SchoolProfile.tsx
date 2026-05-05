import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/erp/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSchoolProfileRequest, SchoolProfileDto, updateSchoolProfileRequest } from "@/api/school-api";

export default function SchoolProfile() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SchoolProfileDto | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["school-profile"],
    queryFn: async () => (await getSchoolProfileRequest()).profile,
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (body: Partial<SchoolProfileDto>) => updateSchoolProfileRequest(body),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: ["school-profile"] });
      setForm(res.profile);
      toast.success(res.message ?? "Profile updated!");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const f = form;

  const update = <K extends keyof SchoolProfileDto>(key: K, value: SchoolProfileDto[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const save = () => {
    if (!f) return;
    saveMutation.mutate({
      schoolName: f.schoolName,
      shortName: f.shortName,
      establishedYear: Number(f.establishedYear),
      boardAffiliation: f.boardAffiliation,
      schoolType: f.schoolType,
      email: f.email,
      phone: f.phone,
      website: f.website,
      address: f.address,
      chairman: f.chairman,
      principal: f.principal,
      vicePrincipal: f.vicePrincipal,
      adminHead: f.adminHead,
      currentAcademicYear: f.currentAcademicYear,
      sessionStart: f.sessionStart,
      sessionEnd: f.sessionEnd,
      workingDaysWeekly: Number(f.workingDaysWeekly),
    });
  };

  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader
        title="School Profile"
        subtitle="Manage school information and branding"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Settings" }, { label: "School Profile" }]}
        actions={
          <Button onClick={save} disabled={!f || saveMutation.isPending}>
            Save Changes
          </Button>
        }
      />
      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && f && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>School Name</Label>
                <Input value={f.schoolName} onChange={(e) => update("schoolName", e.target.value)} />
              </div>
              <div>
                <Label>Short Name</Label>
                <Input value={f.shortName} onChange={(e) => update("shortName", e.target.value)} />
              </div>
              <div>
                <Label>Established Year</Label>
                <Input
                  type="number"
                  value={f.establishedYear}
                  onChange={(e) => update("establishedYear", Number(e.target.value) as SchoolProfileDto["establishedYear"])}
                />
              </div>
              <div>
                <Label>Board/Affiliation</Label>
                <Input value={f.boardAffiliation} onChange={(e) => update("boardAffiliation", e.target.value)} />
              </div>
              <div>
                <Label>School Type</Label>
                <Input value={f.schoolType} onChange={(e) => update("schoolType", e.target.value)} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input type="email" value={f.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={f.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div>
                <Label>Website</Label>
                <Input value={f.website} onChange={(e) => update("website", e.target.value)} />
              </div>
              <div>
                <Label>Address</Label>
                <Textarea value={f.address} onChange={(e) => update("address", e.target.value)} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Chairman</Label>
                <Input value={f.chairman} onChange={(e) => update("chairman", e.target.value)} />
              </div>
              <div>
                <Label>Principal</Label>
                <Input value={f.principal} onChange={(e) => update("principal", e.target.value)} />
              </div>
              <div>
                <Label>Vice Principal</Label>
                <Input value={f.vicePrincipal} onChange={(e) => update("vicePrincipal", e.target.value)} />
              </div>
              <div>
                <Label>Admin Head</Label>
                <Input value={f.adminHead} onChange={(e) => update("adminHead", e.target.value)} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Academic Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Academic Year</Label>
                <Input value={f.currentAcademicYear} onChange={(e) => update("currentAcademicYear", e.target.value)} />
              </div>
              <div>
                <Label>Session Start</Label>
                <Input type="date" value={f.sessionStart} onChange={(e) => update("sessionStart", e.target.value)} />
              </div>
              <div>
                <Label>Session End</Label>
                <Input type="date" value={f.sessionEnd} onChange={(e) => update("sessionEnd", e.target.value)} />
              </div>
              <div>
                <Label>Working Days (Weekly)</Label>
                <Input
                  type="number"
                  min={1}
                  max={7}
                  value={f.workingDaysWeekly}
                  onChange={(e) =>
                    update("workingDaysWeekly", Number(e.target.value) as SchoolProfileDto["workingDaysWeekly"])
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
