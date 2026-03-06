import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useSocialQueries';
import SocialLayout from './components/layout/SocialLayout';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import WelcomeScreen from './screens/WelcomeScreen';
import FeedScreen from './screens/FeedScreen';
import CreatePostScreen from './screens/CreatePostScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import ProfileScreen from './screens/ProfileScreen';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export type AppView = 'feed' | 'create-post' | 'post-detail' | 'profile';

function AppContent() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [activeView, setActiveView] = useState<AppView>('feed');
  const [selectedPostId, setSelectedPostId] = useState<bigint | null>(null);

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleNavigate = (view: AppView, postId?: bigint) => {
    setActiveView(view);
    if (postId !== undefined) setSelectedPostId(postId);
  };

  if (!isAuthenticated) {
    return <WelcomeScreen />;
  }

  return (
    <SocialLayout
      activeView={activeView}
      onNavigate={handleNavigate}
      userProfile={userProfile ?? null}
    >
      {showProfileSetup && (
        <ProfileSetupModal
          onComplete={() => {
            // Profile saved, query will auto-refresh
          }}
        />
      )}

      {activeView === 'feed' && (
        <FeedScreen onPostClick={(postId) => handleNavigate('post-detail', postId)} />
      )}
      {activeView === 'create-post' && (
        <CreatePostScreen onPostCreated={() => handleNavigate('feed')} />
      )}
      {activeView === 'post-detail' && selectedPostId !== null && (
        <PostDetailScreen
          postId={selectedPostId}
          onBack={() => handleNavigate('feed')}
        />
      )}
      {activeView === 'profile' && (
        <ProfileScreen onPostClick={(postId) => handleNavigate('post-detail', postId)} />
      )}
    </SocialLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
