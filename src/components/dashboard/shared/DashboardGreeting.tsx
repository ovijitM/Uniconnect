
import React from 'react';
import { motion } from 'framer-motion';

interface DashboardGreetingProps {
  userName: string;
  subtitle: string;
  hasError?: boolean;
}

const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ 
  userName, 
  subtitle,
  hasError = false 
}) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <motion.div 
      className={`mb-8 ${hasError ? 'bg-destructive/10' : 'bg-gradient-to-r from-primary/10 to-secondary/10'} p-6 rounded-xl`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        {getTimeBasedGreeting()}, {userName}
      </h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </motion.div>
  );
};

export default DashboardGreeting;
