
import React from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main 
        className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.main>
      <footer className="py-6 px-4 sm:px-6 lg:px-8 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} University Clubs Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
