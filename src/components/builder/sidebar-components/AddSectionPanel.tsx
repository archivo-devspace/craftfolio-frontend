import { SectionType } from '@/types/portfolio';
import { Layout, User, FolderOpen, Code, Briefcase, Mail } from 'lucide-react';

const sectionTypes: { type: SectionType; label: string; icon: typeof Layout }[] = [
  { type: 'hero', label: 'Hero', icon: Layout },
  { type: 'about', label: 'About', icon: User },
  { type: 'projects', label: 'Projects', icon: FolderOpen },
  { type: 'skills', label: 'Skills', icon: Code },
  { type: 'experience', label: 'Experience', icon: Briefcase },
  { type: 'contact', label: 'Contact', icon: Mail },
];

interface AddSectionPanelProps {
  isOpen: boolean;
  existingSectionTypes: Set<SectionType>;
  onAddSection: (type: SectionType) => void;
  onClose: () => void;
}

export function AddSectionPanel({ isOpen, existingSectionTypes, onAddSection, onClose }: AddSectionPanelProps) {
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
            <Icon className="w-4 h-4 text-electric-violet" />
            <span className="text-sm text-fog/80">
              {sectionType.label}
              {isAdded && <span className="text-xs ml-2 opacity-60">(Added)</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
