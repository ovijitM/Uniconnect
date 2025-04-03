
import React from 'react';
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import Navbar from '@/components/Navbar';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="flex w-full min-h-[calc(100vh-4rem)] pt-16">
          {sidebar}
          <SidebarInset className="flex-1 p-3 sm:p-6 overflow-auto bg-secondary/5">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Toaster position="top-right" closeButton />
    </div>
  );
};

export default DashboardLayout;
