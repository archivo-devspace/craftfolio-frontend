'use client';

import { SkillsSection as SkillsSectionType } from '@/types/portfolio';
import { useTheme, displayStyleOptions } from '@/hooks';
import { Code } from 'lucide-react';
import { SectionEmptyState } from '@/components/ui';

interface Props {
  section: SkillsSectionType;
  isEditing?: boolean;
}

export function SkillsSection({ section, isEditing }: Props) {
  const { data } = section;
  const { theme, radius, largeRadius, themeStyles } = useTheme();

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
        <span className="text-fog/80 font-medium">{skill.name}</span>
        <span className="text-fog/50 text-sm">{skill.level}%</span>
      </div>
      <div className="h-2 bg-slate-dark rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${skill.level}%`,
            background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})`,
          }}
        />
      </div>
    </div>
  );

  const renderSkillBadge = (skill: (typeof data.skills)[0]) => (
    <div
      key={skill.id}
      className="px-4 py-2 glass hover:bg-white/10 transition-colors group cursor-default"
      style={{ borderRadius: radius }}
    >
      <span className="group-hover:opacity-80 transition-colors" style={{ color: theme.textColor }}>
        {skill.name}
      </span>
    </div>
  );

  const renderSkillCircle = (skill: (typeof data.skills)[0]) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (skill.level / 100) * circumference;
    const gradientId = `gradient-${skill.id}`;

    return (
      <div key={skill.id} className="flex flex-col items-center group">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-slate-dark"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={`url(#${gradientId})`}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={theme.primaryColor} />
                <stop offset="100%" stopColor={theme.accentColor} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-fog">{skill.level}%</span>
          </div>
        </div>
        <span className="mt-3 text-fog/80 font-medium text-center">{skill.name}</span>
      </div>
    );
  };

  const renderSkills = () => {
    if (data.displayStyle === 'bars') {
      return (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="glass p-6" style={{ borderRadius: largeRadius }}>
              <h3
                className="text-lg font-semibold mb-6 flex items-center gap-2"
                style={{ color: theme.textColor }}
              >
                <Code className="w-5 h-5" style={{ color: theme.primaryColor }} />
                {category}
              </h3>
              <div className="space-y-4">
                {skills.map(renderSkillBar)}
              </div>
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
                className="text-lg font-semibold text-cloud mb-4 flex items-center gap-2"
                style={{ color: theme.primaryColor }}
              >
                <Code className="w-5 h-5" />
                {category}
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map(renderSkillBadge)}
              </div>
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
              className="text-lg font-semibold text-cloud mb-6 flex items-center gap-2"
              style={{ color: theme.primaryColor }}
            >
              <Code className="w-5 h-5" />
              {category}
            </h3>
            <div className="flex flex-wrap justify-center gap-8">
              {skills.map(renderSkillCircle)}
            </div>
          </div>
        ))}
      </div>
    );
  };

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
        className="absolute top-1/4 left-0 w-72 h-72 rounded-full blur-3xl"
        style={{ backgroundColor: `${theme.primaryColor}10` }}
      />
      <div
        className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${theme.accentColor}10` }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            {data.title || 'Skills & Technologies'}
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: `${theme.textColor}99` }}>
            {data.subtitle || 'Technologies I work with'}
          </p>
        </div>

        {/* Skills Display */}
        {data.skills && data.skills.length > 0 ? (
          renderSkills()
        ) : (
          <SectionEmptyState
            icon={<Code className="w-10 h-10 text-slate-light" />}
            title={isEditing ? 'No skills yet. Add your skills!' : 'No skills to display'}
            isEditing={isEditing}
          />
        )}
      </div>
    </section>
  );
}
