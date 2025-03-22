
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Megaphone, Calendar, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  club_id: string;
}

interface AnnouncementsTabProps {
  clubId: string;
  announcements: Announcement[];
  isLoading: boolean;
  onPostAnnouncement: (title: string, content: string) => Promise<void>;
  onRefresh: () => void;
}

const AnnouncementsTab: React.FC<AnnouncementsTabProps> = ({ 
  clubId, 
  announcements, 
  isLoading, 
  onPostAnnouncement,
  onRefresh
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    setIsSending(true);
    try {
      await onPostAnnouncement(title, content);
      // Clear form after successful submission
      setTitle('');
      setContent('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Megaphone className="mr-2 h-5 w-5" />
            Post New Announcement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Announcement Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Write your announcement here..."
                className="min-h-[120px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSending}>
                {isSending ? 'Posting...' : 'Post Announcement'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Previous Announcements</h3>
        <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-muted/50">
              <CardContent className="p-6 h-40"></CardContent>
            </Card>
          ))}
        </div>
      ) : announcements.length > 0 ? (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-lg">{announcement.title}</h4>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(announcement.created_at), 'PPP')}
                  </div>
                </div>
                <p className="text-muted-foreground whitespace-pre-line">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No announcements yet. Post your first announcement!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnnouncementsTab;
