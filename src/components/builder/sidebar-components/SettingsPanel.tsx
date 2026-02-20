'use client';

import { useState } from 'react';
import { Portfolio } from '@/types/portfolio';
import { useLocaleStore } from '@/store/localeStore';
import { Download, Upload, RotateCcw, Save, Loader2 } from 'lucide-react';

interface SettingsPanelProps {
  portfolio: Portfolio;
  isAuthenticated: boolean;
  onNameChange: (name: string) => void;
  onSlugChange: (slug: string) => void;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onSave: () => void;
}

export function SettingsPanel({
  portfolio,
  isAuthenticated,
  onNameChange,
  onSlugChange,
  onExport,
  onImport,
  onReset,
  onSave,
}: SettingsPanelProps) {
  const { t } = useLocaleStore();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      await onSave();
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    }

    setIsSaving(false);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Portfolio Info */}
      <div className="space-y-3">
        <div>
          <label className="block text-fog/70 text-sm mb-2">{t('settings.portfolioName')}</label>
          <input
            type="text"
            value={portfolio.name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
          />
        </div>
        <div>
          <label className="block text-fog/70 text-sm mb-2">{t('settings.urlSlug')}</label>
          <input
            type="text"
            value={portfolio.slug}
            onChange={(e) => onSlugChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
            placeholder={t('settings.slugPlaceholder')}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-white/10 pt-4 space-y-2">
        {saveStatus && (
          <div
            className={`p-2 rounded-lg text-xs text-center ${
              saveStatus === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'
            }`}
          >
            {saveStatus === 'error' ? t('settings.saveError') : t('settings.saveSuccess')}
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">{t('settings.saving')}</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span className="text-sm">{isAuthenticated ? t('settings.saveToCloud') : t('settings.signInToSave')}</span>
            </>
          )}
        </button>

        <button onClick={onExport} className="w-full py-3 glass rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          <span className="text-sm">{t('settings.exportJson')}</span>
        </button>

        <button onClick={onImport} className="w-full py-3 glass rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
          <Upload className="w-4 h-4" />
          <span className="text-sm">{t('settings.importJson')}</span>
        </button>
        <button onClick={onReset} className="w-full py-3 glass rounded-lg hover:bg-red-500/20 text-red-400 transition-colors flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">{t('settings.resetPortfolio')}</span>
        </button>
      </div>
    </div>
  );
}
