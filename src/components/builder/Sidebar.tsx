"use client";

import { useState, useCallback, useMemo } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { SectionEditor } from "./SectionEditor";
import { ThemeEditor } from "./ThemeEditor";
import { AuthModal } from "@/components/auth/AuthModal";
import {
  SidebarTabs,
  SectionList,
  AddSectionPanel,
  SettingsPanel,
} from "./sidebar-components";
import { LogIn, LogOut, Cloud, Plus } from "lucide-react";
import { useLocaleStore } from "@/store/localeStore";

type TabType = "sections" | "theme" | "settings";

export function Sidebar() {
  const [activeTab, setActiveTab] = useState<TabType>("sections");
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [dialogMessage, setDialogMessage] = useState<{
    title: string;
    description: string;
  } | null>(null);

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
  const { t, locale } = useLocaleStore();

  const sortedSections = useMemo(
    () => [...portfolio.sections].sort((a, b) => a.order - b.order),
    [portfolio.sections],
  );

  const existingSectionTypes = useMemo(
    () => new Set(portfolio.sections.map((s) => s.type)),
    [portfolio.sections],
  );

  const handleExport = useCallback(() => {
    const json = getPortfolioJson();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${portfolio.slug || "portfolio"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getPortfolioJson, portfolio.slug]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        try {
          const data = JSON.parse(text);
          loadPortfolio(data);
        } catch {
          setDialogMessage({
            title: t("settings.importErrorTitle"),
            description: t("settings.invalidPortfolioFile"),
          });
        }
      }
    };
    input.click();
  }, [loadPortfolio, t]);

  const handleSaveToBackend = useCallback(async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      const portfolioData = {
        name: portfolio.name,
        slug: portfolio.slug,
        theme: JSON.parse(JSON.stringify(portfolio.theme)) as Record<
          string,
          unknown
        >,
        sections: JSON.parse(JSON.stringify(portfolio.sections)) as unknown[],
      };

      if (portfolio.id) {
        await api.updatePortfolio(portfolio.id, portfolioData);
      } else {
        const result = await api.createPortfolio(portfolioData);
        if (result.data) {
          loadPortfolio({ ...portfolio, id: result.data.id });
        }
      }
    } catch {
      throw new Error(t("settings.saveError"));
    }
  }, [portfolio, isAuthenticated, loadPortfolio, t]);

  const handleReset = useCallback(() => {
    setShowResetConfirm(true);
  }, []);

  const handleConfirmLogout = useCallback(() => {
    logout();
    setShowLogoutConfirm(false);
  }, [logout]);

  const handleConfirmReset = useCallback(() => {
    resetPortfolio();
    setShowResetConfirm(false);
  }, [resetPortfolio]);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      setActiveTab(tab);
      if (tab !== "sections") {
        selectSection(null);
      }
    },
    [selectSection],
  );

  return (
    <>
      <div
        className={`w-full h-[52dvh] shrink-0 bg-onyx border-b border-white/10 flex flex-col lg:w-80 lg:h-full lg:border-b-0 lg:border-r ${
          locale === "mm" ? "mm-ui-font" : ""
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary">
                {t("sidebar.title")}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {t("sidebar.subtitle")}
              </p>
            </div>
            {isAuthenticated ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                title={`${t("sidebar.loggedInAs")}: ${user?.email}`}
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"
                title={t("sidebar.signIn")}
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>
          {isAuthenticated && user && (
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <Cloud className="w-3 h-3" />
              <span>
                {t("sidebar.signedInAs")} {user.email}
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <SidebarTabs activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {activeTab === "sections" && (
            <div className="h-full flex flex-col">
              {selectedSectionId ? (
                <SectionEditor />
              ) : (
                <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
                  <SectionList
                    sortedSections={sortedSections}
                    onSelectSection={selectSection}
                    onRemoveSection={removeSection}
                    onToggleVisibility={toggleSectionVisibility}
                    onReorderSections={reorderSections}
                  />

                  <div className="mb-4">
                    <button
                      onClick={() => setShowAddSection(!showAddSection)}
                      className="w-full py-3 glass rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">{t("sidebar.addSection")}</span>
                    </button>

                    <AddSectionPanel
                      isOpen={showAddSection}
                      existingSectionTypes={existingSectionTypes}
                      onAddSection={addSection}
                      onClose={() => setShowAddSection(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "theme" && (
            <div className="h-full overflow-y-auto p-4 scrollbar-thin">
              <ThemeEditor />
            </div>
          )}

          {activeTab === "settings" && (
            <SettingsPanel
              portfolio={portfolio}
              isAuthenticated={isAuthenticated}
              onNameChange={setPortfolioName}
              onSlugChange={setPortfolioSlug}
              onExport={handleExport}
              onImport={handleImport}
              onReset={handleReset}
              onSave={handleSaveToBackend}
            />
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        className={locale === "mm" ? "mm-ui-font" : ""}
      />

      {showLogoutConfirm && (
        <div
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 ${
            locale === "mm" ? "mm-ui-font" : ""
          }`}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />

          <div className="relative w-full max-w-sm glass rounded-2xl border border-white/10 p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-cloud">
              {t("logout.title")}
            </h3>
            <p className="mt-2 text-sm text-fog/70">
              {t("logout.description")}
            </p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-lg glass hover:bg-white/10 transition-colors text-sm"
              >
                {t("logout.cancel")}
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium"
              >
                {t("logout.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetConfirm && (
        <div
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 ${
            locale === "mm" ? "mm-ui-font" : ""
          }`}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowResetConfirm(false)}
          />

          <div className="relative w-full max-w-sm glass rounded-2xl border border-white/10 p-5 sm:p-6">
            <h3 className="text-lg font-semibold text-cloud">
              {t("settings.resetTitle")}
            </h3>
            <p className="mt-2 text-sm text-fog/70">
              {t("settings.resetDescription")}
            </p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-lg glass hover:bg-white/10 transition-colors text-sm"
              >
                {t("settings.cancel")}
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium"
              >
                {t("settings.confirmReset")}
              </button>
            </div>
          </div>
        </div>
      )}

      {dialogMessage && (
        <div
          className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 ${
            locale === "mm" ? "mm-ui-font" : ""
          }`}
        >
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setDialogMessage(null)}
          />

          <div className="relative w-full max-w-3xl rounded-[2rem] border border-white/15 bg-[radial-gradient(130%_130%_at_100%_0%,rgba(40,233,140,0.14),rgba(17,24,39,0.88)_45%,rgba(2,6,23,0.94))] p-5 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
            <h3 className="text-2xl sm:text-4xl font-semibold leading-tight text-cloud">
              {dialogMessage.title}
            </h3>
            <p className="mt-3 text-base sm:text-2xl text-fog/65">
              {dialogMessage.description}
            </p>

            <div className="mt-6 sm:mt-8">
              <button
                onClick={() => setDialogMessage(null)}
                className="w-full rounded-2xl bg-primary text-black hover:bg-primary/90 transition-colors text-xl sm:text-2xl font-medium py-3.5 sm:py-4"
              >
                {t("dialogs.ok")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
