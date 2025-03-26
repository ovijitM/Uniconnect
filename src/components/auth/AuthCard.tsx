
import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footerContent?: ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ 
  title, 
  subtitle, 
  children, 
  footerContent 
}) => {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <Logo className="mx-auto h-6 w-6" />
          <CardTitle className="text-2xl font-semibold tracking-tight">{title}</CardTitle>
          {subtitle && (
            <CardDescription className="text-sm text-muted-foreground">
              {subtitle}
            </CardDescription>
          )}
        </div>
        <Card>
          <CardContent className="pt-6">
            {children}
          </CardContent>
          {footerContent && (
            <CardFooter className="flex flex-col space-y-4 border-t px-6 py-4">
              {footerContent}
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AuthCard;
