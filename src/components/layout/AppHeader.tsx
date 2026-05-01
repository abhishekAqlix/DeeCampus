import { Bell, Search, Menu, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { QuickActions } from "@/components/erp/QuickActions";
import { RoleSwitcher } from "@/components/erp/RoleSwitcher";
import { useRole } from "@/contexts/RoleContext";

interface AppHeaderProps {
  onToggleSidebar: () => void;
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  const { user, role, permissions } = useRole();

  return (
    <header className="h-14 bg-card border-b flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="h-8 w-8 p-0">
          <Menu className="h-4 w-4" />
        </Button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search students, staff, fees..." className="pl-9 w-80 h-9 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-accent" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Role Switcher Preview */}
        <RoleSwitcher />

        {permissions.canCreate && <QuickActions />}

        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-9 pl-2 pr-3">
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-foreground">{user.initials}</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-medium leading-none">{user.name}</p>
                <p className="text-[10px] text-muted-foreground">{user.label}</p>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="gap-2"><User className="h-4 w-4" />My Profile</DropdownMenuItem>
            <DropdownMenuItem className="gap-2"><Settings className="h-4 w-4" />Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-destructive"><LogOut className="h-4 w-4" />Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
