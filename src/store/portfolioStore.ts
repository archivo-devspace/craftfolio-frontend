import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  Portfolio,
  Section,
  SectionType,
  PortfolioTheme,
  defaultSectionData
} from '@/types/portfolio';

interface PortfolioState {
  portfolio: Portfolio;
  selectedSectionId: string | null;
  previewMode: boolean;

  // Actions
  setPortfolioName: (name: string) => void;
  setPortfolioSlug: (slug: string) => void;
  addSection: (type: SectionType) => void;
  removeSection: (id: string) => void;
  updateSection: (id: string, data: Partial<Section>) => void;
  reorderSections: (sections: Section[]) => void;
  toggleSectionVisibility: (id: string) => void;
  selectSection: (id: string | null) => void;
  updateTheme: (theme: Partial<PortfolioTheme>) => void;
  togglePreviewMode: () => void;
  resetPortfolio: () => void;
  loadPortfolio: (portfolio: Portfolio) => void;
  getPortfolioJson: () => string;
}

const defaultTheme: PortfolioTheme = {
  primaryColor: '#28e98c',
  secondaryColor: '#28e98c',
  accentColor: '#28e98c',
  backgroundColor: '#0f172a',
  textColor: '#f8fafc',
  fontFamily: 'Inter',
  borderRadius: 'medium',
};

const createDefaultPortfolio = (): Portfolio => ({
  name: 'My Portfolio',
  slug: 'my-portfolio',
  published: false,
  theme: defaultTheme,
  sections: [
    {
      id: uuidv4(),
      type: 'hero',
      order: 0,
      visible: true,
      data: defaultSectionData.hero.data,
    } as Section,
    {
      id: uuidv4(),
      type: 'about',
      order: 1,
      visible: true,
      data: defaultSectionData.about.data,
    } as Section,
    {
      id: uuidv4(),
      type: 'projects',
      order: 2,
      visible: true,
      data: defaultSectionData.projects.data,
    } as Section,
    {
      id: uuidv4(),
      type: 'skills',
      order: 3,
      visible: true,
      data: defaultSectionData.skills.data,
    } as Section,
    {
      id: uuidv4(),
      type: 'contact',
      order: 4,
      visible: true,
      data: defaultSectionData.contact.data,
    } as Section,
  ],
});

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      portfolio: createDefaultPortfolio(),
      selectedSectionId: null,
      previewMode: false,

      setPortfolioName: (name) =>
        set((state) => ({
          portfolio: { ...state.portfolio, name },
        })),

      setPortfolioSlug: (slug) =>
        set((state) => ({
          portfolio: { ...state.portfolio, slug: slug.toLowerCase().replace(/\s+/g, '-') },
        })),

      addSection: (type) =>
        set((state) => {
          const newSection = {
            id: uuidv4(),
            type,
            order: state.portfolio.sections.length,
            visible: true,
            data: defaultSectionData[type].data,
          } as Section;

          return {
            portfolio: {
              ...state.portfolio,
              sections: [...state.portfolio.sections, newSection],
            },
          };
        }),

      removeSection: (id) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            sections: state.portfolio.sections
              .filter((s) => s.id !== id)
              .map((s, idx) => ({ ...s, order: idx })),
          },
          selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
        })),

      updateSection: (id, updates) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            sections: state.portfolio.sections.map((s) =>
              s.id === id
                ? { ...s, ...updates, data: { ...s.data, ...(updates.data || {}) } } as Section
                : s
            ),
          },
        })),

      reorderSections: (sections) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            sections: sections.map((s, idx) => ({ ...s, order: idx })),
          },
        })),

      toggleSectionVisibility: (id) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            sections: state.portfolio.sections.map((s) =>
              s.id === id ? { ...s, visible: !s.visible } : s
            ),
          },
        })),

      selectSection: (id) =>
        set({ selectedSectionId: id }),

      updateTheme: (themeUpdates) =>
        set((state) => ({
          portfolio: {
            ...state.portfolio,
            theme: { ...state.portfolio.theme, ...themeUpdates },
          },
        })),

      togglePreviewMode: () =>
        set((state) => ({
          previewMode: !state.previewMode,
          selectedSectionId: state.previewMode ? state.selectedSectionId : null,
        })),

      resetPortfolio: () =>
        set({
          portfolio: createDefaultPortfolio(),
          selectedSectionId: null,
          previewMode: false,
        }),

      loadPortfolio: (portfolio) =>
        set({
          portfolio,
          selectedSectionId: null,
          previewMode: false,
        }),

      getPortfolioJson: () => JSON.stringify(get().portfolio, null, 2),
    }),
    {
      name: 'portfolio-builder-storage',
    }
  )
);
