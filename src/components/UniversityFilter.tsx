
import React from 'react';
import { Button } from '@/components/ui/button';
import { University } from '@/types';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { School } from 'lucide-react';

interface UniversityFilterProps {
  universities: University[];
  selectedUniversity: string | null;
  onSelect: (university: string | null) => void;
  isLoading: boolean;
  className?: string;
}

const UniversityFilter: React.FC<UniversityFilterProps> = ({ 
  universities, 
  selectedUniversity, 
  onSelect,
  isLoading,
  className = ''
}) => {
  const handleChange = (value: string) => {
    onSelect(value === 'all' ? null : value);
  };

  const handleClear = () => {
    onSelect(null);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <Select 
          value={selectedUniversity || 'all'} 
          onValueChange={handleChange}
          disabled={isLoading}
        >
          <SelectTrigger className="pl-8">
            <School className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <SelectValue placeholder="Filter by university" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Universities</SelectItem>
            {universities.map((university) => (
              <SelectItem key={university.id} value={university.name}>
                {university.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedUniversity && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClear}
          disabled={isLoading}
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default UniversityFilter;
