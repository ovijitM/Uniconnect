
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Code, 
  Music, 
  HeartPulse, 
  GraduationCap, 
  Brush, 
  Laptop, 
  Globe,
  Users,
  Dumbbell,
  BookOpen 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface PopularCategoriesSectionProps {
  categories: string[];
  isLoading?: boolean;
}

// Map of category names to icons
const categoryIcons: Record<string, React.ReactNode> = {
  'technology': <Code className="h-5 w-5" />,
  'arts': <Brush className="h-5 w-5" />,
  'music': <Music className="h-5 w-5" />,
  'health': <HeartPulse className="h-5 w-5" />,
  'education': <GraduationCap className="h-5 w-5" />,
  'science': <Lightbulb className="h-5 w-5" />,
  'engineering': <Laptop className="h-5 w-5" />,
  'business': <Users className="h-5 w-5" />,
  'sports': <Dumbbell className="h-5 w-5" />,
  'literature': <BookOpen className="h-5 w-5" />,
  'cultural': <Globe className="h-5 w-5" />,
};

// Default categories if none are provided
const defaultCategories = [
  'technology', 'arts', 'music', 'health', 'education', 
  'science', 'engineering', 'business', 'sports', 'literature'
];

const PopularCategoriesSection: React.FC<PopularCategoriesSectionProps> = ({ 
  categories = [],
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl p-6 border">
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  // Get unique categories, then get the top categories (preference to known ones with icons)
  const uniqueCategories = [...new Set(categories)];
  
  // Prioritize categories that have icons defined
  const categoriesWithIcons = uniqueCategories.filter(cat => 
    Object.keys(categoryIcons).includes(cat.toLowerCase())
  );
  
  // Add default categories if we don't have enough
  const displayCategories = categoriesWithIcons.length >= 5 
    ? categoriesWithIcons.slice(0, 10) 
    : [...categoriesWithIcons, ...defaultCategories.filter(cat => 
        !categoriesWithIcons.includes(cat)
      )].slice(0, 10);

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 border">
      <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {displayCategories.map((category, index) => {
          const icon = categoryIcons[category.toLowerCase()] || <Globe className="h-5 w-5" />;
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link to={`/clubs?category=${category}`}>
                <Card className="hover:bg-accent transition-colors">
                  <CardContent className="p-3 flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3 text-primary">
                      {icon}
                    </div>
                    <span className="capitalize">{category}</span>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default PopularCategoriesSection;
