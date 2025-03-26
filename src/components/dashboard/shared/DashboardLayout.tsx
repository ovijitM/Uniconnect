
import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full min-h-screen">
          {sidebar}
          <SidebarInset className="p-4 md:p-6">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Toaster />
    </div>
  );
};

export default DashboardLayout;
