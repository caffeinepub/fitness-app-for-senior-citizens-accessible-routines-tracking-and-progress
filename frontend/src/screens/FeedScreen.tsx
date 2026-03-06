import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllPosts } from '../hooks/useSocialQueries';
import PostCard from '../components/posts/PostCard';
import { LoadingState, ErrorState, EmptyState, PostCardSkeleton } from '../components/feedback/QueryState';

interface FeedScreenProps {
  onPostClick: (postId: bigint) => void;
}

export default function FeedScreen({ onPostClick }: FeedScreenProps) {
  const { data: posts, isLoading, isError, refetch, isFetching } = useGetAllPosts();

  return (
    <section className="space-y-4">
      {/* Feed header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Feed</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-muted-foreground hover:text-primary"
          aria-label="Refresh feed"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {isError && !isLoading && (
        <ErrorState message="Failed to load posts. Please try refreshing." />
      )}

      {/* Empty state */}
      {!isLoading && !isError && posts?.length === 0 && (
        <EmptyState
          title="No posts yet"
          description="Be the first to share something!"
          illustration={
            <img
              src="/assets/generated/empty-feed.dim_400x300.png"
              alt="Empty feed illustration"
              className="w-48 h-auto opacity-80"
            />
          }
        />
      )}

      {/* Posts list */}
      {!isLoading && !isError && posts && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id.toString()}
              post={post}
              onClick={() => onPostClick(post.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
