'use client';

import { HeroSection } from '@/types/portfolio';
import { Input } from '@/components/ui';
import { useLocaleStore } from '@/store/localeStore';

interface Props {
  section: HeroSection;
  onChange: (key: string, value: unknown) => void;
}

export function HeroEditor({ section, onChange }: Props) {
  const { data } = section;
  const { t } = useLocaleStore();

  return (
    <div className="space-y-4">
      <Input label={t('editors.hero.name')} value={data.name} onValueChange={(v) => onChange('name', v)} placeholder={t('editors.hero.namePlaceholder')} />
      <Input label={t('editors.hero.title')} value={data.title} onValueChange={(v) => onChange('title', v)} placeholder={t('editors.hero.titlePlaceholder')} />
      <Input label={t('editors.hero.subtitle')} value={data.subtitle} onValueChange={(v) => onChange('subtitle', v)} placeholder={t('editors.hero.subtitlePlaceholder')} />
      <Input label={t('editors.hero.avatarUrl')} value={data.avatarUrl} onValueChange={(v) => onChange('avatarUrl', v)} placeholder={t('editors.hero.avatarPlaceholder')} />
    </div>
  );
}
