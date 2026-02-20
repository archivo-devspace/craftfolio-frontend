"use client";

import { Monitor, Tablet, Smartphone } from "lucide-react";
import { useLocaleStore } from "@/store/localeStore";

interface Props {
  viewMode: "desktop" | "tablet" | "mobile";
  onViewModeChange: (mode: "desktop" | "tablet" | "mobile") => void;
}

export function ViewModeSelector({ viewMode, onViewModeChange }: Props) {
  const { t } = useLocaleStore();

  return (
    <div className="flex items-center gap-1 glass rounded-lg p-1">
      <button
        onClick={() => onViewModeChange("desktop")}
        className={`p-2 rounded transition-colors ${
          viewMode === "desktop" ? "bg-primary text-black" : "hover:bg-white/10"
        }`}
        title={t("viewMode.desktop")}
      >
        <Monitor className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewModeChange("tablet")}
        className={`p-2 rounded transition-colors ${
          viewMode === "tablet" ? "bg-primary text-black" : "hover:bg-white/10"
        }`}
        title={t("viewMode.tablet")}
      >
        <Tablet className="w-4 h-4" />
      </button>
      <button
        onClick={() => onViewModeChange("mobile")}
        className={`p-2 rounded transition-colors ${
          viewMode === "mobile" ? "bg-primary text-black" : "hover:bg-white/10"
        }`}
        title={t("viewMode.mobile")}
      >
        <Smartphone className="w-4 h-4" />
      </button>
    </div>
  );
}
