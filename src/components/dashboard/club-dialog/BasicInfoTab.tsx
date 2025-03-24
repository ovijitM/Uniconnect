
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { School } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface BasicInfoTabProps {
  formData: {
    name: string;
    description: string;
    category: string;
    tagline?: string;
    university?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, onInputChange }) => {
  const [universities, setUniversities] = useState<{ id: string, name: string }[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchUniversities = async () => {
      setIsLoadingUniversities(true);
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setUniversities(data || []);
      } catch (error) {
        console.error('Error fetching universities:', error);
      } finally {
        setIsLoadingUniversities(false);
      }
    };

    fetchUniversities();
  }, []);

  const handleUniversityChange = (value: string) => {
    const event = {
      target: {
        name: 'university',
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(event);
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="name">Club Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g., Computer Science Club"
          value={formData.name}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          name="tagline"
          placeholder="A short catchy phrase for your club"
          value={formData.tagline}
          onChange={onInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          name="category"
          placeholder="e.g., Academic, Sports, Arts"
          value={formData.category}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="university">University *</Label>
        <Select 
          value={formData.university || (user?.university || '')} 
          onValueChange={handleUniversityChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select university" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingUniversities ? (
              <SelectItem value="loading" disabled>Loading universities...</SelectItem>
            ) : (
              universities.map((uni) => (
                <SelectItem key={uni.id} value={uni.name}>
                  {uni.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          This associates your club with a specific university
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe your club and its purpose"
          value={formData.description}
          onChange={onInputChange}
          required
          rows={4}
        />
      </div>
    </div>
  );
};

export default BasicInfoTab;
