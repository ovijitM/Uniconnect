
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { useClubDetail } from '@/components/club-detail/useClubDetail';
import ClubDetailSkeleton from '@/components/club-detail/ClubDetailSkeleton';
import ClubDetailNotFound from '@/components/club-detail/ClubDetailNotFound';
import ClubHeader from '@/components/club-detail/ClubHeader';
import ClubEventsTabs from '@/components/club-detail/ClubEventsTabs';
import ClubSidebar from '@/components/club-detail/ClubSidebar';

const ClubDetailPage: React.FC = () => {
  const {
    club,
    events,
    isLoading,
    isMember,
    relatedClubs,
    isAdmin,
    isClubAdmin,
    handleJoinClub
  } = useClubDetail();

  if (isLoading) {
    return <ClubDetailSkeleton />;
  }

  if (!club) {
    return <ClubDetailNotFound />;
  }

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/clubs" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clubs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ClubHeader 
            club={club} 
            isAdmin={isAdmin} 
            isClubAdmin={isClubAdmin} 
          />

          <div className="mb-10">
            <h2 className="text-xl font-medium mb-4">About</h2>
            <p className="text-muted-foreground whitespace-pre-line">{club.description}</p>
          </div>

          <div>
            <ClubEventsTabs events={events} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ClubSidebar
            club={club}
            events={events}
            isMember={isMember}
            handleJoinClub={handleJoinClub}
            relatedClubs={relatedClubs}
          />
        </motion.div>
      </div>
    </Layout>
  );
};

export default ClubDetailPage;
