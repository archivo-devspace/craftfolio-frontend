'use client';

import { HeroSection as HeroSectionType } from '@/types/portfolio';
import { useTheme, useScrollToSection } from '@/hooks';
import { UserRound } from 'lucide-react';

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
      className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden py-12 sm:py-16"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
        color: theme.textColor,
        ...themeStyles,
      }}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-6"
          style={{
            background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 40%)`,
          }}
        />

      

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-3"
          style={{
            backgroundImage: `
              linear-gradient(${theme.primaryColor} 1px, transparent 1px),
              linear-gradient(90deg, ${theme.primaryColor} 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Grid fade overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${theme.backgroundColor} 90%, ${theme.backgroundColor} 100%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto w-full">
      

        {/* Avatar with sophisticated glow */}
        <div className="mb-6 sm:mb-8 relative">
          {/* Multiple glow layers */}
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-20 animate-pulse"
            style={{
              background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 70%)`,
              transform: 'scale(1.8)',
              animationDuration: '3s',
            }}
          />
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-30"
            style={{
              background: `radial-gradient(circle, ${theme.accentColor} 0%, transparent 70%)`,
              transform: 'scale(1.4)',
            }}
          />

          {data.avatarUrl ? (
            <div
              className="inline-block relative"
              style={{ borderRadius: '50%' }}
            >
              <div
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-4"
                style={{
                  borderColor: `${theme.primaryColor}40`,
                }}
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
              className="inline-flex items-center justify-center w-28 h-28 sm:w-36 sm:h-36 relative shadow-2xl"
              style={{
                backgroundColor: `${theme.primaryColor}10`,
                borderRadius: '50%',
                border: `3px solid ${theme.primaryColor}30`,
              }}
            >
              <UserRound
                className="w-14 h-14 sm:w-20 sm:h-20"
                style={{ color: theme.primaryColor }}
              />
            </div>
          )}
        </div>

        {/* Name with gradient text effect */}
        <h1
          className="text-3xl sm:text-5xl md:text-7xl font-bold mb-3 sm:mb-4 tracking-tight leading-tight"
          style={{ color: theme.textColor }}
        >
          {data.name || (isEditing ? 'Your Name' : '')}
        </h1>

        {/* Title with accent */}
        <p
          className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 sm:mb-6"
          style={{ color: theme.primaryColor }}
        >
          {data.title || (isEditing ? 'Your Title' : '')}
        </p>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed opacity-70"
          style={{ color: theme.textColor }}
        >
          {data.subtitle || (isEditing ? 'Add a catchy subtitle' : '')}
        </p>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 group"
            style={{
              backgroundColor: theme.primaryColor,
              color: '#000',
              borderRadius: radius,
            }}
            onClick={scrollToProjects}
          >
            <span className="flex items-center gap-2">
              View Work
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </button>
          <button
            className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: 'transparent',
              color: theme.textColor,
              borderRadius: radius,

            }}
            onClick={scrollToContact}
          >
            Contact Me
          </button>
        </div>
       
      </div>

      {/* Scroll indicator */}
      <div
        className="mt-8 sm:mt-10"
        style={{ color: theme.primaryColor }}
      >
        <div className="flex flex-col items-center gap-2">
          <span
            className="text-xs uppercase tracking-widest opacity-40"
            style={{ color: theme.textColor }}
          >
            Scroll
          </span>
          <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center p-1">
            <div
              className="w-1.5 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: theme.primaryColor,
                animationDuration: '1.5s',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
