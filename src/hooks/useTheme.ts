import { useMemo } from 'react';
import { usePortfolioStore } from '@/store/portfolioStore';
import { PortfolioTheme, SectionType } from '@/types/portfolio';

export type BorderRadiusValue = 'none' | 'small' | 'medium' | 'large';

export const borderRadiusMap: Record<BorderRadiusValue, string> = {
  none: '0px',
  small: '4px',
  medium: '8px',
  large: '16px',
};

export const largeBorderRadiusMap: Record<BorderRadiusValue, string> = {
  none: '0px',
  small: '8px',
  medium: '16px',
  large: '24px',
};

export function useTheme() {
  const { portfolio } = usePortfolioStore();
  const { theme } = portfolio;

  const radius = borderRadiusMap[theme.borderRadius] || '8px';
  const largeRadius = largeBorderRadiusMap[theme.borderRadius] || '16px';

  const themeStyles = useMemo(
    () => ({
      '--theme-primary': theme.primaryColor,
      '--theme-secondary': theme.secondaryColor,
      '--theme-accent': theme.accentColor,
      '--theme-background': theme.backgroundColor,
      '--theme-text': theme.textColor,
      '--theme-radius': radius,
      '--theme-font': theme.fontFamily,
    }),
    [theme, radius]
  );

  return {
    theme,
    radius,
    largeRadius,
    themeStyles,
  };
}

export function useSectionVisibility(sectionId: string | null): boolean {
  const { portfolio } = usePortfolioStore();
  if (!sectionId) return false;
  const section = portfolio.sections.find((s) => s.id === sectionId);
  return section?.visible ?? false;
}

export function useScrollToSection(dataSectionType: string): () => void {
  return () => {
    const element = document.querySelector(`[data-section-type="${dataSectionType}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
}

export const sectionConfig: Record<
  SectionType,
  { label: string; icon: string; description: string }
> = {
  hero: {
    label: 'Hero',
    icon: 'Layout',
    description: 'Make a strong first impression with your hero section',
  },
  about: {
    label: 'About',
    icon: 'User',
    description: 'Share your story and background',
  },
  projects: {
    label: 'Projects',
    icon: 'FolderOpen',
    description: 'Showcase your best work',
  },
  skills: {
    label: 'Skills',
    icon: 'Code',
    description: 'Display your technical skills',
  },
  experience: {
    label: 'Experience',
    icon: 'Briefcase',
    description: 'Highlight your work history',
  },
  contact: {
    label: 'Contact',
    icon: 'Mail',
    description: 'Make it easy to get in touch',
  },
};

export const layoutOptions = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'masonry', label: 'Masonry' },
] as const;

export const displayStyleOptions = [
  { value: 'bars', label: 'Progress Bars' },
  { value: 'badges', label: 'Badges' },
  { value: 'circles', label: 'Circles' },
] as const;

export const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Raleway', label: 'Raleway' },
];

export const borderRadiusOptions = [
  { value: 'none' as const, label: 'Sharp (0)' },
  { value: 'small' as const, label: 'Small (4px)' },
  { value: 'medium' as const, label: 'Medium (8px)' },
  { value: 'large' as const, label: 'Large (16px)' },
];

export const presetThemes: { name: string; theme: Partial<PortfolioTheme> }[] = [
  {
    name: 'Midnight',
    theme: {
      primaryColor: '#28e98c',
      secondaryColor: '#28e98c',
      accentColor: '#28e98c',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
    },
  },
  {
    name: 'Ocean',
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#06b6d4',
      accentColor: '#22d3d1',
      backgroundColor: '#0c1222',
      textColor: '#e2e8f0',
    },
  },
  {
    name: 'Forest',
    theme: {
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      accentColor: '#34d399',
      backgroundColor: '#0f1f1a',
      textColor: '#ecfdf5',
    },
  },
  {
    name: 'Sunset',
    theme: {
      primaryColor: '#f97316',
      secondaryColor: '#ef4444',
      accentColor: '#fbbf24',
      backgroundColor: '#1c1410',
      textColor: '#fef3c7',
    },
  },
  {
    name: 'Rose',
    theme: {
      primaryColor: '#f43f5e',
      secondaryColor: '#28e98c',
      accentColor: '#fb7185',
      backgroundColor: '#1f1218',
      textColor: '#fce7f3',
    },
  },
  {
    name: 'Monochrome',
    theme: {
      primaryColor: '#a1a1aa',
      secondaryColor: '#71717a',
      accentColor: '#ffffff',
      backgroundColor: '#18181b',
      textColor: '#fafafa',
    },
  },
];
