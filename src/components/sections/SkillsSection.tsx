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
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof data.skills>);

  const renderSkillBar = (skill: (typeof data.skills)[0]) => (
    <div key={skill.id} className="group">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium" style={{ color: theme.textColor }}>
          {skill.name}
        </span>
        <span className="text-sm" style={{ color: `${theme.textColor}60` }}>
          {skill.level}%
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: `${theme.textColor}10` }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${skill.level}%`,
            backgroundColor: theme.primaryColor,
          }}
        />
      </div>
    </div>
  );

  const renderSkillBadge = (skill: (typeof data.skills)[0]) => (
    <div
      key={skill.id}
      className="px-4 py-2 font-medium transition-colors"
      style={{
        backgroundColor: `${theme.primaryColor}15`,
        color: theme.primaryColor,
        borderRadius: radius,
      }}
    >
      {skill.name}
    </div>
  );

  const renderSkills = () => {
    if (data.displayStyle === 'bars') {
      return (
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div
              key={category}
              className="p-6"
              style={{
                backgroundColor: `${theme.textColor}5`,
                borderRadius: radius,
              }}
            >
              <h3
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: theme.textColor }}
              >
                <Code className="w-5 h-5" style={{ color: theme.primaryColor }} />
                {category}
              </h3>
              <div className="space-y-4">{skills.map(renderSkillBar)}</div>
            </div>
          ))}
        </div>
      );
    }

    if (data.displayStyle === 'badges') {
      return (
        <div className="max-w-4xl mx-auto">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="mb-8 last:mb-0">
              <h3
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                style={{ color: theme.textColor }}
              >
                <Code className="w-5 h-5" style={{ color: theme.primaryColor }} />
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">{skills.map(renderSkillBadge)}</div>
            </div>
          ))}
        </div>
      );
    }

    // Circles
    return (
      <div className="max-w-5xl mx-auto">
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <div key={category} className="mb-12 last:mb-0">
            <h3
              className="text-lg font-semibold text-center mb-6 flex items-center justify-center gap-2"
              style={{ color: theme.textColor }}
            >
              <Code className="w-5 h-5" style={{ color: theme.primaryColor }} />
              {category}
            </h3>
            <div className="flex flex-wrap justify-center gap-8">
              {skills.map((skill) => {
                const circumference = 2 * Math.PI * 40;
                const strokeDashoffset =
                  circumference - (skill.level / 100) * circumference;

                return (
                  <div key={skill.id} className="flex flex-col items-center group">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          className=""
                          style={{ color: `${theme.textColor}15` }}
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r="36"
                          stroke={theme.primaryColor}
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-lg font-bold"
                          style={{ color: theme.textColor }}
                        >
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                    <span
                      className="mt-3 font-medium text-center"
                      style={{ color: `${theme.textColor}80` }}
                    >
                      {skill.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
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
        className="absolute top-1/4 left-0 w-[400px] h-[400px] opacity-5 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-0 w-[400px] h-[400px] opacity-5 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.accentColor} 0%, transparent 70%)`,
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.textColor }}
          >
            {data.title || 'Skills & Technologies'}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: `${theme.textColor}80` }}
          >
            {data.subtitle || 'Technologies I work with'}
          </p>
        </div>

        {/* Skills Display */}
        {data.skills && data.skills.length > 0 ? (
          renderSkills()
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
