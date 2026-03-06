import React from 'react';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import type { Post } from '../../backend';
import { useGetUserProfile, useGetLikeCount, useToggleLike } from '../../hooks/useSocialQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

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

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  const { identity } = useInternetIdentity();
  const { data: authorProfile } = useGetUserProfile(post.author);
  const { data: likeCount = BigInt(0) } = useGetLikeCount(post.id);
  const toggleLike = useToggleLike();

  const displayName = authorProfile?.displayName ?? 'Anonymous';
  const avatarUrl = authorProfile?.avatarUrl ?? AVATAR_PLACEHOLDER;

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!identity) return;
    toggleLike.mutate(post.id);
  };

  return (
    <article
      onClick={onClick}
      className={`bg-card rounded-2xl border border-border p-4 space-y-3 transition-shadow ${
        onClick ? 'cursor-pointer hover:shadow-card-hover' : ''
      }`}
    >
      {/* Author row */}
      <div className="flex items-center gap-3">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover border border-border"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = AVATAR_PLACEHOLDER;
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(post.timestamp)}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {/* Optional image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post image"
          className="w-full rounded-xl object-cover max-h-64 border border-border"
        />
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-1">
        <button
          onClick={handleLike}
          disabled={!identity || toggleLike.isPending}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            identity
              ? 'text-muted-foreground hover:text-primary'
              : 'text-muted-foreground/50 cursor-default'
          }`}
          aria-label="Like post"
        >
          <Heart
            className={`w-4 h-4 ${toggleLike.isPending ? 'animate-pulse text-primary' : ''}`}
          />
          <span>{likeCount.toString()}</span>
        </button>

        <button
          onClick={onClick}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          aria-label="View comments"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Comment</span>
        </button>
      </div>
    </article>
  );
}
