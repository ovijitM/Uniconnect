
import React from 'react';
import { Award, Gift, Trophy, Star } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface EventThemeAndPrizesProps {
  theme?: string;
  subTracks?: string[];
  prizePool?: string;
  prizeCategories?: string[];
  additionalPerks?: string[];
  judgingCriteria?: string[];
  judges?: string[];
}

const EventThemeAndPrizes: React.FC<EventThemeAndPrizesProps> = ({
  theme,
  subTracks,
  prizePool,
  prizeCategories,
  additionalPerks,
  judgingCriteria,
  judges
}) => {
  // Check if we have any data to display
  const hasData = theme || 
                 (subTracks && subTracks.length > 0) || 
                 prizePool || 
                 (prizeCategories && prizeCategories.length > 0) ||
                 (additionalPerks && additionalPerks.length > 0) ||
                 (judgingCriteria && judgingCriteria.length > 0) ||
                 (judges && judges.length > 0);
                 
  if (!hasData) return null;

  return (
    <div className="glass-panel rounded-xl p-6 space-y-6 mt-6">
      <h3 className="text-xl font-semibold">Event Theme & Prizes</h3>
      <Separator />
      
      <div className="space-y-6">
        {theme && (
          <div className="flex items-start gap-3">
            <Star className="w-5 h-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium">Main Theme</h4>
              <p className="text-muted-foreground">{theme}</p>
              
              {subTracks && subTracks.length > 0 && (
                <div className="mt-2">
                  <h5 className="text-sm font-medium">Sub-Tracks</h5>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {subTracks.map((track, index) => (
                      <span 
                        key={index} 
                        className="inline-block bg-secondary/50 text-xs rounded px-2 py-1"
                      >
                        {track}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {(prizePool || (prizeCategories && prizeCategories.length > 0)) && (
          <div className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-primary mt-1" />
            <div>
              {prizePool && (
                <>
                  <h4 className="font-medium">Total Prize Pool</h4>
                  <p className="text-muted-foreground">{prizePool}</p>
                </>
              )}
              
              {prizeCategories && prizeCategories.length > 0 && (
                <div className={prizePool ? "mt-2" : ""}>
                  <h5 className="text-sm font-medium">Prize Categories</h5>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-muted-foreground">
                    {prizeCategories.map((category, index) => (
                      <li key={index}>{category}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
        
        {additionalPerks && additionalPerks.length > 0 && (
          <div className="flex items-start gap-3">
            <Gift className="w-5 h-5 text-primary mt-1" />
            <div>
              <h4 className="font-medium">Additional Perks</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {additionalPerks.map((perk, index) => (
                  <span 
                    key={index} 
                    className="inline-block bg-secondary/50 text-xs rounded px-2 py-1"
                  >
                    {perk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {(judgingCriteria && judgingCriteria.length > 0) || (judges && judges.length > 0) ? (
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-primary mt-1" />
            <div>
              {judgingCriteria && judgingCriteria.length > 0 && (
                <>
                  <h4 className="font-medium">Judging Criteria</h4>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {judgingCriteria.map((criteria, index) => (
                      <span 
                        key={index} 
                        className="inline-block bg-secondary/50 text-xs rounded px-2 py-1"
                      >
                        {criteria}
                      </span>
                    ))}
                  </div>
                </>
              )}
              
              {judges && judges.length > 0 && (
                <div className={judgingCriteria && judgingCriteria.length > 0 ? "mt-2" : ""}>
                  <h5 className="text-sm font-medium">Judges</h5>
                  <p className="text-muted-foreground">{judges.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EventThemeAndPrizes;
