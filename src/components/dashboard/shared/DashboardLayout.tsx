
import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import Navbar from '@/components/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full min-h-screen pt-16">
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
