'use client';

import { usePortfolioStore } from '@/store/portfolioStore';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
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
} from '@dnd-kit/sortable';
import { SortableSection } from './SortableSection';
import { AuthModal } from '@/components/auth/AuthModal';
import { Eye, Smartphone, Monitor, Tablet, Save, Loader2, Check } from 'lucide-react';
import { useState } from 'react';

type ViewMode = 'desktop' | 'tablet' | 'mobile';

export function Canvas() {
  const { portfolio, reorderSections, selectSection, loadPortfolio } = usePortfolioStore();
  const { isAuthenticated } = useAuthStore();
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const portfolioData = {
        name: portfolio.name,
        slug: portfolio.slug,
        published: portfolio.published,
        theme: JSON.parse(JSON.stringify(portfolio.theme)) as Record<string, unknown>,
        sections: JSON.parse(JSON.stringify(portfolio.sections)) as unknown[],
      };

      if (portfolio.id) {
        const result = await api.updatePortfolio(portfolio.id, portfolioData);
        setSaveStatus(result.error ? 'error' : 'success');
      } else {
        const result = await api.createPortfolio(portfolioData);
        if (result.data) {
          loadPortfolio({ ...portfolio, id: result.data.id });
          setSaveStatus('success');
        } else {
          setSaveStatus('error');
        }
      }
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = portfolio.sections.findIndex((s) => s.id === active.id);
      const newIndex = portfolio.sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(portfolio.sections, oldIndex, newIndex);
      reorderSections(newSections);
    }
  };

  console.log(">>>", portfolio)

  const viewModeClasses = {
    desktop: 'w-full',
    tablet: 'max-w-3xl mx-auto',
    mobile: 'max-w-sm mx-auto',
  };

  const handlePublish = async (id: string | undefined) => {
    try {
      setIsPublishing(true);
      const result = await api.togglePublish(id);
      setPublishStatus(result.error ? 'error' : 'success');
    } catch {
      setPublishStatus('error');
    } finally {
      setIsPublishing(false);
      setTimeout(() => setPublishStatus('idle'), 2000);
    }
  };

  const sortedSections = [...portfolio.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-obsidian">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-onyx/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-fog/50 text-sm">View:</span>
          <div className="flex items-center gap-1 glass rounded-lg p-1">
            <button
              onClick={() => setViewMode('desktop')}
              className={`p-2 rounded transition-colors ${viewMode === 'desktop' ? 'bg-electric-violet text-white' : 'hover:bg-white/10'
                }`}
              title="Desktop view"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`p-2 rounded transition-colors ${viewMode === 'tablet' ? 'bg-electric-violet text-white' : 'hover:bg-white/10'
                }`}
              title="Tablet view"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`p-2 rounded transition-colors ${viewMode === 'mobile' ? 'bg-electric-violet text-white' : 'hover:bg-white/10'
                }`}
              title="Mobile view"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${saveStatus === 'success'
              ? 'bg-emerald-glow text-white'
              : saveStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-electric-violet text-white hover:bg-electric-violet/90'
              }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveStatus === 'success' ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isAuthenticated ? 'Save' : 'Sign in to Save'}</span>
              </>
            )}
          </button>

          {/* Publish Button */}
          <button
            onClick={() => handlePublish(portfolio.id)}
            disabled={isPublishing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${publishStatus === 'success'
              ? 'bg-emerald-glow text-white'
              : publishStatus === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-electric-violet text-white hover:bg-electric-violet/90'
              }`}
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>publishing...</span>
              </>
            ) : publishStatus === 'success' ? (
              <>
                <Check className="w-4 h-4" />
                <span>{!portfolio.published ? 'Unpublish' : 'Published!'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isAuthenticated ? !portfolio.published ? 'Unpublish' : 'Publish' : 'Sign in to Publish'}</span>
              </>
            )}
          </button>

          {/* Preview Button */}
          <button
            onClick={() => {
              if (portfolio.published) {
                window.open(`/${portfolio.name}/${portfolio.slug}`, '_blank');
              } else {
                alert('Please save your portfolio first to preview it.');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors"
            title="Open live preview in new tab"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm font-medium">{portfolio.published ? 'View Live Site' : 'Publish to view live site'}</span>
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        className="flex-1 overflow-y-auto scrollbar-thin"
        onClick={() => selectSection(null)}
      >
        <div className={`min-h-full transition-all duration-300 ${viewModeClasses[viewMode]}`}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedSections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedSections.map((section) => (
                <SortableSection key={section.id} section={section} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
