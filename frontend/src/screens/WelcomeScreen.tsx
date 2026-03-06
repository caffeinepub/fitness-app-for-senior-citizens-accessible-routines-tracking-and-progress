import React from 'react';
import { Sparkles, Users, Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

const features = [
  {
    icon: Users,
    title: 'Connect',
    description: 'Share your thoughts and connect with others.',
  },
  {
    icon: Heart,
    title: 'Like & Engage',
    description: 'React to posts and show appreciation.',
  },
  {
    icon: MessageCircle,
    title: 'Discuss',
    description: 'Join conversations with comments.',
  },
];

export default function WelcomeScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold text-foreground">Social Spark</span>
        </div>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoggingIn ? 'Signing in…' : 'Sign In'}
        </Button>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-2xl mx-auto w-full">
        <img
          src="/assets/generated/social-hero.dim_800x400.png"
          alt="Social Spark hero illustration"
          className="w-full max-w-lg rounded-2xl mb-8 shadow-card"
        />
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
          Your spark starts{' '}
          <span className="text-primary">here</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Share moments, connect with people, and ignite conversations on Social Spark.
        </p>
        <Button
          onClick={login}
          disabled={isLoggingIn}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full"
        >
          {isLoggingIn ? 'Signing in…' : 'Get Started — Sign In'}
        </Button>
      </section>

      {/* Features */}
      <section className="px-6 py-12 bg-muted/30">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-card rounded-2xl border border-border p-6 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border">
        <p>
          Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'social-spark'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </p>
        <p className="mt-1">© {new Date().getFullYear()} Social Spark</p>
      </footer>
    </div>
  );
}
