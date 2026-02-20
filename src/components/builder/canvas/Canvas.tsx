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
import { useLocaleStore } from "@/store/localeStore";

type SaveStatus = "idle" | "success" | "error";
type PublishStatus = "idle" | "success" | "error";

export function Canvas() {
  const { portfolio, reorderSections, selectSection, loadPortfolio } =
    usePortfolioStore();
  const { isAuthenticated } = useAuthStore();
  const { t } = useLocaleStore();
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<{
    title: string;
    description: string;
  } | null>(null);

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
      }

      if (result.data) {
        loadPortfolio({
          ...portfolio,
          id: result.data.id,
          name: result.data.name,
          slug: result.data.slug,
          published: result.data.published,
        });
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
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!portfolio.id) {
      setPublishState({ isPublishing: false, status: "error" });
      setDialogMessage({
        title: t("dialogs.saveFirstTitle"),
        description: t("dialogs.saveFirstDescription"),
      });
      return;
    }

    try {
      setPublishState({ isPublishing: true, status: "idle" });
      const result = await api.togglePublish(portfolio.id);

      if (result.data) {
        loadPortfolio({
          ...portfolio,
          id: result.data.id,
          name: result.data.name,
          slug: result.data.slug,
          published: result.data.published,
        });
      }

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
  }, [isAuthenticated, portfolio, loadPortfolio, t]);

  const handlePreview = useCallback(() => {
    if (portfolio.published) {
      const encodedName = encodeURIComponent(portfolio.name);
      const encodedSlug = encodeURIComponent(portfolio.slug);
      const url = `/${encodedName}/${encodedSlug}`;

      if (viewMode === "mobile") {
        window.open(
          url,
          "_blank",
          "noopener,noreferrer,width=390,height=844",
        );
        return;
      }

      if (viewMode === "tablet") {
        window.open(
          url,
          "_blank",
          "noopener,noreferrer,width=820,height=1024",
        );
        return;
      }

      window.open(url, "_blank");
    } else {
      setDialogMessage({
        title: t("dialogs.publishRequiredTitle"),
        description: t("dialogs.publishRequiredDescription"),
      });
    }
  }, [portfolio.published, portfolio.name, portfolio.slug, viewMode, t]);

  const sortedSections = [...portfolio.sections].sort(
    (a, b) => a.order - b.order,
  );

  const isDevicePreview = viewMode !== "desktop";

  const deviceFrameStyle: React.CSSProperties | undefined =
    viewMode === "mobile"
      ? {
          width: "390px",
          maxWidth: "100%",
          height: "min(844px, calc(100dvh - 11rem))",
        }
      : viewMode === "tablet"
        ? {
            width: "820px",
            maxWidth: "100%",
            height: "min(1024px, calc(100dvh - 11rem))",
          }
        : undefined;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-obsidian">
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
      <div className="flex-1 overflow-y-auto scrollbar-thin" onClick={() => selectSection(null)}>
        <div className={isDevicePreview ? "flex justify-center px-2 sm:px-4 py-3 sm:py-4" : "min-h-full"}>
          <div
            className={`transition-all duration-300 ${
              viewMode === "desktop"
                ? "w-full min-h-full"
                : viewMode === "tablet"
                  ? "overflow-y-auto rounded-2xl border border-white/10 bg-obsidian/80 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
                  : "overflow-y-auto rounded-[2rem] border border-white/10 bg-obsidian/80 shadow-[0_24px_80px_rgba(0,0,0,0.5)]"
            }`}
            style={deviceFrameStyle}
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
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {dialogMessage && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDialogMessage(null)}
          />

          <div className="relative w-full max-w-sm glass rounded-2xl border border-white/10 p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-cloud">
              {dialogMessage.title}
            </h3>
            <p className="mt-2 text-sm text-fog/70">
              {dialogMessage.description}
            </p>

            <div className="mt-5">
              <button
                onClick={() => setDialogMessage(null)}
                className="w-full py-2.5 rounded-lg bg-primary text-black hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                {t("dialogs.ok")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
