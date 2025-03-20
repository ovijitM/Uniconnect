
import React from 'react';
import { User, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LeadershipSectionProps {
  presidentName?: string;
  presidentContact?: string;
  executiveMembers?: any;
  advisors?: string[];
}

const LeadershipSection: React.FC<LeadershipSectionProps> = ({
  presidentName,
  presidentContact,
  executiveMembers,
  advisors
}) => {
  const hasExecutiveMembers = executiveMembers && Object.keys(executiveMembers).length > 0;
  const hasContent = presidentName || hasExecutiveMembers || (advisors && advisors.length > 0);
  
  if (!hasContent) return null;
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Leadership & Team</h3>
      
      {presidentName && (
        <div className="mb-4 flex items-start">
          <Avatar className="h-8 w-8 mr-3 mt-0.5">
            <AvatarFallback className="bg-primary/10 text-primary">
              {presidentName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">{presidentName}</h4>
            <p className="text-sm text-muted-foreground">President/Founder</p>
            {presidentContact && (
              <p className="text-xs text-muted-foreground mt-1">{presidentContact}</p>
            )}
          </div>
        </div>
      )}
      
      {hasExecutiveMembers && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2 flex items-center">
            <Users className="h-4 w-4 mr-1.5" />
            Executive Members
          </h4>
          <div className="grid grid-cols-1 gap-2 pl-1.5">
            {Object.entries(executiveMembers).map(([role, name], index) => (
              <div key={index} className="text-sm flex items-center">
                <span className="font-medium min-w-24 text-muted-foreground">{role}:</span>
                <span>{String(name)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {advisors && advisors.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2 flex items-center">
            <User className="h-4 w-4 mr-1.5" />
            Advisors/Mentors
          </h4>
          <div className="flex flex-wrap gap-2">
            {advisors.map((advisor, index) => (
              <span key={index} className="text-sm bg-secondary px-2 py-0.5 rounded-full">
                {advisor}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadershipSection;
