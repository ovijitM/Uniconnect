
import React from 'react';
import { User, Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LeadershipSectionProps {
  presidentChairName?: string;
  presidentChairContact?: string;
  executiveMembersRoles?: any;
  facultyAdvisors?: string[];
  primaryFacultyAdvisor?: string;
}

const LeadershipSection: React.FC<LeadershipSectionProps> = ({
  presidentChairName,
  presidentChairContact,
  executiveMembersRoles,
  facultyAdvisors,
  primaryFacultyAdvisor
}) => {
  const hasExecutiveMembers = executiveMembersRoles && Object.keys(executiveMembersRoles).length > 0;
  const hasContent = presidentChairName || hasExecutiveMembers || 
                     (facultyAdvisors && facultyAdvisors.length > 0) || 
                     primaryFacultyAdvisor;
  
  if (!hasContent) return null;
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Leadership & Team</h3>
      
      {presidentChairName && (
        <div className="mb-4 flex items-start">
          <Avatar className="h-8 w-8 mr-3 mt-0.5">
            <AvatarFallback className="bg-primary/10 text-primary">
              {presidentChairName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium text-sm">{presidentChairName}</h4>
            <p className="text-sm text-muted-foreground">President/Chair</p>
            {presidentChairContact && (
              <p className="text-xs text-muted-foreground mt-1">{presidentChairContact}</p>
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
            {Object.entries(executiveMembersRoles).map(([role, name], index) => (
              <div key={index} className="text-sm flex items-center">
                <span className="font-medium min-w-24 text-muted-foreground">{role}:</span>
                <span>{String(name)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {facultyAdvisors && facultyAdvisors.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2 flex items-center">
            <User className="h-4 w-4 mr-1.5" />
            Faculty Advisors
          </h4>
          <div className="flex flex-wrap gap-2">
            {facultyAdvisors.map((advisor, index) => (
              <span key={index} className="text-sm bg-secondary px-2 py-0.5 rounded-full">
                {advisor}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {primaryFacultyAdvisor && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2 flex items-center">
            <User className="h-4 w-4 mr-1.5" />
            Primary Faculty Advisor
          </h4>
          <div className="pl-1.5">
            <span className="text-sm">{primaryFacultyAdvisor}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadershipSection;
