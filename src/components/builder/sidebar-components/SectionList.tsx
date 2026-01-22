'use client';

import { useCallback } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableSidebarItem } from './SortableSidebarItem';
import { Section, SectionType } from '@/types/portfolio';

interface SectionListProps {
  sortedSections: Section[];
  onSelectSection: (id: string) => void;
  onRemoveSection: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onReorderSections: (sections: Section[]) => void;
}

export function SectionList({ sortedSections, onSelectSection, onRemoveSection, onToggleVisibility, onReorderSections }: SectionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
      const newIndex = sortedSections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(sortedSections, oldIndex, newIndex);
      onReorderSections(newSections);
    }
  }, [sortedSections, onReorderSections]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sortedSections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 mb-4">
          {sortedSections.map((section, idx) => (
            <SortableSidebarItem
              key={section.id}
              section={section}
              index={idx}
              onSelect={() => onSelectSection(section.id)}
              onRemove={() => onRemoveSection(section.id)}
              onToggleVisibility={() => onToggleVisibility(section.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
