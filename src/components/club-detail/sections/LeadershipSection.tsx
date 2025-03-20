
import React from 'react';

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
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">President/Founder</h4>
          <p className="text-sm text-muted-foreground">{presidentName}</p>
          {presidentContact && (
            <p className="text-sm text-muted-foreground">{presidentContact}</p>
          )}
        </div>
      )}
      
      {hasExecutiveMembers && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">Executive Members</h4>
          <div className="text-sm text-muted-foreground">
            {Object.entries(executiveMembers).map(([role, name], index) => (
              <div key={index} className="flex">
                <span className="font-medium min-w-32">{role}:</span>
                <span>{String(name)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {advisors && advisors.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-1">Advisors/Mentors</h4>
          <ul className="list-disc list-inside text-muted-foreground text-sm pl-2 space-y-1">
            {advisors.map((advisor, index) => (
              <li key={index}>{advisor}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LeadershipSection;
