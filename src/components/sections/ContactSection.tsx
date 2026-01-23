'use client';

import { ContactSection as ContactSectionType } from '@/types/portfolio';
import { useTheme } from '@/hooks';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Instagram,
} from 'lucide-react';

interface Props {
  section: ContactSectionType;
  isEditing?: boolean;
}

const socialIcons: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  website: Globe,
};

export function ContactSection({ section, isEditing }: Props) {
  const { data } = section;
  const { theme, radius, themeStyles } = useTheme();

  const getSocialIcon = (platform: string) => {
    const Icon = socialIcons[platform.toLowerCase()] || Globe;
    return <Icon className="w-5 h-5" />;
  };

  const contactInfoItems = [];

  if (data.email) {
    contactInfoItems.push({
      icon: Mail,
      label: 'Email',
      value: data.email,
      href: `mailto:${data.email}`,
      color: theme.primaryColor,
    });
  }

  if (data.phone) {
    contactInfoItems.push({
      icon: Phone,
      label: 'Phone',
      value: data.phone,
      href: `tel:${data.phone}`,
      color: theme.accentColor,
    });
  }

  if (data.location) {
    contactInfoItems.push({
      icon: MapPin,
      label: 'Location',
      value: data.location,
      href: null,
      color: theme.secondaryColor,
    });
  }

  return (
    <section
      data-section-type="contact"
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
        className="absolute top-0 left-1/4 w-[400px] h-[400px] opacity-5 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] opacity-5 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${theme.accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.textColor}30 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: theme.textColor }}
          >
            {data.title || 'Get In Touch'}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: `${theme.textColor}80` }}
          >
            {data.subtitle || "Let's work together on something great"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold mb-6" style={{ color: theme.textColor }}>
              Contact Information
            </h3>

            {/* Contact Details */}
            <div className="space-y-4">
              {contactInfoItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href || '#'}
                    className="flex items-center gap-4 p-4 transition-colors"
                    style={{
                      backgroundColor: `${theme.textColor}5`,
                      borderRadius: radius,
                    }}
                  >
                    <div
                      className="p-3"
                      style={{
                        backgroundColor: `${item.color}15`,
                        color: item.color,
                        borderRadius: radius,
                      }}
                    >
                      <Icon />
                    </div>
                    <div>
                      <p className="text-sm" style={{ color: `${theme.textColor}60` }}>
                        {item.label}
                      </p>
                      <p style={{ color: theme.textColor }}>{item.value}</p>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Social Links */}
            {data.socials && data.socials.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-4" style={{ color: theme.textColor }}>
                  Follow Me
                </h4>
                <div className="flex flex-wrap gap-3">
                  {data.socials.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 transition-all hover:scale-110"
                      style={{
                        backgroundColor: `${theme.textColor}10`,
                        borderRadius: radius,
                        color: theme.textColor,
                      }}
                      title={social.platform}
                    >
                      {getSocialIcon(social.platform)}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state for editing */}
            {isEditing && !data.email && !data.phone && !data.location && (
              <div className="text-center py-8 rounded-xl" style={{ backgroundColor: `${theme.textColor}5` }}>
                <p style={{ color: `${theme.textColor}50` }}>Add your contact information</p>
              </div>
            )}
          </div>

          {/* Contact Form */}
          {data.showForm && (
            <div
              className="p-8"
              style={{
                backgroundColor: `${theme.textColor}5`,
                borderRadius: radius,
              }}
            >
              <h3 className="text-xl font-bold mb-6" style={{ color: theme.textColor }}>
                Send a Message
              </h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm mb-2" style={{ color: `${theme.textColor}80` }}>
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border transition-all"
                    style={{
                      borderRadius: radius,
                      color: theme.textColor,
                      backgroundColor: 'transparent',
                      borderColor: `${theme.textColor}20`,
                      outlineColor: theme.primaryColor,
                    }}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: `${theme.textColor}80` }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border transition-all"
                    style={{
                      borderRadius: radius,
                      color: theme.textColor,
                      backgroundColor: 'transparent',
                      borderColor: `${theme.textColor}20`,
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: `${theme.textColor}80` }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border transition-all"
                    style={{
                      borderRadius: radius,
                      color: theme.textColor,
                      backgroundColor: 'transparent',
                      borderColor: `${theme.textColor}20`,
                    }}
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: `${theme.textColor}80` }}>
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border transition-all resize-none"
                    style={{
                      borderRadius: radius,
                      color: theme.textColor,
                      backgroundColor: 'transparent',
                      borderColor: `${theme.textColor}20`,
                    }}
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 font-semibold transition-all flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: '#000',
                    borderRadius: radius,
                  }}
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
