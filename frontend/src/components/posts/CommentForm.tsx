import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAddComment } from '../../hooks/useSocialQueries';

interface CommentFormProps {
  postId: bigint;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const { mutateAsync: addComment, isPending, error } = useAddComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await addComment({ postId, content: content.trim() });
      setContent(''); // clear on success
    } catch {
      // error shown via mutation state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment…"
        rows={2}
        maxLength={500}
        className="bg-background border-border resize-none focus:ring-primary text-sm"
        disabled={isPending}
      />
      {error && (
        <p className="text-xs text-destructive">
          {error instanceof Error ? error.message : 'Failed to post comment.'}
        </p>
      )}
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={!content.trim() || isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              Posting…
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Post
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
