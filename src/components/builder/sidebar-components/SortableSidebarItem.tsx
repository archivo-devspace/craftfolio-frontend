import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SectionType } from '@/types/portfolio';
import { useLocaleStore } from '@/store/localeStore';
import { Layout, User, FolderOpen, Code, Briefcase, Mail, GripVertical, Trash2, Eye, EyeOff, ChevronRight } from 'lucide-react';

const sectionTypes: { type: SectionType; labelKey: string; icon: typeof Layout }[] = [
  { type: 'hero', labelKey: 'sections.hero', icon: Layout },
  { type: 'about', labelKey: 'sections.about', icon: User },
  { type: 'projects', labelKey: 'sections.projects', icon: FolderOpen },
  { type: 'skills', labelKey: 'sections.skills', icon: Code },
  { type: 'experience', labelKey: 'sections.experience', icon: Briefcase },
  { type: 'contact', labelKey: 'sections.contact', icon: Mail },
];

interface SortableSidebarItemProps {
  section: { id: string; type: SectionType; visible: boolean };
  index: number;
  onSelect: () => void;
  onRemove: () => void;
  onToggleVisibility: () => void;
}

export function SortableSidebarItem({ section, index, onSelect, onRemove, onToggleVisibility }: SortableSidebarItemProps) {
  const { t } = useLocaleStore();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sectionInfo = sectionTypes.find(s => s.type === section.type);
  const Icon = sectionInfo?.icon || Layout;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 glass rounded-lg transition-colors ${!section.visible ? 'opacity-50 bg-white/5' : ''}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab active:cursor-grabbing hover:bg-white/10 rounded"
        disabled={!section.visible}
      >
        <GripVertical className={`w-4 h-4 ${section.visible ? 'text-fog/50' : 'text-fog/30'}`} />
      </button>
      <span className="hidden sm:inline text-fog/50 text-sm w-4">{index + 1}</span>
      <Icon className={`w-4 h-4 ${section.visible ? 'text-primary' : 'text-fog/30'}`} />
      <span
        className={`flex-1 min-w-0 truncate text-sm ${section.visible ? 'text-fog/80 cursor-pointer hover:text-fog' : 'text-fog/40 cursor-not-allowed'}`}
        onClick={section.visible ? onSelect : undefined}
      >
        {sectionInfo ? t(sectionInfo.labelKey) : section.type}
      </span>
      <button
        onClick={onToggleVisibility}
        className="p-1 hover:bg-white/10 rounded transition-opacity"
        title={section.visible ? t('sections.hideSection') : t('sections.showSection')}
      >
        {section.visible ? <Eye className="w-4 h-4 text-fog/50" /> : <EyeOff className="w-4 h-4 text-fog/30" />}
      </button>
      <button onClick={onRemove} className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-opacity">
        <Trash2 className="w-4 h-4" />
      </button>
      <button onClick={onSelect} className={`hidden sm:inline p-1 hover:bg-white/10 rounded ${section.visible ? 'text-fog/30 cursor-pointer' : 'text-fog/20'}`}>
        <ChevronRight className="w-4 h-4 text-fog/50" />
      </button>
    </div>
  );
}
