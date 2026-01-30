'use client';

import { SkillsSection, Skill } from '@/types/portfolio';
import { Input } from '@/components/ui';
import { v4 as uuidv4 } from 'uuid';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  section: SkillsSection;
  onChange: (key: string, value: unknown) => void;
}

export function SkillsEditor({ section, onChange }: Props) {
  const { data } = section;

  const addSkill = () => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: 'New Skill',
      level: 80,
      category: 'General',
    };
    onChange('skills', [...data.skills, newSkill]);
  };

  const updateSkill = (id: string, key: string, value: unknown) => {
    const newSkills = data.skills.map(s =>
      s.id === id ? { ...s, [key]: value } : s
    );
    onChange('skills', newSkills);
  };

  const removeSkill = (id: string) => {
    onChange('skills', data.skills.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-4">
      <Input label="Title" value={data.title} onChange={(v) => onChange('title', v)} placeholder="Skills" />
      <Input label="Subtitle" value={data.subtitle} onChange={(v) => onChange('subtitle', v)} placeholder="Technologies I work with" />

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between mb-4">
          <label className="text-fog/70 text-sm font-medium">Skills ({data.skills.length})</label>
          <button
            onClick={addSkill}
            className="px-3 py-1 glass rounded-lg hover:bg-white/10 text-sm flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>

        <div className="space-y-3">
          {data.skills.map((skill) => (
            <div key={skill.id} className="glass rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  placeholder="Skill name"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                />
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="p-2 hover:bg-red-500/20 rounded text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={skill.category}
                  onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                  placeholder="Category"
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))}
                    className="w-20"
                  />
                  <span className="text-fog/50 text-sm w-10">{skill.level}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
