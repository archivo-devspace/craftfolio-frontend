'use client';

import { usePortfolioStore } from '@/store/portfolioStore';
import { Section, SectionType } from '@/types/portfolio';
import { useLocaleStore } from '@/store/localeStore';
import { X } from 'lucide-react';
import {
  HeroEditor,
  AboutEditor,
  ProjectsEditor,
  SkillsEditor,
  ExperienceEditor,
  ContactEditor,
} from './editors';

const sectionLabelKeys: Record<SectionType, string> = {
  hero: 'sectionEditor.heroSection',
  about: 'sectionEditor.aboutSection',
  projects: 'sectionEditor.projectsSection',
  skills: 'sectionEditor.skillsSection',
  experience: 'sectionEditor.experienceSection',
  contact: 'sectionEditor.contactSection',
};

export function SectionEditor() {
  const { portfolio, selectedSectionId, selectSection, updateSection } = usePortfolioStore();
  const { t } = useLocaleStore();

  const section = portfolio.sections.find(s => s.id === selectedSectionId);

  if (!section) {
    return (
      <div className="h-full flex items-center justify-center text-fog/50 text-center p-6">
        <p>{t('sectionEditor.selectSection')}</p>
      </div>
    );
  }

  const handleDataChange = (key: string, value: unknown) => {
    const newData = { ...section.data, [key]: value };
    updateSection(section.id, {
      data: newData,
    } as Partial<Section>);
  };

  const renderEditor = () => {
    switch (section.type) {
      case 'hero':
        return <HeroEditor section={section} onChange={handleDataChange} />;
      case 'about':
        return <AboutEditor section={section} onChange={handleDataChange} />;
      case 'projects':
        return <ProjectsEditor section={section} onChange={handleDataChange} />;
      case 'skills':
        return <SkillsEditor section={section} onChange={handleDataChange} />;
      case 'experience':
        return <ExperienceEditor section={section} onChange={handleDataChange} />;
      case 'contact':
        return <ContactEditor section={section} onChange={handleDataChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="font-semibold text-cloud text-sm sm:text-base truncate pr-3">
          {t(sectionLabelKeys[section.type])}
        </h3>
        <button
          onClick={() => selectSection(null)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 scrollbar-thin">
        {renderEditor()}
      </div>
    </div>
  );
}
