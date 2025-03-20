
import React from 'react';
import { motion } from 'framer-motion';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ 
  title, 
  subtitle, 
  children, 
  footerContent 
}) => {
  return (
    <div className="max-w-md mx-auto mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {children}

        {footerContent && (
          <div className="mt-6 text-center">
            {footerContent}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCard;
