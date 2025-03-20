
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquareQuote } from 'lucide-react';

interface WhyJoinSectionProps {
  whyJoin?: string;
}

const WhyJoinSection: React.FC<WhyJoinSectionProps> = ({ whyJoin }) => {
  if (!whyJoin) return null;
  
  return (
    <Card className="border-primary/10 bg-primary/5">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <MessageSquareQuote className="h-6 w-6 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-medium mb-3">Why Join?</h3>
            <p className="text-muted-foreground whitespace-pre-line">{whyJoin}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhyJoinSection;
