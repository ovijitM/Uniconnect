
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

interface BasicInfoTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
  universities: any[];
  isLoadingUniversities: boolean;
  clubCategories: string[];
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  universities,
  isLoadingUniversities,
  clubCategories
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Provide the essential details about your club</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Club Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter club name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleSelectChange(value, 'category')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {clubCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your club's purpose and activities"
            rows={4}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleInputChange}
              placeholder="A short slogan for your club"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="establishedYear">Established Year</Label>
            <Input
              id="establishedYear"
              name="establishedYear"
              type="number"
              value={formData.establishedYear}
              onChange={handleInputChange}
              placeholder="e.g., 2023"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="university">University *</Label>
          {isLoadingUniversities ? (
            <div className="flex items-center space-x-2">
              <Spinner size={16} />
              <span className="text-sm text-muted-foreground">Loading universities...</span>
            </div>
          ) : (
            <Select 
              value={formData.university} 
              onValueChange={(value) => handleSelectChange(value, 'university')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a university" />
              </SelectTrigger>
              <SelectContent>
                {universities.map((university) => (
                  <SelectItem key={university.id} value={university.id}>
                    {university.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="affiliation">Affiliation</Label>
          <Input
            id="affiliation"
            name="affiliation"
            value={formData.affiliation}
            onChange={handleInputChange}
            placeholder="Any department or organization your club is affiliated with"
          />
        </div>
      </CardContent>
    </>
  );
};

export default BasicInfoTab;
