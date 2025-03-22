
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';

interface BasicInfoTabProps {
  profileData: {
    name: string;
    description: string;
    category: string;
    tagline: string;
    logoUrl: string;
    establishedYear: string;
    affiliation: string;
    [key: string]: any;
  };
  setProfileData: React.Dispatch<React.SetStateAction<any>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isSaving: boolean;
  handleSave: () => void;
}

const categories = [
  'Academic',
  'Arts & Culture',
  'Community Service',
  'Engineering',
  'Environmental',
  'Gaming',
  'Health & Wellness',
  'Hobby & Special Interest',
  'Media & Publications',
  'Professional & Career',
  'Social & Cultural',
  'Sports & Recreation',
  'Technology',
  'Other'
];

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ 
  profileData, 
  setProfileData, 
  handleInputChange, 
  isSaving,
  handleSave 
}) => {
  // Handle select for category
  const handleCategoryChange = (value: string) => {
    setProfileData(prev => ({
      ...prev,
      category: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Club Name</Label>
        <Input
          id="name"
          name="name"
          value={profileData.name}
          onChange={handleInputChange}
          placeholder="Full name of your club or organization"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={profileData.description}
          onChange={handleInputChange}
          placeholder="Describe your club's mission and activities"
          className="min-h-[150px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={profileData.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            name="tagline"
            value={profileData.tagline || ''}
            onChange={handleInputChange}
            placeholder="A short, catchy phrase describing your club"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            name="logoUrl"
            value={profileData.logoUrl || ''}
            onChange={handleInputChange}
            placeholder="URL to your club's logo image"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="establishedYear">Year Established</Label>
          <Input
            id="establishedYear"
            name="establishedYear"
            value={profileData.establishedYear || ''}
            onChange={handleInputChange}
            placeholder="When was your club founded? (e.g. 2020)"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="affiliation">Affiliation</Label>
        <Input
          id="affiliation"
          name="affiliation"
          value={profileData.affiliation || ''}
          onChange={handleInputChange}
          placeholder="Department, national organization, etc."
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Basic Info
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoTab;
