"use client";

import { Eye, Save, Loader2, Check, Languages } from "lucide-react";
import { ViewModeSelector } from "./ViewModeSelector";
import { useLocaleStore } from "@/store/localeStore";

type SaveStatus = "idle" | "success" | "error";
type PublishStatus = "idle" | "success" | "error";

interface Props {
  viewMode: "desktop" | "tablet" | "mobile";
  onViewModeChange: (mode: "desktop" | "tablet" | "mobile") => void;
  saveState: { isSaving: boolean; status: SaveStatus };
  publishState: { isPublishing: boolean; status: PublishStatus };
  isAuthenticated: boolean;
  isPublished: boolean;
  onSave: () => void;
  onPublish: () => void;
  onPreview: () => void;
}

export function CanvasToolbar({
  viewMode,
  onViewModeChange,
  saveState,
  publishState,
  isAuthenticated,
  isPublished,
  onSave,
  onPublish,
  onPreview,
}: Props) {
  const { locale, setLocale, t } = useLocaleStore();

  const getSaveButtonContent = () => {
    if (saveState.isSaving) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{t("toolbar.saving")}</span>
        </>
      );
    }
    if (saveState.status === "success") {
      return (
        <>
          <Check className="w-4 h-4" />
          <span>{t("toolbar.saved")}</span>
        </>
      );
    }
    return (
      <>
        <Save className="w-4 h-4" />
        <span>
          {isAuthenticated ? t("toolbar.save") : t("toolbar.signInToSave")}
        </span>
      </>
    );
  };

  const getPublishButtonContent = () => {
    if (publishState.isPublishing) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{t("toolbar.publishing")}</span>
        </>
      );
    }
    if (publishState.status === "success") {
      return (
        <>
          <Check className="w-4 h-4" />
          <span>
            {isPublished ? t("toolbar.published") : t("toolbar.unpublished")}
          </span>
        </>
      );
    }
    return (
      <>
        <Save className="w-4 h-4" />
        <span>
          {isAuthenticated
            ? isPublished
              ? t("toolbar.unpublish")
              : t("toolbar.publish")
            : t("toolbar.signInToPublish")}
        </span>
      </>
    );
  };

  return (
    <div
      className={`flex flex-col gap-3 px-4 py-3 border-b border-white/10 bg-onyx/50 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between ${
        locale === "mm" ? "mm-ui-font" : ""
      }`}
    >
      <div className="flex items-center justify-between sm:justify-start gap-2">
        {/* <div className="flex items-center gap-2">
          <span className="hidden text-fog/50 text-sm sm:inline">
            {t("toolbar.view")}
          </span>
          <ViewModeSelector
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
        </div> */}
        <div
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1"
          title={t("language.label")}
        >
          <Languages className="w-3.5 h-3.5 text-fog/60 ml-1" />
          <button
            onClick={() => setLocale("en")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              locale === "en" ? "bg-primary text-black" : "text-fog/70"
            }`}
          >
            {t("language.en")}
          </button>
          <button
            onClick={() => setLocale("mm")}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              locale === "mm" ? "bg-primary text-black" : "text-fog/70"
            }`}
          >
            {t("language.mm")}
          </button>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap">
        {/* Save Button */}
        <button
          onClick={onSave}
          disabled={saveState.isSaving}
          className={`flex min-w-[120px] flex-1 items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm sm:flex-none ${
            saveState.status === "success"
              ? "bg-primary text-black"
              : saveState.status === "error"
                ? "bg-red-500 text-white"
                : "bg-primary text-black hover:bg-primary/90"
          }`}
        >
          {getSaveButtonContent()}
        </button>

        {/* Publish Button */}
        <button
          onClick={onPublish}
          disabled={publishState.isPublishing}
          className={`flex min-w-[120px] flex-1 items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm sm:flex-none ${
            publishState.status === "success"
              ? "bg-primary text-black"
              : publishState.status === "error"
                ? "bg-red-500 text-white"
                : "bg-primary text-black hover:bg-primary/90"
          }`}
        >
          {getPublishButtonContent()}
        </button>

        {/* Preview Button */}
        <button
          onClick={onPreview}
          className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors sm:w-auto"
          title={t("toolbar.openLivePreview")}
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium sm:hidden">
            {isPublished ? t("toolbar.liveSite") : t("toolbar.publishToView")}
          </span>
          <span className="hidden text-sm font-medium sm:inline">
            {isPublished
              ? t("toolbar.viewLiveSite")
              : t("toolbar.publishToViewLiveSite")}
          </span>
        </button>
      </div>
    </div>
  );
}
