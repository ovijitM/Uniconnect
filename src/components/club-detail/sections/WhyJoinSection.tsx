
import React from 'react';

interface WhyJoinSectionProps {
  whyJoin?: string;
}

const WhyJoinSection: React.FC<WhyJoinSectionProps> = ({ whyJoin }) => {
  if (!whyJoin) return null;
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Why Join?</h3>
      <p className="text-muted-foreground whitespace-pre-line">{whyJoin}</p>
    </div>
  );
};

export default WhyJoinSection;
