
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { ClubFormTabs, ClubFormButtons, clubCategories, clubFormFieldNames } from './components/club-form';
import { parseExecutiveMembersRoles } from '@/hooks/club-admin/utils/dataTransformUtils';
import { useQueryClient } from '@tanstack/react-query';

const CreateClubForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
    additionalNotes: '',
    presidentChairName: '',
    presidentChairContact: '',
    executiveMembersRoles: '',
    facultyAdvisors: '',
    primaryFacultyAdvisor: ''
  });

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
      // Optimize data preparation for better readability and maintenance
      const prepareClubData = () => {
        const regularEvents = formData.regularEvents 
          ? formData.regularEvents.split(',').map(e => e.trim()) 
          : null;
        
        const signatureEvents = formData.signatureEvents 
          ? formData.signatureEvents.split(',').map(e => e.trim()) 
          : null;
          
        return {
          basicInfo: {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            university: formData.university,
            university_id: formData.university,
            logo_url: formData.logoUrl,
          },
          details: {
            tagline: formData.tagline || null,
            established_year: formData.establishedYear ? parseInt(formData.establishedYear) : null,
            affiliation: formData.affiliation || null,
            why_join: formData.whyJoin || null,
            regular_events: regularEvents,
            signature_events: signatureEvents,
            community_engagement: formData.communityEngagement || null,
            who_can_join: formData.whoCanJoin || null,
            membership_fee: formData.membershipFee || 'Free',
            how_to_join: formData.howToJoin || null
          },
          leadership: {
            executive_members: {},
            president_chair_name: formData.presidentChairName || null,
            president_chair_contact: formData.presidentChairContact || null,
            executive_members_roles: formData.executiveMembersRoles 
              ? parseExecutiveMembersRoles(formData.executiveMembersRoles) 
              : null,
            faculty_advisors: formData.facultyAdvisors 
              ? formData.facultyAdvisors.split(',').map(a => a.trim()) 
              : null,
            primary_faculty_advisor: formData.primaryFacultyAdvisor || null,
          },
          contact: {
            phone_number: formData.phoneNumber || null,
            website: formData.social?.website || null,
            facebook_link: formData.social?.facebook || null,
            instagram_link: formData.social?.instagram || null,
            twitter_link: formData.social?.twitter || null,
            discord_link: formData.social?.discord || null,
            document_url: formData.documentUrl || null,
            document_name: formData.documentName || null,
          },
          misc: {
            student_count: formData.studentCount ? parseInt(formData.studentCount) : null,
            faculty_advisor: formData.facultyAdvisor || null,
            meeting_info: formData.meetingInfo || null,
            additional_notes: formData.additionalNotes || null,
          }
        };
      };
      
      // Step 1: Create club with required fields via RPC function
      const clubData = prepareClubData();
      const { data, error } = await supabase.rpc('insert_club', {
        name: clubData.basicInfo.name,
        description: clubData.basicInfo.description,
        category: clubData.basicInfo.category,
        university: clubData.basicInfo.university,
        university_id: clubData.basicInfo.university_id,
        logo_url: clubData.basicInfo.logo_url,
        club_admin_id: user.id
      });
      
      if (error) throw error;

      // Step 2: Update with additional information
      const clubId = data;
      console.log('Club created with ID:', clubId);
      
      // Spread all properties from prepared data
      const { error: updateError } = await supabase
        .from('clubs')
        .update({
          ...clubData.details,
          ...clubData.leadership,
          ...clubData.contact,
          ...clubData.misc
        })
        .eq('id', clubId);

      if (updateError) throw updateError;
      
      // Invalidate any cached queries related to clubs
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club-admin'] });
      
      toast({
        title: 'Club Created',
        description: 'Your club has been created successfully and is pending approval',
      });
      
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
