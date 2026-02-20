"use client";

import { SkillsSection, Skill } from "@/types/portfolio";
import { Input } from "@/components/ui";
import { useLocaleStore } from "@/store/localeStore";
import { v4 as uuidv4 } from "uuid";
import { Trash2, Plus } from "lucide-react";

interface Props {
  section: SkillsSection;
  onChange: (key: string, value: unknown) => void;
}

export function SkillsEditor({ section, onChange }: Props) {
  const { data } = section;
  const { t } = useLocaleStore();

  const addSkill = () => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: t("editors.skills.newSkillName"),
      level: 80,
      category: t("editors.skills.newSkillCategory"),
    };
    onChange("skills", [...data.skills, newSkill]);
  };

  const updateSkill = (id: string, key: string, value: unknown) => {
    const newSkills = data.skills.map((s) =>
      s.id === id ? { ...s, [key]: value } : s,
    );
    onChange("skills", newSkills);
  };

  const removeSkill = (id: string) => {
    onChange(
      "skills",
      data.skills.filter((s) => s.id !== id),
    );
  };

  return (
    <div className="space-y-4">
      <Input
        label={t("editors.skills.title")}
        value={data.title}
        onValueChange={(v) => onChange("title", v)}
        placeholder={t("editors.skills.titlePlaceholder")}
      />
      <Input
        label={t("editors.skills.subtitle")}
        value={data.subtitle}
        onValueChange={(v) => onChange("subtitle", v)}
        placeholder={t("editors.skills.subtitlePlaceholder")}
      />

      <div className="border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <label className="text-fog/70 text-sm font-medium">
            {t("editors.skills.skills")} ({data.skills.length})
          </label>
          <button
            onClick={addSkill}
            className="px-3 py-1 glass rounded-lg hover:bg-white/10 text-sm flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> {t("editors.skills.add")}
          </button>
        </div>

        <div className="space-y-3">
          {data.skills.map((skill) => (
            <div key={skill.id} className="glass rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) =>
                    updateSkill(skill.id, "name", e.target.value)
                  }
                  placeholder={t("editors.skills.skillNamePlaceholder")}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                />
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="p-2 hover:bg-red-500/20 rounded text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_160px] gap-2 sm:items-center">
                <input
                  type="text"
                  value={skill.category}
                  onChange={(e) =>
                    updateSkill(skill.id, "category", e.target.value)
                  }
                  placeholder={t("editors.skills.categoryPlaceholder")}
                  className="w-full min-w-0 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                />
                <div className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-2">
                  <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.level}
                    onChange={(e) =>
                      updateSkill(skill.id, "level", parseInt(e.target.value, 10))
                    }
                    className="w-full min-w-0"
                  />
                    <span className="shrink-0 w-12 text-right text-fog/70 text-sm font-medium">
                    {skill.level}%
                  </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
