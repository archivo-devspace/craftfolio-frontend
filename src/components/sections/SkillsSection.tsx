'use client';

import { SkillsSection as SkillsSectionType } from '@/types/portfolio';
import { useTheme } from '@/hooks';
import { Code } from 'lucide-react';
import { SectionEmptyState } from '@/components/ui';

interface Props {
  section: SkillsSectionType;
  isEditing?: boolean;
}

export function SkillsSection({ section, isEditing }: Props) {
  const { data } = section;
  const { theme, radius, themeStyles } = useTheme();

  // Group skills by category
  const groupedSkills = data.skills.reduce((acc, skill) => {
    const category = skill.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof data.skills>);

  return (
    <section
      className="py-28 px-6 relative overflow-hidden"
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
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: theme.textColor }}
          >
            {data.title || 'Skills & Technologies'}
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full mb-4"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <p
            className="text-lg max-w-2xl mx-auto opacity-70"
            style={{ color: `${theme.textColor}80` }}
          >
            {data.subtitle || 'Technologies I work with'}
          </p>
        </div>

        {/* Skills Grid - Each Category in Own Card */}
        {data.skills && data.skills.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <div
                key={category}
                className="p-8 relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
                style={{
                  backgroundColor: theme.backgroundColor,
                  borderRadius: radius,
                  border: `1px solid ${theme.textColor}10`,
                }}
              >
                {/* Card Glow */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 opacity-10 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 60%)`,
                  }}
                />

                <div className="relative z-10">
                  <h3
                    className="text-xl font-bold mb-6 flex items-center gap-3"
                    style={{ color: theme.textColor }}
                  >
                    <div
                      className="p-2 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.accentColor}20)`,
                      }}
                    >
                      <Code className="w-6 h-6" style={{ color: theme.primaryColor }} />
                    </div>
                    {category}
                  </h3>

                  <div className="space-y-5">
                    {skills.map((skill) => (
                      <div key={skill.id} className="group">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium" style={{ color: theme.textColor }}>
                            {skill.name}
                          </span>
                          <span className="text-sm font-medium" style={{ color: theme.primaryColor }}>
                            {skill.level}%
                          </span>
                        </div>
                        <div
                          className="h-3 rounded-full overflow-hidden"
                          style={{ backgroundColor: `${theme.textColor}10` }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg"
                            style={{
                              width: `${skill.level}%`,
                              background: `linear-gradient(90deg, ${theme.primaryColor}, ${theme.accentColor})`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SectionEmptyState
            icon={<Code className="w-10 h-10" style={{ color: theme.textColor }} />}
            title={isEditing ? 'No skills yet. Add your skills!' : 'No skills to display'}
            isEditing={isEditing}
          />
        )}
      </div>
    </section>
  );
}
