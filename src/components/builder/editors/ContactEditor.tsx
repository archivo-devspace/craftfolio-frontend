'use client';

import { ContactSection } from '@/types/portfolio';
import { Input, TextArea } from '@/components/ui';
import { useLocaleStore } from '@/store/localeStore';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: ContactSection;
  onChange: (key: string, value: unknown) => void;
}

export function ContactEditor({ section, onChange }: Props) {
  const { data } = section;
  const { t } = useLocaleStore();

  const addSocial = () => {
    const newSocials = [...(data.socials || [])];
    newSocials.push({ platform: 'website', url: '' });
    onChange('socials', newSocials);
  };

  const updateSocialPlatform = (idx: number, platform: string) => {
    const newSocials = [...(data.socials || [])];
    newSocials[idx] = { platform, url: newSocials[idx].url };
    onChange('socials', newSocials);
  };

  const updateSocialUrl = (idx: number, url: string) => {
    const newSocials = [...(data.socials || [])];
    newSocials[idx] = { platform: newSocials[idx].platform, url };
    onChange('socials', newSocials);
  };

  const removeSocial = (idx: number) => {
    const newSocials = (data.socials || []).filter((_, i) => i !== idx);
    onChange('socials', newSocials);
  };

  return (
    <div className="space-y-4">
      <Input label={t('editors.contact.title')} value={data.title} onValueChange={(v) => onChange('title', v)} placeholder={t('editors.contact.titlePlaceholder')} />
      <Input label={t('editors.contact.subtitle')} value={data.subtitle} onValueChange={(v) => onChange('subtitle', v)} placeholder={t('editors.contact.subtitlePlaceholder')} />
      <Input label={t('editors.contact.email')} value={data.email} onValueChange={(v) => onChange('email', v)} placeholder={t('editors.contact.emailPlaceholder')} type="email" />
      <Input label={t('editors.contact.phone')} value={data.phone} onValueChange={(v) => onChange('phone', v)} placeholder={t('editors.contact.phonePlaceholder')} />
      <Input label={t('editors.contact.location')} value={data.location} onValueChange={(v) => onChange('location', v)} placeholder={t('editors.contact.locationPlaceholder')} />

      <div className="border-t border-white/10 pt-4 mt-4">
        <h4 className="text-sm font-medium mb-3 text-fog/70">{t('editors.contact.formDefaultValues')}</h4>
        <Input label={t('editors.contact.defaultName')} value={data.name} onValueChange={(v) => onChange('name', v)} placeholder={t('editors.contact.defaultNamePlaceholder')} />
        <Input label={t('editors.contact.defaultSubject')} value={data.formSubject} onValueChange={(v) => onChange('formSubject', v)} placeholder={t('editors.contact.defaultSubjectPlaceholder')} />
        <TextArea label={t('editors.contact.defaultMessage')} value={data.formMessage} onValueChange={(v) => onChange('formMessage', v)} placeholder={t('editors.contact.defaultMessagePlaceholder')} />
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm text-fog/70">
          <input
            type="checkbox"
            checked={Boolean(data.showForm)}
            onChange={(e) => onChange('showForm', e.target.checked)}
            className="rounded bg-white/5 border-white/10"
          />
          {t('editors.contact.showContactForm')}
        </label>
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <label className="text-fog/70 text-sm font-medium">{t('editors.contact.socialLinks')}</label>
          <button
            onClick={addSocial}
            className="px-3 py-1 glass rounded-lg hover:bg-white/10 text-sm flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> {t('editors.contact.add')}
          </button>
        </div>

        <div className="space-y-2">
          {(data.socials || []).map((social, idx) => (
            <div key={idx} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <select
                value={social.platform}
                onChange={(e) => updateSocialPlatform(idx, e.target.value)}
                className="w-full sm:w-28 px-2 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
              >
                <option value="github" className="bg-charcoal">{t('editors.contact.platformGithub')}</option>
                <option value="linkedin" className="bg-charcoal">{t('editors.contact.platformLinkedIn')}</option>
                <option value="twitter" className="bg-charcoal">{t('editors.contact.platformTwitter')}</option>
                <option value="instagram" className="bg-charcoal">{t('editors.contact.platformInstagram')}</option>
                <option value="website" className="bg-charcoal">{t('editors.contact.platformWebsite')}</option>
              </select>
              <input
                type="text"
                value={social.url}
                onChange={(e) => updateSocialUrl(idx, e.target.value)}
                placeholder={t('editors.contact.url')}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
              />
              <button
                onClick={() => removeSocial(idx)}
                className="self-end sm:self-auto p-2 hover:bg-red-500/20 rounded text-red-400"
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
