
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle>Club Profile Settings</CardTitle>
        <CardDescription>Loading profile data...</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
};

export default LoadingState;
