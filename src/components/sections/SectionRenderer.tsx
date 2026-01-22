'use client';

import { Section } from '@/types/portfolio';
import { HeroSection } from './HeroSection';
import { AboutSection } from './AboutSection';
import { ProjectsSection } from './ProjectsSection';
import { SkillsSection } from './SkillsSection';
import { ExperienceSection } from './ExperienceSection';
import { ContactSection } from './ContactSection';

interface SectionRendererProps {
  section: Section;
  isEditing?: boolean;
}

export function SectionRenderer({ section, isEditing = false }: SectionRendererProps) {
  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} isEditing={isEditing} />;
    case 'about':
      return <AboutSection section={section} isEditing={isEditing} />;
    case 'projects':
      return <ProjectsSection section={section} isEditing={isEditing} />;
    case 'skills':
      return <SkillsSection section={section} isEditing={isEditing} />;
    case 'experience':
      return <ExperienceSection section={section} isEditing={isEditing} />;
    case 'contact':
      return <ContactSection section={section} isEditing={isEditing} />;
    default:
      return null;
  }
}
