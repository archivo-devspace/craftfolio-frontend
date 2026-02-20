'use client';

import { useEffect } from 'react';
import { Sidebar, Canvas } from '@/components/builder';
import { useAuthStore } from '@/store/authStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import {  usePortfolioData } from '@/hooks';
import { LoadingScreen } from '@/components/ui';

export default function Home() {
  const { checkAuth } = useAuthStore();
  const { portfolio } = usePortfolioStore();
  const { isLoading: isPortfolioLoading } = usePortfolioData();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Apply theme as CSS variables
  const themeStyles = {
    '--theme-primary': portfolio.theme.primaryColor,
    '--theme-secondary': portfolio.theme.secondaryColor,
    '--theme-accent': portfolio.theme.accentColor,
    '--theme-background': portfolio.theme.backgroundColor,
    '--theme-text': portfolio.theme.textColor,
    '--theme-font': portfolio.theme.fontFamily,
  } as React.CSSProperties;

  if (isPortfolioLoading) {
    return <LoadingScreen message="Loading Portfolio Builder..." />;
  }

  return (
    <main
      className="h-[100dvh] flex flex-col overflow-hidden lg:flex-row"
      style={themeStyles}
    >
      <Sidebar />
      <Canvas />
    </main>
  );
}
