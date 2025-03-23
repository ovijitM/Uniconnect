
import React from 'react';
import StatCards from '../StatCards';

interface StatCardsSectionProps {
  activeEventCount: number;
  totalMembersCount: number;
  pastEventCount: number;
  averageAttendance: number;
  isLoading: boolean;
}

const StatCardsSection: React.FC<StatCardsSectionProps> = ({
  activeEventCount,
  totalMembersCount,
  pastEventCount,
  averageAttendance,
  isLoading
}) => {
  return (
    <StatCards
      activeEventCount={activeEventCount}
      totalMembersCount={totalMembersCount}
      pastEventCount={pastEventCount}
      averageAttendance={averageAttendance}
      isLoading={isLoading}
    />
  );
};

export default StatCardsSection;
