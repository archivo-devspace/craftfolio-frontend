'use client';

import { AboutSection } from '@/types/portfolio';
import { Input, TextArea } from '@/components/ui';
import { useLocaleStore } from '@/store/localeStore';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: AboutSection;
  onChange: (key: string, value: unknown) => void;
}

export function AboutEditor({ section, onChange }: Props) {
  const { data } = section;
  const { t } = useLocaleStore();

  return (
    <div className="space-y-4">
      <Input label={t('editors.about.title')} value={data.title} onValueChange={(v) => onChange('title', v)} placeholder={t('editors.about.titlePlaceholder')} />
      <TextArea label={t('editors.about.description')} value={data.description} onValueChange={(v) => onChange('description', v)} rows={6} placeholder={t('editors.about.descriptionPlaceholder')} />
      <Input label={t('editors.about.imageUrl')} value={data.imageUrl} onValueChange={(v) => onChange('imageUrl', v)} placeholder={t('editors.about.imagePlaceholder')} />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Input label={t('editors.about.yearsExp')} value={data.yearsExperience || ''} onValueChange={(v) => onChange('yearsExperience', v)} placeholder={t('editors.about.yearsExpPlaceholder')} />
        <Input label={t('editors.about.projects')} value={data.projectsCount || ''} onValueChange={(v) => onChange('projectsCount', v)} placeholder={t('editors.about.projectsPlaceholder')} />
        <Input label={t('editors.about.clients')} value={data.clientsCount || ''} onValueChange={(v) => onChange('clientsCount', v)} placeholder={t('editors.about.clientsPlaceholder')} />
      </div>

      <div className="mb-4">
        <label className="block text-fog/70 text-sm mb-2">{t('editors.about.highlights')}</label>
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
            onClick={() => onChange('highlights', [...data.highlights, t('editors.about.newHighlight')])}
            className="w-full py-2 glass rounded-lg hover:bg-white/10 text-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> {t('editors.about.addHighlight')}
          </button>
        </div>
      </div>
    </div>
  );
}
