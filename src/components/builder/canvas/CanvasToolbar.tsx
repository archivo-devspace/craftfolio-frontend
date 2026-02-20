"use client";

import { Eye, Save, Loader2, Check } from "lucide-react";
import { ViewModeSelector } from "./ViewModeSelector";

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
  const getSaveButtonContent = () => {
    if (saveState.isSaving) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Saving...</span>
        </>
      );
    }
    if (saveState.status === "success") {
      return (
        <>
          <Check className="w-4 h-4" />
          <span>Saved!</span>
        </>
      );
    }
    return (
      <>
        <Save className="w-4 h-4" />
        <span>{isAuthenticated ? "Save" : "Sign in to Save"}</span>
      </>
    );
  };

  const getPublishButtonContent = () => {
    if (publishState.isPublishing) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Publishing...</span>
        </>
      );
    }
    if (publishState.status === "success") {
      return (
        <>
          <Check className="w-4 h-4" />
          <span>{isPublished ? "Published!" : "Unpublished"}</span>
        </>
      );
    }
    return (
      <>
        <Save className="w-4 h-4" />
        <span>
          {isAuthenticated
            ? isPublished
              ? "Unpublish"
              : "Publish"
            : "Sign in to Publish"}
        </span>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-3 px-4 py-3 border-b border-white/10 bg-onyx/50 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {/* <span className="hidden text-fog/50 text-sm sm:inline">View:</span>
        <ViewModeSelector
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        /> */}
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
          title="Open live preview in new tab"
        >
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium sm:hidden">
            {isPublished ? "Live Site" : "Publish to view"}
          </span>
          <span className="hidden text-sm font-medium sm:inline">
            {isPublished ? "View Live Site" : "Publish to view live site"}
          </span>
        </button>
      </div>
    </div>
  );
}
