'use client';

import { HeroSection } from '@/types/portfolio';
import { Input, ColorPicker } from '@/components/ui';

interface Props {
  section: HeroSection;
  onChange: (key: string, value: unknown) => void;
}

export function HeroEditor({ section, onChange }: Props) {
  const { data } = section;

  return (
    <div className="space-y-4">
      <Input label="Name" value={data.name} onChange={(v) => onChange('name', v)} placeholder="Your Name" />
      <Input label="Title" value={data.title} onChange={(v) => onChange('title', v)} placeholder="Full Stack Developer" />
      <Input label="Subtitle" value={data.subtitle} onChange={(v) => onChange('subtitle', v)} placeholder="Building digital experiences" />
      <Input label="Avatar URL" value={data.avatarUrl} onChange={(v) => onChange('avatarUrl', v)} placeholder="https://example.com/avatar.jpg" />

      <ColorPicker label="Background Color" value={data.backgroundColor} onChange={(v) => onChange('backgroundColor', v)} />
    </div>
  );
}
