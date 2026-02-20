'use client';

import { usePortfolioStore } from '@/store/portfolioStore';
import { PortfolioTheme, HeroSection } from '@/types/portfolio';
import { Palette, Type, Square } from 'lucide-react';

const fontOptions = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Raleway', label: 'Raleway' },
];

const radiusOptions = [
  { value: 'none', label: 'Sharp (0)' },
  { value: 'small', label: 'Small (4px)' },
  { value: 'medium', label: 'Medium (8px)' },
  { value: 'large', label: 'Large (16px)' },
];

const presetThemes: { name: string; theme: Partial<PortfolioTheme> }[] = [
  {
    name: 'Midnight',
    theme: {
      primaryColor: '#28e98c',
      secondaryColor: '#28e98c',
      accentColor: '#28e98c',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
    },
  },
  {
    name: 'Ocean',
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#06b6d4',
      accentColor: '#22d3d1',
      backgroundColor: '#0c1222',
      textColor: '#e2e8f0',
    },
  },
  {
    name: 'Forest',
    theme: {
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      accentColor: '#34d399',
      backgroundColor: '#0f1f1a',
      textColor: '#ecfdf5',
    },
  },
  {
    name: 'Sunset',
    theme: {
      primaryColor: '#f97316',
      secondaryColor: '#ef4444',
      accentColor: '#fbbf24',
      backgroundColor: '#1c1410',
      textColor: '#fef3c7',
    },
  },
  {
    name: 'Rose',
    theme: {
      primaryColor: '#f43f5e',
      secondaryColor: '#28e98c',
      accentColor: '#fb7185',
      backgroundColor: '#1f1218',
      textColor: '#fce7f3',
    },
  },
  {
    name: 'Monochrome',
    theme: {
      primaryColor: '#a1a1aa',
      secondaryColor: '#71717a',
      accentColor: '#ffffff',
      backgroundColor: '#18181b',
      textColor: '#fafafa',
    },
  },
];

export function ThemeEditor() {
  const { portfolio, updateTheme, updateSection } = usePortfolioStore();
  const { theme } = portfolio;

  // Update hero section gradient when theme changes
  const applyThemeToSections = (newTheme: Partial<PortfolioTheme>) => {
    updateTheme(newTheme);
    
    // Update hero section gradient colors to match theme
    const heroSection = portfolio.sections.find(s => s.type === 'hero') as HeroSection | undefined;
    if (heroSection && newTheme.primaryColor && newTheme.secondaryColor && newTheme.accentColor) {
      updateSection(heroSection.id, {
        data: {
          ...heroSection.data,
          gradientColors: [newTheme.primaryColor, newTheme.secondaryColor, newTheme.accentColor],
        },
      } as Partial<HeroSection>);
    }
  };

  return (
    <div className="space-y-6">
      {/* Preset Themes */}
      <div>
        <h4 className="text-sm font-medium text-fog/70 mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Preset Themes
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {presetThemes.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyThemeToSections(preset.theme)}
              className="p-3 glass rounded-lg hover:bg-white/10 transition-colors text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: preset.theme.primaryColor }}
                />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: preset.theme.secondaryColor }}
                />
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: preset.theme.accentColor }}
                />
              </div>
              <span className="text-xs text-fog/80">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <h4 className="text-sm font-medium text-fog/70 mb-3 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Custom Colors
        </h4>
        <div className="space-y-3">
          <ColorInput
            label="Primary"
            value={theme.primaryColor}
            onChange={(v) => updateTheme({ primaryColor: v })}
          />
          <ColorInput
            label="Secondary"
            value={theme.secondaryColor}
            onChange={(v) => updateTheme({ secondaryColor: v })}
          />
          <ColorInput
            label="Accent"
            value={theme.accentColor}
            onChange={(v) => updateTheme({ accentColor: v })}
          />
          <ColorInput
            label="Background"
            value={theme.backgroundColor}
            onChange={(v) => updateTheme({ backgroundColor: v })}
          />
          <ColorInput
            label="Text"
            value={theme.textColor}
            onChange={(v) => updateTheme({ textColor: v })}
          />
        </div>
      </div>

      {/* Typography */}
      <div>
        <h4 className="text-sm font-medium text-fog/70 mb-3 flex items-center gap-2">
          <Type className="w-4 h-4" />
          Typography
        </h4>
        <select
          value={theme.fontFamily}
          onChange={(e) => updateTheme({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
        >
          {fontOptions.map((font) => (
            <option key={font.value} value={font.value} className="bg-charcoal">
              {font.label}
            </option>
          ))}
        </select>
      </div>

      {/* Border Radius */}
      <div>
        <h4 className="text-sm font-medium text-fog/70 mb-3 flex items-center gap-2">
          Border Radius
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {radiusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => updateTheme({ borderRadius: option.value as PortfolioTheme['borderRadius'] })}
              className={`p-2 rounded-lg text-xs transition-colors ${
                theme.borderRadius === option.value
                  ? 'bg-primary text-black'
                  : 'glass hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
      />
      <div className="flex-1 min-w-0">
        <span className="text-xs text-fog/50">{label}</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded text-cloud text-xs"
        />
      </div>
    </div>
  );
}
