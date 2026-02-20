'use client';

import { ProjectsSection, Project } from '@/types/portfolio';
import { Input } from '@/components/ui';
import { v4 as uuidv4 } from 'uuid';
import { GripVertical, Trash2, Plus } from 'lucide-react';

interface Props {
  section: ProjectsSection;
  onChange: (key: string, value: unknown) => void;
}

export function ProjectsEditor({ section, onChange }: Props) {
  const { data } = section;

  const addProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      title: 'New Project',
      description: 'Project description',
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
      <Input label="Title" value={data.title} onValueChange={(v) => onChange('title', v)} placeholder="My Projects" />
      <Input label="Subtitle" value={data.subtitle} onValueChange={(v) => onChange('subtitle', v)} placeholder="Check out my work" />

      <div className="border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <label className="text-fog/70 text-sm font-medium">Projects ({data.projects.length})</label>
          <button
            onClick={addProject}
            className="px-3 py-1 glass rounded-lg hover:bg-white/10 text-sm flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
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
                  placeholder="Project Title"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                />
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm resize-none"
                />
                <input
                  type="text"
                  value={project.imageUrl}
                  onChange={(e) => updateProject(project.id, 'imageUrl', e.target.value)}
                  placeholder="Image URL"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                />
                <input
                  type="text"
                  value={project.tags.join(', ')}
                  onChange={(e) => updateProject(project.id, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder="Tags (comma separated)"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={project.liveUrl}
                    onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                    placeholder="Live URL"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
                  />
                  <input
                    type="text"
                    value={project.githubUrl}
                    onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                    placeholder="GitHub URL"
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
