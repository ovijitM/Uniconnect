
import React from 'react';
import ClubProfileSettings from '@/components/dashboard/ClubProfileSettings';

interface ProfileViewProps {
  clubs: any[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  onCreateClub: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  clubs,
  isLoading,
  onRefresh,
  onCreateClub
}) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Club Profile Settings</h1>
      {clubs.length > 0 ? (
        <ClubProfileSettings 
          club={clubs[0]} 
          onRefresh={onRefresh}
          isLoading={isLoading}
        />
      ) : (
        <div className="p-6 text-center bg-muted rounded-lg">
          <p>No clubs found. Create a club to manage its profile.</p>
          <button 
            onClick={onCreateClub}
            className="mt-4 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Create Club
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
