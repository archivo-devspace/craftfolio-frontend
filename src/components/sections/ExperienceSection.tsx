'use client';

import { ExperienceSection as ExperienceSectionType } from '@/types/portfolio';
import { usePortfolioStore } from '@/store/portfolioStore';
import { Briefcase, Plus, Calendar } from 'lucide-react';

interface Props {
  section: ExperienceSectionType;
  isEditing?: boolean;
}

export function ExperienceSection({ section, isEditing }: Props) {
  const { data } = section;
  const { portfolio } = usePortfolioStore();
  const { theme } = portfolio;

  // Map border radius to actual values
  const borderRadiusMap = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '16px',
  };
  const radius = borderRadiusMap[theme.borderRadius] || '8px';
  const largeRadius = theme.borderRadius === 'none' ? '0px' : theme.borderRadius === 'small' ? '8px' : theme.borderRadius === 'medium' ? '16px' : '24px';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section
      className="py-24 px-4 relative overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${theme.primaryColor}20 1px, transparent 1px),
                              linear-gradient(to bottom, ${theme.primaryColor}20 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            {data.title || 'Work Experience'}
          </h2>
        </div>

        {/* Timeline */}
        {data.experiences && data.experiences.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div
              className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px transform md:-translate-x-1/2"
              style={{ background: `linear-gradient(to bottom, ${theme.primaryColor}, ${theme.accentColor}, ${theme.secondaryColor})` }}
            />

            {data.experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`relative mb-12 last:mb-0 ${index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-auto'
                  }`}
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-0 md:left-1/2 top-0 w-4 h-4 rounded-full transform -translate-x-1/2 ring-4 ring-charcoal z-10"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                </div>

                {/* Content card */}
                <div
                  className={`ml-8 md:ml-0 glass p-6 hover:bg-white/10 transition-colors ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                    }`}
                  style={{ borderRadius: largeRadius }}
                >
                  {/* Company & Position */}
                  <div className={`mb-4 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                    <h3 className="text-xl font-bold text-cloud">{exp.position}</h3>
                    <p className="font-medium" style={{ color: theme.primaryColor }}>{exp.company}</p>
                  </div>

                  {/* Date range */}
                  <div className={`flex items-center gap-2 text-fog/50 text-sm mb-4 ${index % 2 === 0 ? 'md:justify-end' : ''
                    }`}>
                    <Calendar className="w-4 h-4" />
                    <span>
                      {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                    </span>
                  </div>

                  {/* Description */}
                  <p className={`text-fog/70 mb-4 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className={`space-y-2 ${index % 2 === 0 ? 'md:text-right' : ''}`}>
                      {exp.achievements.map((achievement, idx) => (
                        <li
                          key={idx}
                          className={`text-sm text-fog/60 flex items-start gap-2 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                            }`}
                        >
                          <span className="mt-1" style={{ color: theme.accentColor }}>•</span>
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
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass mb-6">
              <Briefcase className="w-10 h-10 text-slate-light" />
            </div>
            <p className="text-fog/50 mb-4">
              {isEditing ? 'No experience yet. Add your work history!' : 'No experience to display'}
            </p>
            {isEditing && (
              <button className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-white/10 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
