// Portfolio Section Types
export type SectionType =
  | 'hero'
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'contact';

export interface BaseSection {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
}

export interface HeroSection extends BaseSection {
  type: 'hero';
  data: {
    name: string;
    title: string;
    subtitle: string;
    avatarUrl: string;
    backgroundStyle: 'gradient' | 'solid' | 'pattern';
    backgroundColor: string;
    gradientColors: string[];
  };
}

export interface AboutSection extends BaseSection {
  type: 'about';
  data: {
    title: string;
    description: string;
    imageUrl: string;
    highlights: string[];
    yearsExperience?: string;
    projectsCount?: string;
    clientsCount?: string;
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
}

export interface ProjectsSection extends BaseSection {
  type: 'projects';
  data: {
    title: string;
    subtitle: string;
    projects: Project[];
    layout: 'grid' | 'list' | 'masonry';
  };
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: string;
  icon?: string;
}

export interface SkillsSection extends BaseSection {
  type: 'skills';
  data: {
    title: string;
    subtitle: string;
    skills: Skill[];
    displayStyle: 'bars' | 'badges' | 'circles';
  };
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface ExperienceSection extends BaseSection {
  type: 'experience';
  data: {
    title: string;
    experiences: Experience[];
  };
}

export interface ContactSection extends BaseSection {
  type: 'contact';
  data: {
    title: string;
    subtitle: string;
    email: string;
    phone: string;
    location: string;
    name: string;
    formSubject: string;
    formMessage: string;
    socials: {
      platform: string;
      url: string;
    }[];
    showForm: boolean;
  };
}

export type Section =
  | HeroSection
  | AboutSection
  | ProjectsSection
  | SkillsSection
  | ExperienceSection
  | ContactSection;

export interface PortfolioTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
}

export interface Portfolio {
  id?: string;
  name: string;
  slug: string;
  published: boolean;
  theme: PortfolioTheme;
  sections: Section[];
  createdAt?: string;
  updatedAt?: string;
}

// Default section templates
export const defaultSectionData: Record<SectionType, Omit<Section, 'id' | 'order' | 'visible'>> = {
  hero: {
    type: 'hero',
    data: {
      name: 'Your Name',
      title: 'Full Stack Developer',
      subtitle: 'Building beautiful digital experiences',
      avatarUrl: '',
      backgroundStyle: 'gradient',
      backgroundColor: '#0f172a',
      gradientColors: ['#28e98c', '#28e98c', '#28e98c'],
    },
  },
  about: {
    type: 'about',
    data: {
      title: 'About Me',
      description: 'Write a brief introduction about yourself, your background, and what drives you.',
      imageUrl: '',
      highlights: ['Passionate Developer', 'Problem Solver', 'Team Player'],
      yearsExperience: '5+',
      projectsCount: '50+',
      clientsCount: '30+',
    },
  },
  projects: {
    type: 'projects',
    data: {
      title: 'My Projects',
      subtitle: 'A collection of work I\'m proud of',
      projects: [],
      layout: 'grid',
    },
  },
  skills: {
    type: 'skills',
    data: {
      title: 'Skills & Technologies',
      subtitle: 'Tools and technologies I work with',
      skills: [],
      displayStyle: 'bars',
    },
  },
  experience: {
    type: 'experience',
    data: {
      title: 'Work Experience',
      experiences: [],
    },
  },
  contact: {
    type: 'contact',
    data: {
      title: 'Get In Touch',
      subtitle: 'Let\'s work together',
      email: '',
      phone: '',
      location: '',
      socials: [],
      showForm: true,
    },
  },
};
