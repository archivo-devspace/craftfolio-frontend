'use client';

import { useParams } from 'next/navigation';
import { usePortfolioStore } from '@/store/portfolioStore';
import { usePublicPortfolio } from '@/hooks';
import { SectionRenderer } from '@/components/sections';
import { LoadingScreen, ErrorScreen } from '@/components/ui';


export default function PreviewPage() {
  const params = useParams();
  const slug = params.slug as string;
  const name = params.name as string;
  const {  portfolio } = usePortfolioStore();
  const { isLoading, error } = usePublicPortfolio({ slug, name });

  // Apply theme as CSS variables
  const themeStyles = {
    '--theme-primary': portfolio.theme.primaryColor,
    '--theme-secondary': portfolio.theme.secondaryColor,
    '--theme-accent': portfolio.theme.accentColor,
    '--theme-background': portfolio.theme.backgroundColor,
    '--theme-text': portfolio.theme.textColor,
    '--theme-font': portfolio.theme.fontFamily,
  } as React.CSSProperties;

  // Use a copy for sorting to avoid mutating state directly in strict mode
  const sortedSections = [...portfolio.sections].sort((a, b) => a.order - b.order);

  if (isLoading) {
    return <LoadingScreen message="Loading Portfolio..." />;
  }

  if (error) {
    return <ErrorScreen message={error} />;
  }

  return (
    <main className="min-h-screen" style={themeStyles}>
      {sortedSections
        .filter((s) => s.visible)
        .map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
      {/* Attribution footer */}
      <footer className="py-6 text-center text-sm opacity-50 absolute bottom-0 w-full pointer-events-none">
        <p>Built with CraftFolio</p>
      </footer>
    </main>
  );
}
