import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useSaveCallerUserProfile } from '../../hooks/useSocialQueries';

interface ProfileSetupModalProps {
  onComplete: () => void;
}

export default function ProfileSetupModal({ onComplete }: ProfileSetupModalProps) {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const { mutateAsync: saveProfile, isPending, error } = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    try {
      await saveProfile({
        displayName: displayName.trim(),
        bio: bio.trim() || undefined,
        avatarUrl: undefined,
      });
      onComplete();
    } catch {
      // error shown via mutation state
    }
  };

  return (
    <Dialog open>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary" />
            <DialogTitle className="text-foreground">Welcome to Social Spark!</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Set up your profile to get started. You can update this anytime.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="displayName" className="text-foreground">
              Display Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              maxLength={50}
              required
              className="bg-background border-border focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-foreground">
              Bio <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little about yourself…"
              maxLength={160}
              rows={3}
              className="bg-background border-border focus:ring-primary resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : 'Failed to save profile. Please try again.'}
            </p>
          )}

          <Button
            type="submit"
            disabled={!displayName.trim() || isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
