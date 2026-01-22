'use client';

import { HeroSection as HeroSectionType } from '@/types/portfolio';
import { useTheme, useScrollToSection } from '@/hooks';
import { Sparkles } from 'lucide-react';

interface Props {
  section: HeroSectionType;
  isEditing?: boolean;
}

export function HeroSection({ section, isEditing }: Props) {
  const { data } = section;
  const { theme, radius, themeStyles } = useTheme();
  const scrollToProjects = useScrollToSection('projects');
  const scrollToContact = useScrollToSection('contact');

  const getBackgroundStyle = () => {
    if (data.backgroundStyle === 'gradient') {
      const colors = data.gradientColors.length > 0
        ? data.gradientColors
        : [theme.primaryColor, theme.secondaryColor, theme.accentColor];
      return {
        background: `linear-gradient(135deg, ${colors.join(', ')})`,
      };
    }
    return { backgroundColor: data.backgroundColor || theme.backgroundColor };
  };

  return (
    <div
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
      style={{
        ...getBackgroundStyle(),
        fontFamily: theme.fontFamily,
        color: theme.textColor,
        ...themeStyles,
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Avatar */}
        {data.avatarUrl ? (
          <div className="mb-8 inline-block">
            <div
              className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl"
              style={{ borderRadius: radius }}
            >
              <img
                src={data.avatarUrl}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div
            className="mb-8 inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/10 ring-4 ring-white/20"
            style={{ borderRadius: radius }}
          >
            <Sparkles className="w-12 h-12 text-white/60" />
          </div>
        )}

        {/* Name */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          {data.name || (isEditing ? 'Your Name' : '')}
        </h1>

        {/* Title */}
        <p className="text-2xl md:text-3xl text-white/80 font-medium mb-4">
          {data.title || (isEditing ? 'Your Title' : '')}
        </p>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-8">
          {data.subtitle || (isEditing ? 'Add a catchy subtitle' : '')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            className="px-8 py-3 bg-white text-gray-900 font-semibold hover:bg-white/90 transition-all hover:scale-105 shadow-lg"
            style={{ borderRadius: radius }}
            onClick={scrollToProjects}
          >
            View Work
          </button>
          <button
            className="px-8 py-3 bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/20"
            style={{ borderRadius: radius }}
            onClick={scrollToContact}
          >
            Contact Me
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 animate-bounce">
        <div
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          style={{ borderRadius: radius }}
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </div>
  );
}
