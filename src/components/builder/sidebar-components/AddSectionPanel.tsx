import { SectionType } from '@/types/portfolio';
import { useLocaleStore } from '@/store/localeStore';
import { Layout, User, FolderOpen, Code, Briefcase, Mail } from 'lucide-react';

const sectionTypes: { type: SectionType; labelKey: string; icon: typeof Layout }[] = [
  { type: 'hero', labelKey: 'sections.hero', icon: Layout },
  { type: 'about', labelKey: 'sections.about', icon: User },
  { type: 'projects', labelKey: 'sections.projects', icon: FolderOpen },
  { type: 'skills', labelKey: 'sections.skills', icon: Code },
  { type: 'experience', labelKey: 'sections.experience', icon: Briefcase },
  { type: 'contact', labelKey: 'sections.contact', icon: Mail },
];

interface AddSectionPanelProps {
  isOpen: boolean;
  existingSectionTypes: Set<SectionType>;
  onAddSection: (type: SectionType) => void;
  onClose: () => void;
}

export function AddSectionPanel({ isOpen, existingSectionTypes, onAddSection, onClose }: AddSectionPanelProps) {
  const { t } = useLocaleStore();
  if (!isOpen) return null;

  return (
    <div className="mt-2 glass rounded-lg p-2 space-y-1">
      {sectionTypes.map((sectionType) => {
        const Icon = sectionType.icon;
        const isAdded = existingSectionTypes.has(sectionType.type);

        return (
          <button
            key={sectionType.type}
            onClick={() => {
              if (!isAdded) {
                onAddSection(sectionType.type);
                onClose();
              }
            }}
            disabled={isAdded}
            className={`w-full p-2 rounded-lg transition-colors flex items-center gap-2 text-left ${
              isAdded ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'
            }`}
          >
            <Icon className="w-4 h-4 text-primary" />
            <span className="text-sm text-fog/80">
              {t(sectionType.labelKey)}
              {isAdded && <span className="text-xs ml-2 opacity-60">({t('sections.added')})</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
