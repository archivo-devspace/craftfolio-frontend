'use client';

import { ProjectsSection as ProjectsSectionType } from '@/types/portfolio';
import { useTheme } from '@/hooks';
import { ExternalLink, Github, FolderOpen } from 'lucide-react';
import { SectionEmptyState } from '@/components/ui';

interface Props {
  section: ProjectsSectionType;
  isEditing?: boolean;
}

export function ProjectsSection({ section, isEditing }: Props) {
  const { data } = section;
  const { theme, radius, themeStyles } = useTheme();

  const layoutClasses: Record<string, string> = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    list: 'flex flex-col gap-6',
    masonry: 'columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6',
  };

  return (
    <section
      data-section-type="projects"
      className="py-24 px-6 relative"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        ...themeStyles,
      }}
    >
      {/* Background Accent */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 1px 1px, ${theme.primaryColor} 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.textColor }}
          >
            {data.title || 'My Projects'}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: `${theme.textColor}80` }}
          >
            {data.subtitle || 'Check out my latest work'}
          </p>
        </div>

        {/* Projects Grid */}
        {data.projects && data.projects.length > 0 ? (
          <div className={layoutClasses[data.layout || 'grid']}>
            {data.projects.map((project) => (
              <div
                key={project.id}
                className="group overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: `${theme.textColor}5`,
                  borderRadius: radius,
                }}
              >
                {/* Project Image */}
                <div
                  className="relative aspect-video overflow-hidden"
                  style={{ backgroundColor: `${theme.textColor}10` }}
                >
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderOpen
                        className="w-12 h-12"
                        style={{ color: `${theme.textColor}30` }}
                      />
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3"
                    style={{ backgroundColor: `${theme.backgroundColor}90` }}
                  >
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 transition-colors"
                        style={{
                          backgroundColor: theme.primaryColor,
                          borderRadius: radius,
                        }}
                      >
                        <ExternalLink className="w-5 h-5 text-black" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 transition-colors"
                        style={{
                          backgroundColor: `${theme.textColor}20`,
                          borderRadius: radius,
                        }}
                      >
                        <ExternalLink className="w-5 h-5" style={{ color: theme.textColor }} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6">
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: theme.textColor }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-sm mb-4 line-clamp-2"
                    style={{ color: `${theme.textColor}70` }}
                  >
                    {project.description}
                  </p>

                  {/* Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: `${theme.primaryColor}15`,
                            color: theme.primaryColor,
                            borderRadius: radius,
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
          <SectionEmptyState
            icon={<FolderOpen className="w-10 h-10" style={{ color: theme.textColor }} />}
            title={isEditing ? 'No projects yet. Add your first project!' : 'No projects to display'}
            isEditing={isEditing}
            actionLabel="Add Project"
          />
        )}
      </div>
    </section>
  );
}
