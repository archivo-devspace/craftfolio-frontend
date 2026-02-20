'use client';

import { AboutSection as AboutSectionType } from '@/types/portfolio';
import { useTheme } from '@/hooks';
import { User } from 'lucide-react';
import Image from 'next/image';

interface Props {
  section: AboutSectionType;
  isEditing?: boolean;
}

export function AboutSection({ section, isEditing }: Props) {
  const { data } = section;
  const { theme, radius, themeStyles } = useTheme();

  return (
    <section
      className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 relative overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        ...themeStyles,
      }}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-6"
          style={{
            background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 40%)`,
          }}
        />
        {/* Corner accents */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] opacity-8"
          style={{
            background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 60%)`,
            borderRadius: '0 0 0 100%',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-8"
          style={{
            background: `radial-gradient(circle, ${theme.accentColor} 0%, transparent 60%)`,
            borderRadius: '0 100% 0 0',
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-2"
          style={{
            backgroundImage: `
              linear-gradient(${theme.primaryColor} 1px, transparent 1px),
              linear-gradient(90deg, ${theme.primaryColor} 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: theme.textColor }}
          >
            {data.title || 'About Me'}
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full"
            style={{ backgroundColor: theme.primaryColor }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Image Column with sophisticated styling */}
          <div className="relative order-2 lg:order-1">
            {/* Decorative elements behind image */}
            <div
              className="absolute inset-0 rounded-3xl transform rotate-3 opacity-20"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
              }}
            />
            <div
              className="absolute inset-0 rounded-3xl transform -rotate-3 opacity-20"
              style={{
                background: `linear-gradient(135deg, ${theme.accentColor}, ${theme.secondaryColor})`,
              }}
            />
            <div
              className="relative aspect-square flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl"
              style={{
                backgroundColor: `${theme.primaryColor}10`,
                border: `2px solid ${theme.primaryColor}20`,
              }}
            >
              {data.imageUrl ? (
                <Image
                  src={data.imageUrl}
                  alt="About"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-10">
                  <div
                    className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor})`,
                    }}
                  >
                    <User className="w-10 h-10 sm:w-14 sm:h-14 text-black" />
                  </div>
                  <p
                    className="text-base sm:text-lg font-medium"
                    style={{ color: `${theme.textColor}60` }}
                  >
                    {isEditing ? 'Add your photo' : ''}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Content Column */}
          <div className="order-1 lg:order-2">
            <h3
              className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6"
              style={{ color: theme.textColor }}
            >
              Get to know me
            </h3>

            <p
              className="text-base sm:text-lg leading-relaxed mb-6 sm:mb-8"
              style={{ color: `${theme.textColor}80` }}
            >
              {data.description || (isEditing ? 'Tell your story here...' : '')}
            </p>

            {/* Highlights with improved styling */}
            {data.highlights && data.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10">
                {data.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base font-medium transition-all hover:shadow-md"
                    style={{
                      backgroundColor: `${theme.primaryColor}15`,
                      color: theme.primaryColor,
                      borderRadius: radius,
                      border: `1px solid ${theme.primaryColor}30`,
                    }}
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}

            {/* Stats with cards */}
            {(data.yearsExperience || data.projectsCount || data.clientsCount) && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {data.yearsExperience && (
                  <div
                    className="text-center p-3 sm:p-4 rounded-xl transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: `${theme.primaryColor}10`,
                      border: `1px solid ${theme.primaryColor}20`,
                    }}
                  >
                    <div
                      className="text-2xl sm:text-3xl font-bold mb-1"
                      style={{ color: theme.primaryColor }}
                    >
                      {data.yearsExperience}
                    </div>
                    <div
                      className="text-xs uppercase tracking-wider"
                      style={{ color: `${theme.textColor}60` }}
                    >
                      Years Exp.
                    </div>
                  </div>
                )}
                {data.projectsCount && (
                  <div
                    className="text-center p-3 sm:p-4 rounded-xl transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: `${theme.accentColor}10`,
                      border: `1px solid ${theme.accentColor}20`,
                    }}
                  >
                    <div
                      className="text-2xl sm:text-3xl font-bold mb-1"
                      style={{ color: theme.accentColor }}
                    >
                      {data.projectsCount}
                    </div>
                    <div
                      className="text-xs uppercase tracking-wider"
                      style={{ color: `${theme.textColor}60` }}
                    >
                      Projects
                    </div>
                  </div>
                )}
                {data.clientsCount && (
                  <div
                    className="text-center p-3 sm:p-4 rounded-xl transition-all hover:shadow-lg"
                    style={{
                      backgroundColor: `${theme.secondaryColor}10`,
                      border: `1px solid ${theme.secondaryColor}20`,
                    }}
                  >
                    <div
                      className="text-2xl sm:text-3xl font-bold mb-1"
                      style={{ color: theme.secondaryColor }}
                    >
                      {data.clientsCount}
                    </div>
                    <div
                      className="text-xs uppercase tracking-wider"
                      style={{ color: `${theme.textColor}60` }}
                    >
                      Clients
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
