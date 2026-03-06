import React from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <AlertCircle className="w-8 h-8 text-destructive" />
      <p className="text-sm text-destructive font-medium">{message}</p>
    </div>
  );
}

export function EmptyState({
  title = 'Nothing here yet',
  description,
  illustration,
  children,
}: {
  title?: string;
  description?: string;
  illustration?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
      {illustration ?? <Inbox className="w-12 h-12 text-muted-foreground/50" />}
      <div className="space-y-1">
        <p className="font-semibold text-foreground">{title}</p>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-4 pt-1">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
