import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, UserCheck, ClipboardList,
  Calendar, Receipt, FileText, Bus, MessageSquare, FolderOpen,
  BarChart3, Settings, ChevronDown, ChevronRight, BookOpen,
  UserPlus, Building2, ShieldCheck, Wallet, HelpCircle, Package,
  Library, Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/contexts/RoleContext";

interface NavItem {
  label: string;
  icon: any;
  path?: string;
  children?: { label: string; path: string }[];
}

const navigation: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Admissions", icon: UserPlus, children: [
    { label: "Enquiries", path: "/admissions/enquiries" },
    { label: "New Admission", path: "/students/new" },
    { label: "Pipeline", path: "/admissions/pipeline" },
  ]},
  { label: "Academics", icon: BookOpen, children: [
    { label: "Class & Sections", path: "/academics/classes" },
    { label: "Subjects", path: "/academics/subjects" },
    { label: "Academic Calendar", path: "/academics/calendar" },
    { label: "Timetable", path: "/timetable" },
  ]},
  { label: "Staff", icon: Users, children: [
    { label: "All Staff", path: "/staff" },
    { label: "Attendance", path: "/staff/attendance" },
    { label: "Leave Management", path: "/staff/leaves" },
    { label: "Payroll", path: "/staff/payroll" },
  ]},
  { label: "Attendance", icon: UserCheck, path: "/attendance" },
  { label: "Timetable", icon: Calendar, path: "/timetable" },
  { label: "Fees & Finance", icon: Receipt, children: [
    { label: "Fee Structure", path: "/fees/structure" },
    { label: "Collect Fees", path: "/fees/collect" },
    { label: "Pending Dues", path: "/fees/pending" },
    { label: "Reports", path: "/fees/reports" },
    { label: "Expenses", path: "/fees/expenses" },
    { label: "Cashbook", path: "/fees/cashbook" },
  ]},
  { label: "Exams", icon: FileText, children: [
    { label: "Schedule", path: "/exams/schedule" },
    { label: "Marks Entry", path: "/exams/marks" },
    { label: "Results", path: "/exams/results" },
    { label: "Report Cards", path: "/exams/report-cards" },
    { label: "Question Bank", path: "/exams/question-bank" },
  ]},
  { label: "Transport", icon: Bus, children: [
    { label: "Routes", path: "/transport/routes" },
    { label: "Vehicles", path: "/transport/vehicles" },
    { label: "Students", path: "/transport/students" },
    { label: "Tracking", path: "/transport/tracking" },
  ]},
  { label: "Communication", icon: MessageSquare, children: [
    { label: "Messages", path: "/communication/messages" },
    { label: "Announcements", path: "/communication/announcements" },
    { label: "Templates", path: "/communication/templates" },
  ]},
  { label: "Library", icon: Library, path: "/library" },
  { label: "Inventory", icon: Package, path: "/inventory" },
  { label: "Visitors", icon: Eye, path: "/visitors" },
  { label: "Helpdesk", icon: HelpCircle, path: "/helpdesk" },
  { label: "Documents", icon: FolderOpen, path: "/documents" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
  { label: "User Rights", icon: ShieldCheck, path: "/user-rights" },
  { label: "Settings", icon: Settings, children: [
    { label: "School Profile", path: "/settings/school" },
    { label: "Masters", path: "/settings/masters" },
    { label: "Integrations", path: "/settings/integrations" },
    { label: "Audit Logs", path: "/settings/audit" },
  ]},
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasAccess, role } = useRole();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Admissions", "Students", "Fees & Finance"]);

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev => prev.includes(label) ? prev.filter(g => g !== label) : [...prev, label]);
  };

  const isActive = (path?: string) => path && location.pathname === path;
  const isGroupActive = (item: NavItem) => item.children?.some(c => location.pathname.startsWith(c.path));

  // Filter navigation based on role
  const filteredNavigation = navigation.filter(item => hasAccess(item.label));

  return (
    <aside className={cn(
      "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300 flex-shrink-0 overflow-hidden",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Brand */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-primary-foreground tracking-tight">DeeCampus</h1>
              <p className="text-[10px] text-sidebar-muted uppercase tracking-widest">ERP</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mx-auto">
            <GraduationCap className="h-5 w-5 text-accent-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2 px-2">
        {filteredNavigation.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const expanded = expandedGroups.includes(item.label);
          const active = isActive(item.path) || isGroupActive(item);

          return (
            <div key={item.label} className="mb-0.5">
              <button
                onClick={() => {
                  if (hasChildren && !collapsed) toggleGroup(item.label);
                  else if (item.path) navigate(item.path);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors",
                  active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("h-4 w-4 flex-shrink-0", active && "text-sidebar-primary")} />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {hasChildren && (expanded ? <ChevronDown className="h-3.5 w-3.5 opacity-50" /> : <ChevronRight className="h-3.5 w-3.5 opacity-50" />)}
                  </>
                )}
              </button>

              {hasChildren && expanded && !collapsed && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-sidebar-border pl-3">
                  {item.children!.map((child) => (
                    <button
                      key={child.path}
                      onClick={() => navigate(child.path)}
                      className={cn(
                        "w-full text-left text-xs py-1.5 px-2 rounded transition-colors",
                        location.pathname === child.path
                          ? "text-sidebar-primary font-medium bg-sidebar-accent/50"
                          : "text-sidebar-muted hover:text-sidebar-foreground"
                      )}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="bg-sidebar-accent/50 rounded-lg p-3 text-center">
            <p className="text-[10px] text-sidebar-muted uppercase tracking-widest">Academic Year</p>
            <p className="text-sm font-semibold text-sidebar-foreground">2025–2026</p>
          </div>
        </div>
      )}
    </aside>
  );
}
