
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ClubDialogTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ClubDialogTabs: React.FC<ClubDialogTabsProps> = ({ activeTab, onTabChange }) => {
  // Note: We don't handle tab change directly here to ensure validation happens
  // The active tab is managed by the parent component
  return (
    <Tabs value={activeTab} className="w-full" onValueChange={onTabChange}>
      <TabsList className="grid grid-cols-4 mb-4">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="social">Social</TabsTrigger>
        <TabsTrigger value="documents">Documents</TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ClubDialogTabs;
