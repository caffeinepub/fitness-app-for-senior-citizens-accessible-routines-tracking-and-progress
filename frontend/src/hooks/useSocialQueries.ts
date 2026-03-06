import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Post, Comment, UserProfile } from '../backend';
import type { Principal } from '@dfinity/principal';

// ── User Profile ──────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserProfile(user: Principal | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return null;
      return actor.getUserProfile(user);
    },
    enabled: !!actor && !actorFetching && !!user,
  });
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export function useGetAllPosts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post[]>({
    queryKey: ['allPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPosts();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPost(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Post | null>({
    queryKey: ['post', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getPost(id);
    },
    enabled: !!actor && !actorFetching && id !== null,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, imageUrl }: { content: string; imageUrl: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(content, imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allPosts'] });
    },
  });
}

// ── Comments ──────────────────────────────────────────────────────────────────

export function useGetCommentsForPost(postId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Comment[]>({
    queryKey: ['commentsForPost', postId?.toString()],
    queryFn: async () => {
      if (!actor || postId === null) return [];
      return actor.getCommentsForPost(postId);
    },
    enabled: !!actor && !actorFetching && postId !== null,
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: bigint; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addComment(postId, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['commentsForPost', variables.postId.toString()] });
    },
  });
}

// ── Likes ─────────────────────────────────────────────────────────────────────

export function useGetLikeCount(postId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['likeCount', postId?.toString()],
    queryFn: async () => {
      if (!actor || postId === null) return BigInt(0);
      return actor.getLikeCount(postId);
    },
    enabled: !!actor && !actorFetching && postId !== null,
  });
}

export function useToggleLike() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleLike(postId);
    },
    onSuccess: (_data, postId) => {
      queryClient.invalidateQueries({ queryKey: ['likeCount', postId.toString()] });
    },
  });
}
