
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
        <div className="flex w-full min-h-[calc(100vh-4rem)] pt-16">
          {sidebar}
          <SidebarInset className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Toaster />
    </div>
  );
};

export default DashboardLayout;
