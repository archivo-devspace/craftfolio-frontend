'use client';

import { AboutSection as AboutSectionType } from '@/types/portfolio';
import { useTheme } from '@/hooks';
import { User } from 'lucide-react';

interface Props {
  section: AboutSectionType;
  isEditing?: boolean;
}

export function AboutSection({ section, isEditing }: Props) {
  const { data } = section;
  const { theme, radius, themeStyles } = useTheme();

  return (
    <section
      className="py-24 px-6 relative"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        ...themeStyles,
      }}
    >
      {/* Background Accent */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] opacity-5 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div>
          {/* Image Column */}
          {/* <div className="order-2 md:order-1">
            <div className="relative">
              <div
                className="aspect-square flex items-center justify-center"
                style={{
                  backgroundColor: `${theme.primaryColor}10`,
                  borderRadius: radius,
                }}
              >
                {data.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt="About"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: radius }}
                  />
                ) : (
                  <div className="text-center p-8">
                    <User
                      className="w-16 h-16 mx-auto mb-4"
                      style={{ color: theme.primaryColor }}
                    />
                    <p style={{ color: `${theme.textColor}60` }}>
                      {isEditing ? 'Add your photo' : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div> */}

          {/* Content Column */}
          <div className="order-1 md:order-2 ">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: theme.textColor }}
            >
              {data.title || 'About Me'}
            </h2>

            <p
              className="leading-relaxed mb-8"
              style={{ color: `${theme.textColor}80` }}
            >
              {data.description || (isEditing ? 'Tell your story here...' : '')}
            </p>

            {/* Highlights */}
            {data.highlights && data.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 font-medium"
                    style={{
                      backgroundColor: `${theme.primaryColor}15`,
                      color: theme.primaryColor,
                      borderRadius: radius,
                    }}
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}

            {/* Stats */}
            {(data.yearsExperience || data.projectsCount || data.clientsCount) && (
              <div className="grid grid-cols-3 gap-4 mt-10">
                {data.yearsExperience && (
                  <div className="text-center p-4">
                    <div
                      className="text-2xl font-bold"
                      style={{ color: theme.primaryColor }}
                    >
                      {data.yearsExperience}
                    </div>
                    <div
                      className="text-sm mt-1"
                      style={{ color: `${theme.textColor}60` }}
                    >
                      Years Exp.
                    </div>
                  </div>
                )}
                {data.projectsCount && (
                  <div className="text-center p-4">
                    <div
                      className="text-2xl font-bold"
                      style={{ color: theme.primaryColor }}
                    >
                      {data.projectsCount}
                    </div>
                    <div
                      className="text-sm mt-1"
                      style={{ color: `${theme.textColor}60` }}
                    >
                      Projects
                    </div>
                  </div>
                )}
                {data.clientsCount && (
                  <div className="text-center p-4">
                    <div
                      className="text-2xl font-bold"
                      style={{ color: theme.primaryColor }}
                    >
                      {data.clientsCount}
                    </div>
                    <div
                      className="text-sm mt-1"
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
