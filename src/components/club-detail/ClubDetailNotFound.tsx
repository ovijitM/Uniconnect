
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const ClubDetailNotFound: React.FC = () => {
  return (
    <Layout>
      <div className="text-center py-12">
        <h2 className="text-2xl font-medium mb-4">Club not found</h2>
        <p className="text-muted-foreground mb-6">
          The club you're looking for might have been removed or doesn't exist.
        </p>
        <Link to="/clubs">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clubs
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default ClubDetailNotFound;
