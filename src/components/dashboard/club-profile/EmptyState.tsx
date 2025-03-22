
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';

const EmptyState: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>Club Profile Settings</CardTitle>
        <CardDescription>No club selected</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Please select a club to edit its profile.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
