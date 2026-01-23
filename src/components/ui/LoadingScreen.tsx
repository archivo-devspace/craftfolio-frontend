'use client';

import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <main className="h-screen flex items-center justify-center bg-obsidian">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-fog/60">{message}</p>
      </div>
    </main>
  );
}

interface ErrorScreenProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  return (
    <main className="h-screen flex items-center justify-center bg-obsidian text-fog">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Error</h1>
        <p className="text-fog/60 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </main>
  );
}
