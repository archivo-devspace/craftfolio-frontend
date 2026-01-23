'use client';

import { ContactSection } from '@/types/portfolio';
import { Input } from '@/components/ui';
import { Plus, Trash2 } from 'lucide-react';

interface Props {
  section: ContactSection;
  onChange: (key: string, value: unknown) => void;
}

export function ContactEditor({ section, onChange }: Props) {
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
                className="w-28 px-2 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
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
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-cloud text-sm"
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
