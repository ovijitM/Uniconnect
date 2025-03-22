
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { PencilLine, Calendar, RefreshCw, Image, Upload } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityPost {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  club_id: string;
}

interface ActivityPostsTabProps {
  clubId: string;
  activityPosts: ActivityPost[];
  isLoading: boolean;
  isSaving: boolean;
  onPostActivity: (title: string, content: string, imageUrl?: string) => Promise<void>;
  onRefresh: () => void;
}

const ActivityPostsTab: React.FC<ActivityPostsTabProps> = ({ 
  clubId, 
  activityPosts, 
  isLoading, 
  isSaving,
  onPostActivity,
  onRefresh
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    try {
      await onPostActivity(title, content, imageUrl.trim() || undefined);
      // Clear form after successful submission
      setTitle('');
      setContent('');
      setImageUrl('');
    } catch (error) {
      console.error('Error submitting activity post:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <PencilLine className="mr-2 h-5 w-5" />
            Post New Activity Update
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                placeholder="Activity Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Share your club's recent activity..."
                className="min-h-[120px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Image className="h-4 w-4" />
                <span className="text-sm">Image URL (optional)</span>
              </div>
              <Input
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Posting...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Post Activity
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Previous Activity Posts</h3>
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
      ) : activityPosts.length > 0 ? (
        <div className="space-y-4">
          {activityPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-lg">{post.title}</h4>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(post.created_at), 'PPP')}
                  </div>
                </div>
                <p className="text-muted-foreground whitespace-pre-line mb-4">{post.content}</p>
                {post.image_url && (
                  <div className="mt-2">
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      className="rounded-md max-h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                        e.currentTarget.classList.add("border");
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No activity posts yet. Share your first club activity!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivityPostsTab;
