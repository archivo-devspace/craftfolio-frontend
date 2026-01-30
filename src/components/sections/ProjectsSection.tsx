'use client';

import { ProjectsSection as ProjectsSectionType } from '@/types/portfolio';
import { useTheme } from '@/hooks';
import { ExternalLink, Github, FolderOpen } from 'lucide-react';
import { SectionEmptyState } from '@/components/ui';
import Image from 'next/image';

interface Props {
  section: ProjectsSectionType;
  isEditing?: boolean;
}

export function ProjectsSection({ section, isEditing }: Props) {
  const { data } = section;
  const { theme, radius, themeStyles } = useTheme();

  return (
    <section
      data-section-type="projects"
      className="py-28 px-6 relative overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        ...themeStyles,
      }}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large ambient glow */}
      <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-6"
          style={{
            background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 40%)`,
          }}
        />
        {/* Corner accents */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] opacity-8"
          style={{
            background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 60%)`,
            borderRadius: '0 0 0 100%',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[300px] h-[300px] opacity-8"
          style={{
            background: `radial-gradient(circle, ${theme.accentColor} 0%, transparent 60%)`,
            borderRadius: '0 100% 0 0',
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-2"
        style={{
            backgroundImage: `
              linear-gradient(${theme.primaryColor} 1px, transparent 1px),
              linear-gradient(90deg, ${theme.primaryColor} 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
        }}
      />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: theme.textColor }}
          >
            {data.title || 'My Projects'}
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full mb-4"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <p
            className="text-lg max-w-2xl mx-auto opacity-70"
            style={{ color: `${theme.textColor}80` }}
          >
            {data.subtitle || 'Check out my latest work'}
          </p>
        </div>

        {/* Projects Grid */}
        {data.projects && data.projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.projects.map((project) => (
              <div
                key={project.id}
                className="group relative overflow-hidden transition-all duration-500"
                style={{
                  backgroundColor: theme.backgroundColor,
                  borderRadius: radius,
                  border: `1px solid ${theme.textColor}10`,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.accentColor}20)`,
                        }}
                      >
                        <FolderOpen
                          className="w-10 h-10"
                          style={{ color: theme.primaryColor }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 font-medium transition-all hover:scale-105 flex items-center gap-2"
                        style={{
                          backgroundColor: theme.primaryColor,
                          borderRadius: radius,
                          color: 'black',
                        }}
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 font-medium transition-all hover:scale-105 flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20"
                        style={{
                          borderRadius: radius,
                        }}
                      >
                        <Github className="w-5 h-5" />
                        <span>Source</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 relative">
                  <h3
                    className="text-xl font-bold mb-2 group-hover:text-primary transition-colors"
                    style={{ color: theme.textColor }}
                  >
                    {project.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed line-clamp-3 mb-4"
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
                          className="px-3 py-1 text-xs font-medium transition-colors"
                          style={{
                            backgroundColor: `${theme.primaryColor}15`,
                            color: theme.primaryColor,
                            borderRadius: radius,
                            border: `1px solid ${theme.primaryColor}30`
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
