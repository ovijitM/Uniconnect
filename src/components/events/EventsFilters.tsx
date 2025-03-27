
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

interface EventsFiltersProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  clearFilters: () => void;
}

const EventsFilters = ({
  categories,
  selectedCategories,
  toggleCategory,
  selectedStatus,
  setSelectedStatus,
  clearFilters
}: EventsFiltersProps) => {
  const hasActiveFilters = selectedCategories.length > 0 || selectedStatus !== 'all';
  
  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-8 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Status</h4>
          <div className="grid grid-cols-3 gap-2">
            {['all', 'upcoming', 'ongoing', 'past'].map(status => (
              <Badge
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                className="cursor-pointer capitalize"
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategories.includes(category) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                {category}
              </Badge>
            ))}
            {categories.length === 0 && (
              <p className="text-xs text-muted-foreground">No categories available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsFilters;
