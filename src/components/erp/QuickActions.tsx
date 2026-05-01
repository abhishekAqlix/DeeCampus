import { Plus, UserPlus, Receipt, ClipboardList, FileText, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

const quickActions = [
  { label: "New Admission", icon: UserPlus, path: "/students/new" },
  { label: "Collect Fee", icon: Receipt, path: "/fees/collect" },
  { label: "Add Enquiry", icon: Phone, path: "/admissions/enquiries/new" },
  { label: "Mark Attendance", icon: ClipboardList, path: "/attendance" },
  { label: "Create Exam", icon: FileText, path: "/exams" },
];

export function QuickActions() {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-orange-dark gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" /> Quick Create
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {quickActions.map((action, i) => (
          <DropdownMenuItem key={i} onClick={() => navigate(action.path)} className="gap-2 cursor-pointer">
            <action.icon className="h-4 w-4 text-muted-foreground" />
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
