import React from 'react';
import type { AppView } from '../../App';
import type { UserProfile } from '../../backend';
import SocialNav from '../nav/SocialNav';
import LoginButton from '../auth/LoginButton';
import { Heart } from 'lucide-react';

interface SocialLayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onNavigate: (view: AppView) => void;
  userProfile: UserProfile | null;
}

export default function SocialLayout({ children, activeView, onNavigate, userProfile }: SocialLayoutProps) {
  const appId = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'social-spark'
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => onNavigate('feed')}
            className="text-xl font-bold text-primary tracking-tight"
          >
            Social Spark
          </button>
          <div className="flex items-center gap-3">
            {userProfile && (
              <span className="text-sm text-muted-foreground hidden sm:block">
                {userProfile.displayName}
              </span>
            )}
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-4">
        {children}
      </main>

      {/* Bottom navigation */}
      <SocialNav activeView={activeView} onNavigate={onNavigate} />

      {/* Footer */}
      <footer className="bg-background border-t border-border py-4 pb-20 sm:pb-4">
        <div className="max-w-2xl mx-auto px-4 text-center text-xs text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Built with{' '}
            <Heart className="w-3 h-3 fill-primary text-primary" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Social Spark</p>
        </div>
      </footer>
    </div>
  );
}
