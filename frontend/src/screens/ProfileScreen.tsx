import React, { useState, useEffect } from 'react';
import { Loader2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
  useGetAllPosts,
} from '../hooks/useSocialQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import PostCard from '../components/posts/PostCard';
import { LoadingState, EmptyState, PostCardSkeleton } from '../components/feedback/QueryState';

const AVATAR_PLACEHOLDER = '/assets/generated/avatar-placeholder.dim_128x128.png';

interface ProfileScreenProps {
  onPostClick: (postId: bigint) => void;
}

export default function ProfileScreen({ onPostClick }: ProfileScreenProps) {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: allPosts, isLoading: postsLoading } = useGetAllPosts();
  const { mutateAsync: saveProfile, isPending: savePending, error: saveError, isSuccess: saveSuccess } = useSaveCallerUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');

  // Pre-fill form when entering edit mode
  useEffect(() => {
    if (isEditing && userProfile) {
      setEditName(userProfile.displayName);
      setEditBio(userProfile.bio ?? '');
    }
  }, [isEditing, userProfile]);

  const myPrincipal = identity?.getPrincipal().toString();
  const myPosts = allPosts?.filter((p) => p.author.toString() === myPrincipal) ?? [];

  const avatarUrl = userProfile?.avatarUrl ?? AVATAR_PLACEHOLDER;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    try {
      await saveProfile({
        displayName: editName.trim(),
        bio: editBio.trim() || undefined,
        avatarUrl: userProfile?.avatarUrl,
      });
      setIsEditing(false);
    } catch {
      // error shown via mutation state
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (profileLoading) return <LoadingState message="Loading profile…" />;

  return (
    <section className="space-y-6">
      {/* Profile header */}
      <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
        <div className="flex items-start gap-4">
          <img
            src={avatarUrl}
            alt={userProfile?.displayName ?? 'Profile'}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = AVATAR_PLACEHOLDER;
            }}
          />
          <div className="flex-1 min-w-0">
            {!isEditing ? (
              <>
                <h2 className="text-xl font-bold text-foreground">
                  {userProfile?.displayName ?? 'Anonymous'}
                </h2>
                {userProfile?.bio && (
                  <p className="text-sm text-muted-foreground mt-1">{userProfile.bio}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {myPosts.length} {myPosts.length === 1 ? 'post' : 'posts'}
                </p>
              </>
            ) : null}
          </div>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="border-border hover:border-primary hover:text-primary flex-shrink-0"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1.5" />
              Edit
            </Button>
          )}
        </div>

        {/* Edit form */}
        {isEditing && (
          <form onSubmit={handleSave} className="space-y-3 border-t border-border pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="editName" className="text-foreground text-sm">
                Display Name
              </Label>
              <Input
                id="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={50}
                required
                className="bg-background border-border focus:ring-primary"
                disabled={savePending}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="editBio" className="text-foreground text-sm">
                Bio
              </Label>
              <Textarea
                id="editBio"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                maxLength={160}
                rows={2}
                placeholder="Tell us about yourself…"
                className="bg-background border-border resize-none focus:ring-primary"
                disabled={savePending}
              />
            </div>

            {saveError && (
              <p className="text-sm text-destructive">
                {saveError instanceof Error ? saveError.message : 'Failed to save profile.'}
              </p>
            )}
            {saveSuccess && (
              <p className="text-sm text-green-600 dark:text-green-400">Profile saved!</p>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={!editName.trim() || savePending}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {savePending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    Save
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={savePending}
                className="border-border"
              >
                <X className="w-3.5 h-3.5 mr-1.5" />
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* My posts */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">My Posts</h3>

        {postsLoading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : myPosts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            description="Share your first post with the world!"
          />
        ) : (
          <div className="space-y-4">
            {myPosts.map((post) => (
              <PostCard
                key={post.id.toString()}
                post={post}
                onClick={() => onPostClick(post.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
