'use client';

import { ExperienceSection, Experience } from '@/types/portfolio';
import { Input } from '@/components/ui';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  section: ExperienceSection;
  onChange: (key: string, value: unknown) => void;
}

export function ExperienceEditor({ section, onChange }: Props) {
  const { data } = section;

  const addExperience = () => {
    const newExp: Experience = {
      id: uuidv4(),
      company: 'Company Name',
      position: 'Position',
      startDate: new Date().toISOString().split('T')[0],
      endDate: null,
      current: true,
      description: 'Describe your role...',
      achievements: [],
    };
    onChange('experiences', [...data.experiences, newExp]);
  };

  const updateExperience = (id: string, key: string, value: unknown) => {
    const newExps = data.experiences.map(e =>
      e.id === id ? { ...e, [key]: value } : e
    );
    onChange('experiences', newExps);
  };

  const removeExperience = (id: string) => {
    onChange('experiences', data.experiences.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-4">
      <Input label="Title" value={data.title} onValueChange={(v) => onChange('title', v)} placeholder="Work Experience" />

      <div className="border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <label className="text-fog/70 text-sm font-medium">Experiences ({data.experiences.length})</label>
          <button
            onClick={addExperience}
            className="px-3 py-1 glass rounded-lg hover:bg-white/10 text-sm flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>

        <div className="space-y-4">
          {data.experiences.map((exp) => (
            <div key={exp.id} className="glass rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-fog/50">Experience</span>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="p-1 hover:bg-red-500/20 rounded text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Position"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                />
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Company"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                  />
                  <input
                    type="date"
                    value={exp.endDate || ''}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value || null)}
                    disabled={exp.current}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm disabled:opacity-50"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-fog/70">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="rounded bg-white/5 border-white/10"
                  />
                  Currently working here
                </label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder="Description"
                  rows={3}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
