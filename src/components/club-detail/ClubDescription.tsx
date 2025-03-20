
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ClubDescriptionProps {
  description: string;
  maxHeight?: number;
}

const ClubDescription: React.FC<ClubDescriptionProps> = ({ 
  description, 
  maxHeight = 200 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsCollapse, setNeedsCollapse] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check if the content exceeds the max height
    if (contentRef.current && contentRef.current.scrollHeight > maxHeight) {
      setNeedsCollapse(true);
    } else {
      setNeedsCollapse(false);
    }
  }, [description, maxHeight]);

  // Function to format the description with paragraphs
  const formattedDescription = description.split('\n').map((paragraph, index) => 
    paragraph.trim() ? <p key={index} className="mb-4 last:mb-0">{paragraph}</p> : null
  );

  if (!needsCollapse) {
    return (
      <div className="text-muted-foreground whitespace-pre-line">
        {formattedDescription}
      </div>
    );
  }

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={setIsExpanded}
      className="w-full"
    >
      <div 
        ref={contentRef} 
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          !isExpanded && "max-h-[200px]"
        )}
      >
        <div className="text-muted-foreground">
          {formattedDescription}
        </div>
        
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        )}
      </div>
      
      <div className="mt-2 text-center">
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="font-medium">
            {isExpanded ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Show More
              </>
            )}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent className="overflow-hidden" />
    </Collapsible>
  );
};

export default ClubDescription;
