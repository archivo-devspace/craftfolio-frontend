'use client';

import { AboutSection as AboutSectionType } from '@/types/portfolio';
import { useTheme } from '@/hooks';
import { User, Sparkles, Star } from 'lucide-react';

interface Props {
  section: AboutSectionType;
  isEditing?: boolean;
}

export function AboutSection({ section, isEditing }: Props) {
  const { data } = section;
  const { theme, radius, largeRadius, themeStyles } = useTheme();

  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        ...themeStyles,
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${theme.primaryColor}10` }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl"
        style={{ backgroundColor: `${theme.accentColor}10` }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image Column */}
          <div className="order-2 md:order-1">
            <div className="relative">
              {/* Decorative frame */}
              <div
                className="absolute -inset-4 blur-xl"
                style={{
                  background: `linear-gradient(to bottom right, ${theme.primaryColor}30, ${theme.accentColor}30)`,
                  borderRadius: largeRadius,
                }}
              />

              <div
                className="relative glass p-4 aspect-square flex items-center justify-center overflow-hidden"
                style={{ borderRadius: largeRadius }}
              >
                {data.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt="About"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center">
                    <User className="w-24 h-24 text-slate-light mx-auto mb-4" />
                    <p className="text-fog/50 text-sm">
                      {isEditing ? 'Add your photo' : ''}
                    </p>
                  </div>
                )}
              </div>

              {/* Floating badges */}
              <div
                className="absolute -top-6 -right-6 glass p-4 animate-float"
                style={{ borderRadius: radius }}
              >
                <Sparkles className="w-6 h-6" style={{ color: theme.primaryColor }} />
              </div>
              <div
                className="absolute -bottom-6 -left-6 glass p-4 animate-float"
                style={{ animationDelay: '1s', borderRadius: radius }}
              >
                <Star className="w-6 h-6" style={{ color: theme.accentColor }} />
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              {data.title || 'About Me'}
            </h2>

            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-fog/80 leading-relaxed whitespace-pre-wrap">
                {data.description || (isEditing ? 'Tell your story here...' : '')}
              </p>
            </div>

            {/* Highlights */}
            {data.highlights && data.highlights.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {data.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 glass text-sm hover:bg-white/10 transition-colors"
                    style={{ borderRadius: radius, color: theme.textColor }}
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-6">
          <div
            className="text-center glass p-4"
            style={{ borderRadius: radius }}
          >
            <div
              className="text-3xl font-bold"
              style={{ color: theme.textColor }}
            >
              {data.yearsExperience || '5+'}
            </div>
            <div className="text-sm mt-1" style={{ color: `${theme.textColor}80` }}>
              Years Exp.
            </div>
          </div>
          <div
            className="text-center glass p-4"
            style={{ borderRadius: radius }}
          >
            <div
              className="text-3xl font-bold"
              style={{ color: theme.textColor }}
            >
              {data.projectsCount || '50+'}
            </div>
            <div className="text-sm mt-1" style={{ color: `${theme.textColor}80` }}>
              Projects
            </div>
          </div>
          <div
            className="text-center glass p-4"
            style={{ borderRadius: radius }}
          >
            <div
              className="text-3xl font-bold"
              style={{ color: theme.textColor }}
            >
              {data.clientsCount || '30+'}
            </div>
            <div className="text-sm mt-1" style={{ color: `${theme.textColor}80` }}>
              Clients
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
