'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Section } from '@/types/portfolio';
import { usePortfolioStore } from '@/store/portfolioStore';
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  SkillsSection,
  ExperienceSection,
  ContactSection,
} from '@/components/sections';

interface Props {
  section: Section;
}


export function SortableSection({ section }: Props) {
  const {
    selectedSectionId,
    selectSection,
    previewMode
  } = usePortfolioStore();

  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isSelected = selectedSectionId === section.id;

  const renderSection = () => {
    switch (section.type) {
      case 'hero':
        return <HeroSection section={section} isEditing={!previewMode} />;
      case 'about':
        return <AboutSection section={section} isEditing={!previewMode} />;
      case 'projects':
        return <ProjectsSection section={section} isEditing={!previewMode} />;
      case 'skills':
        return <SkillsSection section={section} isEditing={!previewMode} />;
      case 'experience':
        return <ExperienceSection section={section} isEditing={!previewMode} />;
      case 'contact':
        return <ContactSection section={section} isEditing={!previewMode} />;
      default:
        return null;
    }
  };

  if (previewMode) {
    if (!section.visible) return null;
    return renderSection();
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${!section.visible ? 'opacity-50' : ''}`}
    >
      {/* Section content with selection indicator */}
      <div
        onClick={() => selectSection(section.id)}
        className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-obsidian' : ''
          }`}
      >
        {renderSection()}
      </div>
    </div>
  );
}
