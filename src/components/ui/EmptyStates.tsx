'use client';

import { useTheme } from '@/hooks';
import { FolderOpen, Code, Plus } from 'lucide-react';
import { Button } from './Button';

interface SectionEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  isEditing?: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionEmptyState({
  icon,
  title,
  description,
  isEditing,
  actionLabel = 'Add',
  onAction,
}: SectionEmptyStateProps) {
  const { theme } = useTheme();
  const defaultIcon = <FolderOpen className="w-8 h-8 text-slate-light" />;

  return (
    <div className="text-center py-20">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full glass mb-6">
        {icon || defaultIcon}
      </div>
      <p className="text-fog/50 mb-4">
        {isEditing ? title : description || title}
      </p>
      {isEditing && onAction && (
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

interface SkillsEmptyStateProps {
  isEditing?: boolean;
  onAddSkill?: () => void;
}

export function SkillsEmptyState({ isEditing, onAddSkill }: SkillsEmptyStateProps) {
  return (
    <SectionEmptyState
      icon={<Code className="w-10 h-10 text-slate-light" />}
      title={isEditing ? 'No skills yet. Add your skills!' : 'No skills to display'}
      isEditing={isEditing}
      actionLabel="Add Skill"
      onAction={onAddSkill}
    />
  );
}

interface ProjectsEmptyStateProps {
  isEditing?: boolean;
  onAddProject?: () => void;
}

export function ProjectsEmptyState({ isEditing, onAddProject }: ProjectsEmptyStateProps) {
  return (
    <SectionEmptyState
      icon={<FolderOpen className="w-10 h-10 text-slate-light" />}
      title={isEditing ? 'No projects yet. Add your first project!' : 'No projects to display'}
      isEditing={isEditing}
      actionLabel="Add Project"
      onAction={onAddProject}
    />
  );
}
