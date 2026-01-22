'use client';

import { useState } from 'react';
import { Portfolio } from '@/types/portfolio';
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
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await onSave();
      setSaveMessage('Portfolio saved successfully!');
    } catch {
      setSaveMessage('Error saving portfolio');
    }

    setIsSaving(false);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Portfolio Info */}
      <div className="space-y-3">
        <div>
          <label className="block text-fog/70 text-sm mb-2">Portfolio Name</label>
          <input
            type="text"
            value={portfolio.name}
            onChange={(e) => onNameChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
          />
        </div>
        <div>
          <label className="block text-fog/70 text-sm mb-2">URL Slug</label>
          <input
            type="text"
            value={portfolio.slug}
            onChange={(e) => onSlugChange(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
            placeholder="my-portfolio"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-white/10 pt-4 space-y-2">
        {saveMessage && (
          <div
            className={`p-2 rounded-lg text-xs text-center ${
              saveMessage.includes('Error') ? 'bg-red-500/20 text-red-400' : 'bg-emerald-glow/20 text-emerald-glow'
            }`}
          >
            {saveMessage}
          </div>
        )}
        <button
          onClick={handleSave}
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

        <button onClick={onExport} className="w-full py-3 glass rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          <span className="text-sm">Export JSON</span>
        </button>

        <button onClick={onImport} className="w-full py-3 glass rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
          <Upload className="w-4 h-4" />
          <span className="text-sm">Import JSON</span>
        </button>
        <button onClick={onReset} className="w-full py-3 glass rounded-lg hover:bg-red-500/20 text-red-400 transition-colors flex items-center justify-center gap-2">
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Reset Portfolio</span>
        </button>
      </div>
    </div>
  );
}
