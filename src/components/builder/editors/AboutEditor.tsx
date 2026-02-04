'use client';

import { AboutSection } from '@/types/portfolio';
import { Input, TextArea } from '@/components/ui';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: AboutSection;
  onChange: (key: string, value: unknown) => void;
}

export function AboutEditor({ section, onChange }: Props) {
  const { data } = section;

  return (
    <div className="space-y-4">
      <Input label="Title" value={data.title} onValueChange={(v) => onChange('title', v)} placeholder="About Me" />
      <TextArea label="Description" value={data.description} onValueChange={(v) => onChange('description', v)} rows={6} placeholder="Write about yourself..." />
      <Input label="Image URL" value={data.imageUrl} onValueChange={(v) => onChange('imageUrl', v)} placeholder="https://example.com/photo.jpg" />

      <div className="grid grid-cols-3 gap-2">
        <Input label="Years Exp." value={data.yearsExperience || ''} onValueChange={(v) => onChange('yearsExperience', v)} placeholder="5+" />
        <Input label="Projects" value={data.projectsCount || ''} onValueChange={(v) => onChange('projectsCount', v)} placeholder="50+" />
        <Input label="Clients" value={data.clientsCount || ''} onValueChange={(v) => onChange('clientsCount', v)} placeholder="30+" />
      </div>

      <div className="mb-4">
        <label className="block text-fog/70 text-sm mb-2">Highlights</label>
        <div className="space-y-2">
          {data.highlights.map((highlight, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type="text"
                value={highlight}
                onChange={(e) => {
                  const newHighlights = [...data.highlights];
                  newHighlights[idx] = e.target.value;
                  onChange('highlights', newHighlights);
                }}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
              />
              <button
                onClick={() => {
                  const newHighlights = data.highlights.filter((_, i) => i !== idx);
                  onChange('highlights', newHighlights);
                }}
                className="p-2 hover:bg-red-500/20 rounded text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange('highlights', [...data.highlights, 'New highlight'])}
            className="w-full py-2 glass rounded-lg hover:bg-white/10 text-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Highlight
          </button>
        </div>
      </div>
    </div>
  );
}
