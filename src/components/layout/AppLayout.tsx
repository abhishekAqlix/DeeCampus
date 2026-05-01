import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader onToggleSidebar={() => setCollapsed(!collapsed)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        <footer className="flex-shrink-0 border-t border-border bg-background py-4 text-center text-sm text-muted-foreground">
          Powered By{" "}
          <a
            href="https://aqlix.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-sidebar-foreground hover:text-accent"
          >
            Aqlix It Solutions Pvt Ltd
          </a>
        </footer>
      </div>
    </div>
  );
}
