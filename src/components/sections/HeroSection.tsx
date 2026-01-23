'use client';

import { HeroSection as HeroSectionType } from '@/types/portfolio';
import { useTheme, useScrollToSection } from '@/hooks';
import { Sparkles, ArrowDown, UserRound } from 'lucide-react';

interface Props {
  section: HeroSectionType;
  isEditing?: boolean;
}

export function HeroSection({ section, isEditing }: Props) {
  const { data } = section;
  const { theme, radius, themeStyles } = useTheme();
  const scrollToProjects = useScrollToSection('projects');
  const scrollToContact = useScrollToSection('contact');

  return (
    <div
      className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundColor: data.backgroundColor || theme.backgroundColor,
        fontFamily: theme.fontFamily,
        color: theme.textColor,
        ...themeStyles,
      }}
    >
      {/* Background Accent - using theme secondary color */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-5"
          style={{
            background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 70%)`,
            borderRadius: '0 0 0 100%',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-5"
          style={{
            background: `radial-gradient(circle, ${theme.accentColor} 0%, transparent 70%)`,
            borderRadius: '0 100% 0 0',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Avatar */}
        <div className="mb-8">
          {data.avatarUrl ? (
            <div
              className="inline-block p-1 shadow-2xl"
              style={{ borderRadius: '50%' }}
            >
              <div
                className="w-28 h-28 rounded-full overflow-hidden"
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
              className="inline-flex items-center justify-center size-40 shadow-lg"
              style={{
                backgroundColor: `${theme.primaryColor}15`,
                borderRadius: '50%',
              }}
            >
              <UserRound
               className="size-20"
               style={{ color: theme.primaryColor }}
              />
            </div>
          )}
        </div>

        {/* Name */}
        <h1
          className="text-4xl md:text-6xl font-bold mb-3 tracking-tight"
          style={{ color: theme.textColor }}
        >
          {data.name || (isEditing ? 'Your Name' : '')}
        </h1>

        {/* Title with accent color */}
        <p
          className="text-lg md:text-2xl font-medium mb-4"
          style={{ color: theme.primaryColor }}
        >
          {data.title || (isEditing ? 'Your Title' : '')}
        </p>

        {/* Subtitle */}
        <p
          className="text-base md:text-lg max-w-xl mx-auto mb-10 opacity-70"
          style={{ color: theme.textColor }}
        >
          {data.subtitle || (isEditing ? 'Add a catchy subtitle' : '')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            className="px-6 py-2.5 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            style={{
              backgroundColor: theme.primaryColor,
              color: '#000',
              borderRadius: radius,
            }}
            onClick={scrollToProjects}
          >
            View Work
          </button>
          <button
            className="px-6 py-2.5 font-semibold transition-all duration-200"
            style={{
              backgroundColor: 'transparent',
              color: theme.textColor,
              borderRadius: radius,
              border: `1px solid ${theme.textColor}30`,
            }}
            onClick={scrollToContact}
          >
            Contact Me
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        style={{ color: theme.textColor, opacity: 0.4 }}
      >
        <ArrowDown className="w-5 h-5" />
      </div>
    </div>
  );
}
