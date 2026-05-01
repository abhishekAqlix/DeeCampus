import { PageHeader } from "@/components/erp/PageHeader";

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; href?: string }[];
}

export function PlaceholderModule({ title, subtitle, breadcrumbs }: PlaceholderPageProps) {
  return (
    <div className="space-y-6 max-w-[1400px]">
      <PageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />
      <div className="bg-card rounded-lg border shadow-sm p-12 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">🚧</span>
        </div>
        <h3 className="text-lg font-semibold mb-1">Module Coming Soon</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          The {title} module is under development. This will include full CRUD operations, analytics, and reporting capabilities.
        </p>
      </div>
    </div>
  );
}
