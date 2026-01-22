'use client';

import { HeroSection } from '@/types/portfolio';
import { Input, Select, ColorPicker } from '@/components/ui';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: HeroSection;
  onChange: (key: string, value: unknown) => void;
}

export function HeroEditor({ section, onChange }: Props) {
  const { data } = section;

  return (
    <div className="space-y-4">
      <Input label="Name" value={data.name} onChange={(v) => onChange('name', v)} placeholder="Your Name" />
      <Input label="Title" value={data.title} onChange={(v) => onChange('title', v)} placeholder="Full Stack Developer" />
      <Input label="Subtitle" value={data.subtitle} onChange={(v) => onChange('subtitle', v)} placeholder="Building digital experiences" />
      <Input label="Avatar URL" value={data.avatarUrl} onChange={(v) => onChange('avatarUrl', v)} placeholder="https://example.com/avatar.jpg" />

      <Select
        label="Background Style"
        value={data.backgroundStyle}
        onChange={(v) => onChange('backgroundStyle', v)}
        options={[
          { value: 'gradient', label: 'Gradient' },
          { value: 'solid', label: 'Solid Color' },
          { value: 'pattern', label: 'Pattern' },
        ]}
      />

      {data.backgroundStyle === 'solid' && (
        <ColorPicker label="Background Color" value={data.backgroundColor} onChange={(v) => onChange('backgroundColor', v)} />
      )}

      {data.backgroundStyle === 'gradient' && (
        <div className="mb-4">
          <label className="block text-fog/70 text-sm mb-2">Gradient Colors</label>
          <div className="space-y-2">
            {data.gradientColors.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...data.gradientColors];
                    newColors[idx] = e.target.value;
                    onChange('gradientColors', newColors);
                  }}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...data.gradientColors];
                    newColors[idx] = e.target.value;
                    onChange('gradientColors', newColors);
                  }}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
                />
                {data.gradientColors.length > 2 && (
                  <button
                    onClick={() => {
                      const newColors = data.gradientColors.filter((_, i) => i !== idx);
                      onChange('gradientColors', newColors);
                    }}
                    className="p-2 hover:bg-red-500/20 rounded text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => onChange('gradientColors', [...data.gradientColors, '#000000'])}
              className="w-full py-2 glass rounded-lg hover:bg-white/10 text-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Color
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
