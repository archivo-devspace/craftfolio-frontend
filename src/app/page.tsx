'use client';

import { useEffect, useState } from 'react';
import { Sidebar, Canvas } from '@/components/builder';
import { useAuthStore } from '@/store/authStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { checkAuth } = useAuthStore();
  const { loadPortfolio, portfolio } = usePortfolioStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Check if user is authenticated
      await checkAuth();

      // If authenticated, fetch their portfolios
      if (api.getToken()) {
        const result = await api.getPortfolios();
        if (result.data && result.data.length > 0) {
          const latestPortfolio = result.data[0];
          loadPortfolio({
            id: latestPortfolio.id,
            name: latestPortfolio.name,
            slug: latestPortfolio.slug,
            published: latestPortfolio.published,
            theme: latestPortfolio.theme as unknown as import('@/types/portfolio').PortfolioTheme,
            sections: latestPortfolio.sections as unknown as import('@/types/portfolio').Section[],
          });
          console.log('✅ Auto-loaded portfolio:', latestPortfolio.name);
        }
      }

      setIsLoading(false);
    };

    initializeApp();
  }, []);

  // Map border radius to actual values
  const borderRadiusMap = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '16px',
  };

  // Apply theme as CSS variables
  const themeStyles = {
    '--theme-primary': portfolio.theme.primaryColor,
    '--theme-secondary': portfolio.theme.secondaryColor,
    '--theme-accent': portfolio.theme.accentColor,
    '--theme-background': portfolio.theme.backgroundColor,
    '--theme-text': portfolio.theme.textColor,
    '--theme-radius': borderRadiusMap[portfolio.theme.borderRadius] || '8px',
    '--theme-font': portfolio.theme.fontFamily,
  } as React.CSSProperties;

  if (isLoading) {
    return (
      <main className="h-screen flex items-center justify-center bg-obsidian">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-electric-violet mx-auto mb-4" />
          <p className="text-fog/60">Loading Portfolio Builder...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen flex overflow-hidden" style={themeStyles}>
      <Sidebar />
      <Canvas />
    </main>
  );
}
