
import React from 'react';
import { CircleDollarSign, Users, LogIn } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MembershipSectionProps {
  whoCanJoin?: string;
  membershipFee?: string;
  howToJoin?: string;
}

const MembershipSection: React.FC<MembershipSectionProps> = ({
  whoCanJoin,
  membershipFee,
  howToJoin
}) => {
  const hasContent = whoCanJoin || membershipFee || howToJoin;
  
  if (!hasContent) return null;
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Membership Details</h3>
        
        <div className="space-y-5">
          {whoCanJoin && (
            <div className="flex gap-3">
              <Users className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-sm mb-1">Who Can Join?</h4>
                <p className="text-sm text-muted-foreground">{whoCanJoin}</p>
              </div>
            </div>
          )}
          
          {membershipFee && (
            <div className="flex gap-3">
              <CircleDollarSign className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-sm mb-1">Membership Fee</h4>
                <p className="text-sm text-muted-foreground">{membershipFee}</p>
              </div>
            </div>
          )}
          
          {howToJoin && (
            <div className="flex gap-3">
              <LogIn className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium text-sm mb-1">How to Join</h4>
                <p className="text-sm text-muted-foreground">{howToJoin}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipSection;
