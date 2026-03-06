import React from 'react';
import { ArrowLeft, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  useGetPost,
  useGetUserProfile,
  useGetCommentsForPost,
  useGetLikeCount,
  useToggleLike,
} from '../hooks/useSocialQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import CommentList from '../components/posts/CommentList';
import CommentForm from '../components/posts/CommentForm';
import { LoadingState, ErrorState } from '../components/feedback/QueryState';
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

interface PostDetailScreenProps {
  postId: bigint;
  onBack: () => void;
}

export default function PostDetailScreen({ postId, onBack }: PostDetailScreenProps) {
  const { identity } = useInternetIdentity();
  const { data: post, isLoading: postLoading, isError: postError } = useGetPost(postId);
  const { data: authorProfile, isLoading: authorLoading } = useGetUserProfile(post?.author ?? null);
  const { data: comments, isLoading: commentsLoading } = useGetCommentsForPost(postId);
  const { data: likeCount = BigInt(0) } = useGetLikeCount(postId);
  const toggleLike = useToggleLike();

  const displayName = authorProfile?.displayName ?? 'Anonymous';
  const avatarUrl = authorProfile?.avatarUrl ?? AVATAR_PLACEHOLDER;

  if (postLoading) return <LoadingState message="Loading post…" />;
  if (postError || !post) return <ErrorState message="Post not found." />;

  return (
    <section className="space-y-4">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-1.5" />
        Back to Feed
      </Button>

      {/* Post card */}
      <article className="bg-card rounded-2xl border border-border p-5 space-y-4">
        {/* Author */}
        <div className="flex items-center gap-3">
          {authorLoading ? (
            <>
              <Skeleton className="w-11 h-11 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </>
          ) : (
            <>
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-11 h-11 rounded-full object-cover border border-border"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = AVATAR_PLACEHOLDER;
                }}
              />
              <div>
                <p className="font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTime(post.timestamp)}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* Optional image */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post image"
            className="w-full rounded-xl object-cover max-h-80 border border-border"
          />
        )}

        {/* Like button */}
        <div className="flex items-center gap-2 pt-1 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => identity && toggleLike.mutate(postId)}
            disabled={!identity || toggleLike.isPending}
            className={`gap-2 ${identity ? 'hover:text-primary' : 'opacity-50 cursor-default'}`}
          >
            <Heart
              className={`w-4 h-4 ${toggleLike.isPending ? 'animate-pulse text-primary' : ''}`}
            />
            <span>{likeCount.toString()} {Number(likeCount) === 1 ? 'like' : 'likes'}</span>
          </Button>
        </div>
      </article>

      {/* Comments section */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <h3 className="font-semibold text-foreground">
          Comments {comments && comments.length > 0 ? `(${comments.length})` : ''}
        </h3>

        {identity && <CommentForm postId={postId} />}

        {commentsLoading ? (
          <LoadingState message="Loading comments…" />
        ) : (
          <CommentList comments={comments ?? []} />
        )}
      </div>
    </section>
  );
}
