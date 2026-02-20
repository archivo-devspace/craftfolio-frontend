'use client';

import { ProjectsSection, Project } from '@/types/portfolio';
import { Input } from '@/components/ui';
import { useLocaleStore } from '@/store/localeStore';
import { v4 as uuidv4 } from 'uuid';
import { GripVertical, Trash2, Plus } from 'lucide-react';

interface Props {
  section: ProjectsSection;
  onChange: (key: string, value: unknown) => void;
}

export function ProjectsEditor({ section, onChange }: Props) {
  const { data } = section;
  const { t } = useLocaleStore();

  const addProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      title: t('editors.projects.newProjectTitle'),
      description: t('editors.projects.newProjectDescription'),
      imageUrl: '',
      tags: [],
      liveUrl: '',
      githubUrl: '',
    };
    onChange('projects', [...data.projects, newProject]);
  };

  const updateProject = (id: string, key: string, value: unknown) => {
    const newProjects = data.projects.map(p =>
      p.id === id ? { ...p, [key]: value } : p
    );
    onChange('projects', newProjects);
  };

  const removeProject = (id: string) => {
    onChange('projects', data.projects.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <Input label={t('editors.projects.title')} value={data.title} onValueChange={(v) => onChange('title', v)} placeholder={t('editors.projects.titlePlaceholder')} />
      <Input label={t('editors.projects.subtitle')} value={data.subtitle} onValueChange={(v) => onChange('subtitle', v)} placeholder={t('editors.projects.subtitlePlaceholder')} />

      <div className="border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <label className="text-fog/70 text-sm font-medium">{t('editors.projects.projects')} ({data.projects.length})</label>
          <button
            onClick={addProject}
            className="px-3 py-1 glass rounded-lg hover:bg-white/10 text-sm flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> {t('editors.projects.add')}
          </button>
        </div>

        <div className="space-y-4">
          {data.projects.map((project) => (
            <div key={project.id} className="glass rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <GripVertical className="w-4 h-4 text-fog/30 mt-1 cursor-grab" />
                <button
                  onClick={() => removeProject(project.id)}
                  className="p-1 hover:bg-red-500/20 rounded text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                  placeholder={t('editors.projects.projectTitlePlaceholder')}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                />
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder={t('editors.projects.descriptionPlaceholder')}
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm resize-none"
                />
                <input
                  type="text"
                  value={project.imageUrl}
                  onChange={(e) => updateProject(project.id, 'imageUrl', e.target.value)}
                  placeholder={t('editors.projects.imageUrlPlaceholder')}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                />
                <input
                  type="text"
                  value={project.tags.join(', ')}
                  onChange={(e) => updateProject(project.id, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder={t('editors.projects.tagsPlaceholder')}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={project.liveUrl}
                    onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                    placeholder={t('editors.projects.liveUrlPlaceholder')}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                  />
                  <input
                    type="text"
                    value={project.githubUrl}
                    onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                    placeholder={t('editors.projects.githubUrlPlaceholder')}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
