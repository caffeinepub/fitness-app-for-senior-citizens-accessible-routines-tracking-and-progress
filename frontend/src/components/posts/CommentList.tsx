import React from 'react';
import { Clock } from 'lucide-react';
import type { Comment } from '../../backend';
import { useGetUserProfile } from '../../hooks/useSocialQueries';
import { Skeleton } from '@/components/ui/skeleton';

const AVATAR_PLACEHOLDER = '/assets/generated/avatar-placeholder.dim_128x128.png';

function formatTime(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function CommentItem({ comment }: { comment: Comment }) {
  const { data: authorProfile, isLoading } = useGetUserProfile(comment.author);

  const displayName = authorProfile?.displayName ?? 'Anonymous';
  const avatarUrl = authorProfile?.avatarUrl ?? AVATAR_PLACEHOLDER;

  return (
    <div className="flex gap-3 py-3 border-b border-border last:border-0">
      {isLoading ? (
        <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
      ) : (
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = AVATAR_PLACEHOLDER;
          }}
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          {isLoading ? (
            <Skeleton className="h-3.5 w-24" />
          ) : (
            <span className="text-sm font-semibold text-foreground">{displayName}</span>
          )}
          <span className="text-xs text-muted-foreground flex items-center gap-0.5">
            <Clock className="w-3 h-3" />
            {formatTime(comment.timestamp)}
          </span>
        </div>
        <p className="text-sm text-foreground mt-0.5 leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}

interface CommentListProps {
  comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-6">
        No comments yet. Be the first!
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {comments.map((comment) => (
        <CommentItem key={comment.id.toString()} comment={comment} />
      ))}
    </div>
  );
}
