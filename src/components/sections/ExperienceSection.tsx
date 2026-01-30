'use client';

import { ExperienceSection as ExperienceSectionType } from '@/types/portfolio';
import { useTheme } from '@/hooks';
import { Briefcase, Calendar } from 'lucide-react';
import { SectionEmptyState } from '@/components/ui';

interface Props {
  section: ExperienceSectionType;
  isEditing?: boolean;
}

export function ExperienceSection({ section, isEditing }: Props) {
  const { data } = section;
  const { theme, radius, themeStyles } = useTheme();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

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
        className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
          backgroundImage: `linear-gradient(to right, ${theme.primaryColor}10 1px, transparent 1px),
                            linear-gradient(to bottom, ${theme.primaryColor}10 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.textColor }}
          >
            {data.title || 'Work Experience'}
          </h2>
        </div>

        {/* Timeline */}
        {data.experiences && data.experiences.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px transform md:-translate-x-1/2"
              style={{ backgroundColor: `${theme.textColor}20` }}
            />

            {data.experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`relative mb-8 last:mb-0 ${
                  index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
                  }`}
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-0 md:left-1/2 top-0 w-3 h-3 rounded-full transform -translate-x-1/2 z-10"
                    style={{ backgroundColor: theme.primaryColor }}
                  />

                {/* Content card */}
                <div
                  className={`ml-8 md:ml-0 p-5 ${
                    index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                    }`}
                  style={{
                    backgroundColor: `${theme.textColor}5`,
                    borderRadius: radius,
                  }}
                >
                  {/* Company & Position */}
                  <div className={`mb-3 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                    <h3 className="text-lg font-bold" style={{ color: theme.textColor }}>
                      {exp.position}
                    </h3>
                    <p className="font-medium" style={{ color: theme.primaryColor }}>
                      {exp.company}
                    </p>
                  </div>

                  {/* Date range */}
                  <div
                    className={`flex items-center gap-2 text-sm mb-4 ${
                      index % 2 === 0 ? 'md:justify-end' : ''
                    }`}
                    style={{ color: `${theme.textColor}60` }}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(exp.startDate)} —{' '}
                      {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    className={`text-sm mb-4 ${
                      index % 2 === 0 ? 'md:text-right' : ''
                    }`}
                    style={{ color: `${theme.textColor}80` }}
                  >
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className={`space-y-2 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      {exp.achievements.map((achievement, idx) => (
                        <li
                          key={idx}
                          className={`text-sm flex items-start gap-2 ${
                            index % 2 === 0 ? 'md:flex-row-reverse' : ''
                            }`}
                          style={{ color: `${theme.textColor}70` }}
                        >
                          <span
                            className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: theme.primaryColor }}
                          />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SectionEmptyState
            icon={<Briefcase className="w-10 h-10" style={{ color: theme.textColor }} />}
            title={isEditing ? 'No experience yet. Add your work history!' : 'No experience to display'}
            isEditing={isEditing}
            actionLabel="Add Experience"
          />
        )}
      </div>
    </section>
  );
}
