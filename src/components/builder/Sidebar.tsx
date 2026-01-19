'use client';

import { useState } from 'react';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { SectionType } from '@/types/portfolio';
import { SectionEditor } from './SectionEditor';
import { ThemeEditor } from './ThemeEditor';
import { AuthModal } from '@/components/auth/AuthModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Palette,
  Layers,
  Settings,
  Layout,
  User,
  FolderOpen,
  Code,
  Briefcase,
  Mail,
  Download,
  Upload,
  RotateCcw,
  ChevronRight,
  Save,
  LogIn,
  LogOut,
  Cloud,
  Loader2,
  GripVertical,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';

type TabType = 'sections' | 'theme' | 'settings';

const sectionTypes: { type: SectionType; label: string; icon: typeof Layout }[] = [
  { type: 'hero', label: 'Hero', icon: Layout },
  { type: 'about', label: 'About', icon: User },
  { type: 'projects', label: 'Projects', icon: FolderOpen },
  { type: 'skills', label: 'Skills', icon: Code },
  { type: 'experience', label: 'Experience', icon: Briefcase },
  { type: 'contact', label: 'Contact', icon: Mail },
];

// Sortable sidebar section item
function SortableSidebarItem({
  section,
  index,
  onSelect,
  onRemove,
  onToggleVisibility
}: {
  section: { id: string; type: SectionType; visible: boolean };
  index: number;
  onSelect: () => void;
  onRemove: () => void;
  onToggleVisibility: () => void;
}) {
  const {
    attributes,
    listeners,
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

  const sectionInfo = sectionTypes.find(s => s.type === section.type);
  const Icon = sectionInfo?.icon || Layout;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 glass rounded-lg transition-colors ${!section.visible ? 'opacity-50 bg-white/5' : ''
        }`}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab active:cursor-grabbing hover:bg-white/10 rounded"
        disabled={!section.visible}
      >
        <GripVertical className={`w-4 h-4 ${section.visible ? 'text-fog/50' : 'text-fog/30'}`} />
      </button>
      <span className="text-fog/50 text-sm w-4">{index + 1}</span>
      <Icon className={`w-4 h-4 ${section.visible ? 'text-electric-violet' : 'text-fog/30'}`} />
      <span
        className={`flex-1 text-sm ${section.visible
          ? 'text-fog/80 cursor-pointer hover:text-fog'
          : 'text-fog/40 cursor-not-allowed'
          }`}
        onClick={section.visible ? onSelect : undefined}
      >
        {sectionInfo?.label || section.type}

      </span>
      <button
        onClick={onToggleVisibility}
        className="p-1 hover:bg-white/10 rounded transition-opacity"
        title={section.visible ? 'Hide section' : 'Show section'}
      >
        {section.visible ? (
          <Eye className="w-4 h-4 text-fog/50" />
        ) : (
          <EyeOff className="w-4 h-4 text-fog/30" />
        )}
      </button>
      <button
        onClick={onRemove}
        className="p-1 hover:bg-red-500/20 rounded text-red-400 transition-opacity"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <button
        onClick={onSelect}
        className={`p-1 hover:bg-white/10 rounded ${section.visible ? 'text-fog/30 cursor-pointer' : 'text-fog/20'}`}
      >
        <ChevronRight className="w-4 h-4 text-fog/50" />
      </button>
    </div>
  );
}

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<TabType>('sections');
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const {
    portfolio,
    selectedSectionId,
    selectSection,
    addSection,
    removeSection,
    reorderSections,
    toggleSectionVisibility,
    resetPortfolio,
    getPortfolioJson,
    loadPortfolio,
    setPortfolioName,
    setPortfolioSlug,
  } = usePortfolioStore();

  const { user, isAuthenticated, logout } = useAuthStore();

  const handleExport = () => {
    const json = getPortfolioJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolio.slug || 'portfolio'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        try {
          const data = JSON.parse(text);
          loadPortfolio(data);
        } catch {
          alert('Invalid portfolio file');
        }
      }
    };
    input.click();
  };

  const handleSaveToBackend = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const portfolioData = {
        name: portfolio.name,
        slug: portfolio.slug,
        theme: JSON.parse(JSON.stringify(portfolio.theme)) as Record<string, unknown>,
        sections: JSON.parse(JSON.stringify(portfolio.sections)) as unknown[],
      };

      // Check if we have an existing portfolio ID
      if (portfolio.id) {
        const result = await api.updatePortfolio(portfolio.id, portfolioData);
        if (result.error) {
          setSaveMessage(`Error: ${result.error}`);
        } else {
          setSaveMessage('Portfolio saved successfully!');
        }
      } else {
        // Create new portfolio
        const result = await api.createPortfolio(portfolioData);
        if (result.error) {
          setSaveMessage(`Error: ${result.error}`);
        } else if (result.data) {
          loadPortfolio({ ...portfolio, id: result.data.id });
          setSaveMessage('Portfolio created successfully!');
        }
      }
    } catch {
      setSaveMessage('Error saving portfolio');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const tabs: { id: TabType; label: string; icon: typeof Layers }[] = [
    { id: 'sections', label: 'Sections', icon: Layers },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // DnD handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const sortedSections = [...portfolio.sections].sort((a, b) => a.order - b.order);
      const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
      const newIndex = sortedSections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sortedSections, oldIndex, newIndex);
      reorderSections(newSections);
    }
  };

  const sortedSections = [...portfolio.sections].sort((a, b) => a.order - b.order);

  return (
    <>
      <div className="w-80 h-full bg-onyx border-r border-white/10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold gradient-text">Portfolio Builder</h2>
              <p className="text-xs text-fog/50 mt-1">Design your perfect portfolio</p>
            </div>
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                title={`Logged in as ${user?.email}`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                title="Sign in"
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>
          {isAuthenticated && user && (
            <div className="mt-2 text-xs text-fog/50 flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              <span>Signed in as {user.email}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === tab.id
                ? 'text-electric-violet border-b-2 border-electric-violet'
                : 'text-fog/60 hover:text-fog'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'sections' && (
            <div className="h-full flex flex-col">
              {selectedSectionId ? (
                <SectionEditor />
              ) : (
                <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                  {/* Section List */}
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={sortedSections.map((s) => s.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2 mb-4">
                        {sortedSections.map((section, idx) => (
                          <div key={section.id} className="group">
                            <SortableSidebarItem
                              section={section}
                              index={idx}
                              onSelect={() => selectSection(section.id)}
                              onRemove={() => removeSection(section.id)}
                              onToggleVisibility={() => toggleSectionVisibility(section.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  {/* Add Section */}
                  <div className="mb-4">
                    <button
                      onClick={() => setShowAddSection(!showAddSection)}
                      className="w-full py-3 glass rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Add Section</span>
                    </button>

                    {showAddSection && (
                      <div className="mt-2 glass rounded-lg p-2 space-y-1">
                        {sectionTypes.map((sectionType) => {
                          const Icon = sectionType.icon;
                          const isAdded = portfolio.sections.some(s => s.type === sectionType.type);

                          return (
                            <button
                              key={sectionType.type}
                              onClick={() => {
                                if (!isAdded) {
                                  addSection(sectionType.type);
                                  setShowAddSection(false);
                                }
                              }}
                              disabled={isAdded}
                              className={`w-full p-2 rounded-lg transition-colors flex items-center gap-2 text-left ${isAdded
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-white/10'
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
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="h-full overflow-y-auto scrollbar-thin">
              <ThemeEditor />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 space-y-4">
              {/* Portfolio Info */}
              <div className="space-y-3">
                <div>
                  <label className="block text-fog/70 text-sm mb-2">Portfolio Name</label>
                  <input
                    type="text"
                    value={portfolio.name}
                    onChange={(e) => setPortfolioName(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
                  />
                </div>
                <div>
                  <label className="block text-fog/70 text-sm mb-2">URL Slug</label>
                  <input
                    type="text"
                    value={portfolio.slug}
                    onChange={(e) => setPortfolioSlug(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
                    placeholder="my-portfolio"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-white/10 pt-4 space-y-2">
                {saveMessage && (
                  <div className={`p-2 rounded-lg text-xs text-center ${saveMessage.includes('Error')
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-emerald-glow/20 text-emerald-glow'
                    }`}>
                    {saveMessage}
                  </div>
                )}
                <button
                  onClick={handleSaveToBackend}
                  disabled={isSaving}
                  className="w-full py-3 bg-electric-violet text-white rounded-lg hover:bg-electric-violet/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span className="text-sm">{isAuthenticated ? 'Save to Cloud' : 'Sign in to Save'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleExport}
                  className="w-full py-3 glass rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export JSON</span>
                </button>

                <button
                  onClick={handleImport}
                  className="w-full py-3 glass rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Import JSON</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset? All changes will be lost.')) {
                      resetPortfolio();
                    }
                  }}
                  className="w-full py-3 glass rounded-lg hover:bg-red-500/20 text-red-400 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">Reset Portfolio</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div >

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
