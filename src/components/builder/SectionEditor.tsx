'use client';

import { usePortfolioStore } from '@/store/portfolioStore';
import { Section, SectionType, HeroSection, AboutSection, ProjectsSection, SkillsSection, ContactSection, ExperienceSection, Skill, Project, Experience } from '@/types/portfolio';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export function SectionEditor() {
  const { portfolio, selectedSectionId, selectSection, updateSection } = usePortfolioStore();

  const section = portfolio.sections.find(s => s.id === selectedSectionId);

  if (!section) {
    return (
      <div className="h-full flex items-center justify-center text-fog/50 text-center p-6">
        <p>Select a section to edit its content</p>
      </div>
    );
  }

  const handleDataChange = (key: string, value: unknown) => {
    const newData = { ...section.data, [key]: value };
    updateSection(section.id, {
      data: newData,
    } as Partial<Section>);
  };

  const renderEditor = () => {
    switch (section.type) {
      case 'hero':
        return <HeroEditor section={section as HeroSection} onChange={handleDataChange} />;
      case 'about':
        return <AboutEditor section={section as AboutSection} onChange={handleDataChange} />;
      case 'projects':
        return <ProjectsEditor section={section as ProjectsSection} onChange={handleDataChange} />;
      case 'skills':
        return <SkillsEditor section={section as SkillsSection} onChange={handleDataChange} />;
      case 'experience':
        return <ExperienceEditor section={section as ExperienceSection} onChange={handleDataChange} />;
      case 'contact':
        return <ContactEditor section={section as ContactSection} onChange={handleDataChange} />;
      default:
        return null;
    }
  };

  const sectionLabels: Record<SectionType, string> = {
    hero: 'Hero Section',
    about: 'About Section',
    projects: 'Projects Section',
    skills: 'Skills Section',
    experience: 'Experience Section',
    contact: 'Contact Section',
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="font-semibold text-cloud">{sectionLabels[section.type]}</h3>
        <button
          onClick={() => selectSection(null)}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {renderEditor()}
      </div>
    </div>
  );
}

// Input component helper
function Input({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-fog/70 text-sm mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 4, placeholder = '' }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="mb-4">
      <label className="block text-fog/70 text-sm mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm resize-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="mb-4">
      <label className="block text-fog/70 text-sm mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} className="bg-charcoal">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ColorPicker({ label, value, onChange }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="mb-4">
      <label className="block text-fog/70 text-sm mb-2">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded cursor-pointer border-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
        />
      </div>
    </div>
  );
}

// Section-specific editors
function HeroEditor({ section, onChange }: { section: HeroSection; onChange: (key: string, value: unknown) => void }) {
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

function AboutEditor({ section, onChange }: { section: AboutSection; onChange: (key: string, value: unknown) => void }) {
  const { data } = section;

  return (
    <div className="space-y-4">
      <Input label="Title" value={data.title} onChange={(v) => onChange('title', v)} placeholder="About Me" />
      <TextArea label="Description" value={data.description} onChange={(v) => onChange('description', v)} rows={6} placeholder="Write about yourself..." />
      <Input label="Image URL" value={data.imageUrl} onChange={(v) => onChange('imageUrl', v)} placeholder="https://example.com/photo.jpg" />

      <div className="grid grid-cols-3 gap-2">
        <Input label="Years Exp." value={data.yearsExperience || ''} onChange={(v) => onChange('yearsExperience', v)} placeholder="5+" />
        <Input label="Projects" value={data.projectsCount || ''} onChange={(v) => onChange('projectsCount', v)} placeholder="50+" />
        <Input label="Clients" value={data.clientsCount || ''} onChange={(v) => onChange('clientsCount', v)} placeholder="30+" />
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
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
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

function ProjectsEditor({ section, onChange }: { section: ProjectsSection; onChange: (key: string, value: unknown) => void }) {
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
      <Input label="Title" value={data.title} onChange={(v) => onChange('title', v)} placeholder="My Projects" />
      <Input label="Subtitle" value={data.subtitle} onChange={(v) => onChange('subtitle', v)} placeholder="Check out my work" />

      <Select
        label="Layout Style"
        value={data.layout}
        onChange={(v) => onChange('layout', v)}
        options={[
          { value: 'grid', label: 'Grid' },
          { value: 'list', label: 'List' },
          { value: 'masonry', label: 'Masonry' },
        ]}
      />

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between mb-4">
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
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
                />
                <textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm resize-none"
                />
                <input
                  type="text"
                  value={project.imageUrl}
                  onChange={(e) => updateProject(project.id, 'imageUrl', e.target.value)}
                  placeholder="Image URL"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
                />
                <input
                  type="text"
                  value={project.tags.join(', ')}
                  onChange={(e) => updateProject(project.id, 'tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  placeholder="Tags (comma separated)"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={project.liveUrl}
                    onChange={(e) => updateProject(project.id, 'liveUrl', e.target.value)}
                    placeholder="Live URL"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
                  />
                  <input
                    type="text"
                    value={project.githubUrl}
                    onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                    placeholder="GitHub URL"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
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

function SkillsEditor({ section, onChange }: { section: SkillsSection; onChange: (key: string, value: unknown) => void }) {
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

      <Select
        label="Display Style"
        value={data.displayStyle}
        onChange={(v) => onChange('displayStyle', v)}
        options={[
          { value: 'bars', label: 'Progress Bars' },
          { value: 'badges', label: 'Badges' },
          { value: 'circles', label: 'Circles' },
        ]}
      />

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
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
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
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
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

function ExperienceEditor({ section, onChange }: { section: ExperienceSection; onChange: (key: string, value: unknown) => void }) {
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
      <Input label="Title" value={data.title} onChange={(v) => onChange('title', v)} placeholder="Work Experience" />

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between mb-4">
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
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
                />
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Company"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
                  />
                  <input
                    type="date"
                    value={exp.endDate || ''}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value || null)}
                    disabled={exp.current}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm disabled:opacity-50"
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
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactEditor({ section, onChange }: { section: ContactSection; onChange: (key: string, value: unknown) => void }) {
  const { data } = section;

  return (
    <div className="space-y-4">
      <Input label="Title" value={data.title} onChange={(v) => onChange('title', v)} placeholder="Get In Touch" />
      <Input label="Subtitle" value={data.subtitle} onChange={(v) => onChange('subtitle', v)} placeholder="Let's work together" />
      <Input label="Email" value={data.email} onChange={(v) => onChange('email', v)} placeholder="your@email.com" type="email" />
      <Input label="Phone" value={data.phone} onChange={(v) => onChange('phone', v)} placeholder="+1 234 567 890" />
      <Input label="Location" value={data.location} onChange={(v) => onChange('location', v)} placeholder="City, Country" />

      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm text-fog/70">
          <input
            type="checkbox"
            checked={data.showForm}
            onChange={(e) => onChange('showForm', e.target.checked)}
            className="rounded bg-white/5 border-white/10"
          />
          Show contact form
        </label>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center justify-between mb-4">
          <label className="text-fog/70 text-sm font-medium">Social Links</label>
          <button
            onClick={() => onChange('socials', [...data.socials, { platform: 'website', url: '' }])}
            className="px-3 py-1 glass rounded-lg hover:bg-white/10 text-sm flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>

        <div className="space-y-2">
          {data.socials.map((social, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <select
                value={social.platform}
                onChange={(e) => {
                  const newSocials = [...data.socials];
                  newSocials[idx] = { ...social, platform: e.target.value };
                  onChange('socials', newSocials);
                }}
                className="w-28 px-2 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
              >
                <option value="github" className="bg-charcoal">GitHub</option>
                <option value="linkedin" className="bg-charcoal">LinkedIn</option>
                <option value="twitter" className="bg-charcoal">Twitter</option>
                <option value="instagram" className="bg-charcoal">Instagram</option>
                <option value="website" className="bg-charcoal">Website</option>
              </select>
              <input
                type="text"
                value={social.url}
                onChange={(e) => {
                  const newSocials = [...data.socials];
                  newSocials[idx] = { ...social, url: e.target.value };
                  onChange('socials', newSocials);
                }}
                placeholder="URL"
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-electric-violet text-cloud text-sm"
              />
              <button
                onClick={() => {
                  const newSocials = data.socials.filter((_, i) => i !== idx);
                  onChange('socials', newSocials);
                }}
                className="p-2 hover:bg-red-500/20 rounded text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
