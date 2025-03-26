
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { ClubFormTabs, ClubFormButtons, clubCategories } from './components/club-form';

const CreateClubForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [universities, setUniversities] = useState<any[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    university: '',
    contactEmail: '',
    contactPhone: '',
    logoUrl: '',
    mission: '',
    tagline: '',
    establishedYear: '',
    affiliation: '',
    whyJoin: '',
    regularEvents: '',
    signatureEvents: '',
    communityEngagement: '',
    whoCanJoin: '',
    membershipFee: '',
    howToJoin: '',
    presidentName: '',
    presidentContact: '',
    executiveMembers: '',
    advisors: '',
    phoneNumber: '',
    website: '',
    social: {
      website: '',
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      discord: ''
    },
    documentUrl: '',
    documentName: '',
    studentCount: '',
    facultyAdvisor: '',
    meetingInfo: '',
    additionalNotes: ''
  });

  // Fetch universities when the component mounts
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        setUniversities(data || []);
      } catch (error) {
        console.error('Error fetching universities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load universities. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingUniversities(false);
      }
    };

    fetchUniversities();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (url: string, fileName: string) => {
    setFormData(prev => ({ ...prev, logoUrl: url }));
    toast({
      title: 'Logo Uploaded',
      description: 'Club logo has been uploaded successfully',
    });
  };

  const handleDocumentUpload = (url: string, fileName: string) => {
    setFormData(prev => ({ 
      ...prev, 
      documentUrl: url,
      documentName: fileName
    }));
    toast({
      title: 'Document Uploaded',
      description: 'Club document has been uploaded successfully',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create a club',
        variant: 'destructive',
      });
      return;
    }

    // Validate form
    if (!formData.name || !formData.description || !formData.category || !formData.university) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare social media links for database
      const socialMediaLinks = {
        website: formData.social.website,
        instagram: formData.social.instagram,
        facebook: formData.social.facebook,
        twitter: formData.social.twitter,
        linkedin: formData.social.linkedin,
        discord: formData.social.discord
      };

      // Prepare executive members structure (simple JSON for now)
      const executiveMembers = formData.executiveMembers 
        ? { members: formData.executiveMembers.split(',').map(m => m.trim()) } 
        : null;

      // Prepare advisors array
      const advisors = formData.advisors 
        ? formData.advisors.split(',').map(a => a.trim()) 
        : null;

      // Prepare regular events array
      const regularEvents = formData.regularEvents 
        ? formData.regularEvents.split(',').map(e => e.trim()) 
        : null;
      
      // Prepare signature events array
      const signatureEvents = formData.signatureEvents 
        ? formData.signatureEvents.split(',').map(e => e.trim()) 
        : null;
      
      // Insert club data
      const { data, error } = await supabase.rpc('insert_club', {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        university: formData.university,
        university_id: formData.university,
        logo_url: formData.logoUrl,
        club_admin_id: user.id
      });
      
      if (error) throw error;

      // Update additional fields
      const clubId = data;
      const { error: updateError } = await supabase
        .from('clubs')
        .update({
          tagline: formData.tagline || null,
          established_year: formData.establishedYear ? parseInt(formData.establishedYear) : null,
          affiliation: formData.affiliation || null,
          why_join: formData.whyJoin || null,
          regular_events: regularEvents,
          signature_events: signatureEvents,
          community_engagement: formData.communityEngagement || null,
          who_can_join: formData.whoCanJoin || null,
          membership_fee: formData.membershipFee || 'Free',
          how_to_join: formData.howToJoin || null,
          president_name: formData.presidentName || null,
          president_contact: formData.presidentContact || null,
          executive_members: executiveMembers,
          advisors: advisors,
          phone_number: formData.phoneNumber || null,
          website: formData.social.website || null,
          facebook_link: formData.social.facebook || null,
          instagram_link: formData.social.instagram || null,
          twitter_link: formData.social.twitter || null,
          discord_link: formData.social.discord || null,
          document_url: formData.documentUrl || null,
          document_name: formData.documentName || null,
          // Add missing fields from other tabs
          student_count: formData.studentCount ? parseInt(formData.studentCount) : null,
          faculty_advisor: formData.facultyAdvisor || null,
          meeting_info: formData.meetingInfo || null
        })
        .eq('id', clubId);

      if (updateError) throw updateError;
      
      toast({
        title: 'Club Created',
        description: 'Your club has been created successfully and is pending approval',
      });
      
      // Redirect to the club admin dashboard
      navigate('/club-admin-dashboard');
      
    } catch (error: any) {
      console.error('Error creating club:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create club. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create a New Club</h1>
          
          <form onSubmit={handleSubmit}>
            <ClubFormTabs
              formData={formData}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              handleLogoUpload={handleLogoUpload}
              handleDocumentUpload={handleDocumentUpload}
              universities={universities}
              isLoadingUniversities={isLoadingUniversities}
              clubCategories={clubCategories}
            />
            
            <ClubFormButtons
              isSubmitting={isSubmitting}
              onCancel={() => navigate('/club-admin-dashboard')}
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateClubForm;
