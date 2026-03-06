import React from 'react';
import { Home, PlusSquare, User } from 'lucide-react';
import type { AppView } from '../../App';

interface SocialNavProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

const navItems = [
  { id: 'feed' as AppView, label: 'Feed', icon: Home },
  { id: 'create-post' as AppView, label: 'Post', icon: PlusSquare },
  { id: 'profile' as AppView, label: 'Profile', icon: User },
];

export default function SocialNav({ activeView, onNavigate }: SocialNavProps) {
  // post-detail is part of the feed flow, so highlight Feed tab
  const effectiveView = activeView === 'post-detail' ? 'feed' : activeView;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t border-border sm:relative sm:bottom-auto sm:border-t-0 sm:border-b sm:border-border">
      <div className="max-w-2xl mx-auto flex">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = effectiveView === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium transition-colors relative
                ${isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
              <Icon
                className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`}
              />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
