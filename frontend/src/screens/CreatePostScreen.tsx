import React, { useState } from 'react';
import { Loader2, ImageIcon, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreatePost } from '../hooks/useSocialQueries';

const MAX_CONTENT = 500;

interface CreatePostScreenProps {
  onPostCreated: () => void;
}

export default function CreatePostScreen({ onPostCreated }: CreatePostScreenProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const { mutateAsync: createPost, isPending, error } = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await createPost({ content: content.trim(), imageUrl: imageUrl.trim() || null });
      setContent('');
      setImageUrl('');
      onPostCreated();
    } catch {
      // error shown via mutation state
    }
  };

  const remaining = MAX_CONTENT - content.length;

  return (
    <section className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">Create Post</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="content" className="text-foreground">
            What's on your mind?
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share something with the world…"
            rows={5}
            maxLength={MAX_CONTENT}
            className="bg-background border-border resize-none focus:ring-primary"
            disabled={isPending}
          />
          <p className={`text-xs text-right ${remaining < 50 ? 'text-destructive' : 'text-muted-foreground'}`}>
            {remaining} characters remaining
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="imageUrl" className="text-foreground flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4" />
            Image URL <span className="text-muted-foreground text-xs">(optional)</span>
          </Label>
          <Input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="bg-background border-border focus:ring-primary"
            disabled={isPending}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : 'Failed to create post. Please try again.'}
          </p>
        )}

        <Button
          type="submit"
          disabled={!content.trim() || isPending}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Posting…
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Share Post
            </>
          )}
        </Button>
      </form>
    </section>
  );
}
