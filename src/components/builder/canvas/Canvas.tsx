"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useAuthStore } from "@/store/authStore";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableSection } from "./SortableSection";
import { AuthModal } from "@/components/auth/AuthModal";
import { CanvasToolbar } from "./CanvasToolbar";

type SaveStatus = "idle" | "success" | "error";
type PublishStatus = "idle" | "success" | "error";

export function Canvas() {
  const { portfolio, reorderSections, selectSection, loadPortfolio } =
    usePortfolioStore();
  const { isAuthenticated } = useAuthStore();
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [saveState, setSaveState] = useState<{
    isSaving: boolean;
    status: SaveStatus;
  }>({
    isSaving: false,
    status: "idle",
  });

  const [publishState, setPublishState] = useState<{
    isPublishing: boolean;
    status: PublishStatus;
  }>({
    isPublishing: false,
    status: "idle",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = portfolio.sections.findIndex(
          (s) => s.id === active.id,
        );
        const newIndex = portfolio.sections.findIndex((s) => s.id === over.id);
        const newSections = arrayMove(portfolio.sections, oldIndex, newIndex);
        reorderSections(newSections);
      }
    },
    [portfolio.sections, reorderSections],
  );

  const handleSave = useCallback(async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setSaveState({ isSaving: true, status: "idle" });

    try {
      const portfolioData = {
        name: portfolio.name,
        slug: portfolio.slug,
        published: portfolio.published,
        theme: JSON.parse(JSON.stringify(portfolio.theme)) as Record<
          string,
          unknown
        >,
        sections: JSON.parse(JSON.stringify(portfolio.sections)) as unknown[],
      };

      let result;
      if (portfolio.id) {
        result = await api.updatePortfolio(portfolio.id, portfolioData);
      } else {
        result = await api.createPortfolio(portfolioData);
        if (result.data) {
          loadPortfolio({ ...portfolio, id: result.data.id });
        }
      }

      setSaveState({
        isSaving: false,
        status: result.error ? "error" : "success",
      });
    } catch {
      setSaveState((prev) => ({ ...prev, isSaving: false, status: "error" }));
    }

    setTimeout(
      () => setSaveState((prev) => ({ ...prev, status: "idle" })),
      2000,
    );
  }, [portfolio, isAuthenticated, loadPortfolio]);

  const handlePublish = useCallback(async () => {
    try {
      setPublishState({ isPublishing: true, status: "idle" });
      const result = await api.togglePublish(portfolio.id);
      setPublishState({
        isPublishing: false,
        status: result.error ? "error" : "success",
      });
    } catch {
      setPublishState((prev) => ({
        ...prev,
        isPublishing: false,
        status: "error",
      }));
    }

    setTimeout(
      () => setPublishState((prev) => ({ ...prev, status: "idle" })),
      2000,
    );
  }, [portfolio.id]);

  const handlePreview = useCallback(() => {
    if (portfolio.published) {
      window.open(`/${portfolio.name}/${portfolio.slug}`, "_blank");
    } else {
      alert("Please save your portfolio first to preview it.");
    }
  }, [portfolio.published, portfolio.name, portfolio.slug]);

  const sortedSections = [...portfolio.sections].sort(
    (a, b) => a.order - b.order,
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-obsidian">
      {/* Toolbar */}
      <CanvasToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        saveState={saveState}
        publishState={publishState}
        isAuthenticated={isAuthenticated}
        isPublished={portfolio.published}
        onSave={handleSave}
        onPublish={handlePublish}
        onPreview={handlePreview}
      />

      {/* Canvas Area */}
      <div
        className="flex-1 overflow-y-auto scrollbar-thin"
        onClick={() => selectSection(null)}
      >
        <div
          className={`min-h-full transition-all duration-300 ${
            viewMode === "desktop"
              ? "w-full"
              : viewMode === "tablet"
                ? "max-w-3xl mx-auto"
                : "max-w-sm mx-auto"
          }`}
        >
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

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
