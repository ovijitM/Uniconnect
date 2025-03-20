
import React from 'react';
import { motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="text-center mb-12"
    >
      <h1 className="text-balance font-semibold mb-4">
        <span className="relative">
          <span className="relative z-10">University Events & Collaborations</span>
          <span className="absolute bottom-0 left-0 h-3 w-full bg-blue-100 -z-10"></span>
        </span>
      </h1>
      <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
        Discover and participate in exciting events organized by university clubs, or create your own for the community.
      </p>
    </motion.div>
  );
};

export default HeroSection;
