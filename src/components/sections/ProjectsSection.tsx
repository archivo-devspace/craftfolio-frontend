'use client';

import { ProjectsSection as ProjectsSectionType } from '@/types/portfolio';
import { usePortfolioStore } from '@/store/portfolioStore';
import { ExternalLink, Github, FolderOpen, Plus } from 'lucide-react';

interface Props {
  section: ProjectsSectionType;
  isEditing?: boolean;
}

export function ProjectsSection({ section, isEditing }: Props) {
  const { data } = section;
  const { portfolio } = usePortfolioStore();
  const { theme } = portfolio;

  // Map border radius to actual values
  const borderRadiusMap = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '16px',
  };
  const radius = borderRadiusMap[theme.borderRadius] || '8px';
  const largeRadius = theme.borderRadius === 'none' ? '0px' : theme.borderRadius === 'small' ? '8px' : theme.borderRadius === 'medium' ? '16px' : '24px';

  const layoutClasses = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6',
    list: 'flex flex-col gap-4 md:gap-6',
    masonry: 'columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6',
  };

  return (
    <section
      data-section-type="projects"
      className="py-24 px-4 relative overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, ${theme.primaryColor}25 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            {data.title || 'My Projects'}
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: `${theme.textColor}99` }}>
            {data.subtitle || 'Check out my latest work'}
          </p>
        </div>

        {/* Projects Grid */}
        {data.projects && data.projects.length > 0 ? (
          <div className={layoutClasses[data.layout || 'grid']}>
            {data.projects.map((project) => (
              <div
                key={project.id}
                className="group glass overflow-hidden hover:scale-[1.02] transition-all duration-300"
                style={{ borderRadius: largeRadius }}
              >
                {/* Project Image */}
                <div className="relative aspect-video overflow-hidden bg-slate-dark">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen className="w-16 h-16 text-slate-light/50" />
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3
                    className="text-xl font-bold text-cloud mb-2 transition-colors group-hover:opacity-80"
                    style={{ '--hover-color': theme.primaryColor } as React.CSSProperties}
                  >
                    {project.title}
                  </h3>
                  <p className="text-fog/60 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs"
                          style={{
                            backgroundColor: `${theme.primaryColor}20`,
                            color: theme.primaryColor,
                            borderRadius: radius
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass mb-6">
              <FolderOpen className="w-10 h-10 text-slate-light" />
            </div>
            <p className="text-fog/50 mb-4">
              {isEditing ? 'No projects yet. Add your first project!' : 'No projects to display'}
            </p>
            {isEditing && (
              <button className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full hover:bg-white/10 transition-colors">
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
