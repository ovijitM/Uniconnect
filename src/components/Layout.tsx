
import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isDashboardPage = location.pathname.includes('dashboard');
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <motion.main 
        className={`flex-1 w-full max-w-full mx-auto ${isHomePage ? 'pt-4' : 'pt-6'} ${isDashboardPage ? 'pb-6' : 'pb-12'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.main>
      
      {!hideFooter && (
        <footer className="border-t border-border">
          <div className="max-w-7xl mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">University Clubs Platform</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Connecting students with clubs and organizations to enhance their university experience and create lasting memories.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Guidelines</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Contact</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Email Us</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Feedback</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground text-sm">
              <p>© {new Date().getFullYear()} University Clubs Platform. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
      <Toaster position="top-right" closeButton />
    </div>
  );
};

export default Layout;
