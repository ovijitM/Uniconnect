
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface WhyJoinSectionProps {
  whyJoin?: string;
}

const WhyJoinSection: React.FC<WhyJoinSectionProps> = ({ whyJoin }) => {
  if (!whyJoin) return null;
  
  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium mb-3">Why Join?</h3>
      <p className="text-muted-foreground whitespace-pre-line">{whyJoin}</p>
    </div>
  );
};

export default WhyJoinSection;
