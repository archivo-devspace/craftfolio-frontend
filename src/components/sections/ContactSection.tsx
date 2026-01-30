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
  console.log('data', data)
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

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
            style={{ color: theme.textColor }}
          >
            {data.title || 'Get In Touch'}
          </h2>
          <div
            className="w-20 h-1 mx-auto rounded-full mb-4"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <p
            className="text-lg max-w-2xl mx-auto opacity-70"
            style={{ color: `${theme.textColor}80` }}
          >
            {data.subtitle || "Let's work together on something great"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div
              className="p-8 relative overflow-hidden transition-all duration-500"
              style={{
                backgroundColor: theme.backgroundColor,
                borderRadius: radius,
                border: `1px solid ${theme.textColor}10`,
              }}
            >
              {/* Card Glow */}
              <div
                className="absolute -top-40 -right-40 w-80 h-80 opacity-10 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${theme.primaryColor} 0%, transparent 60%)`,
                }}
              />

              <h3 className="text-xl font-bold mb-6 flex items-center gap-3" style={{ color: theme.textColor }}>
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor}20, ${theme.accentColor}20)`,
                  }}
                >
                  <Mail className="w-6 h-6" style={{ color: theme.primaryColor }} />
                </div>
                Contact Information
              </h3>

              {/* Contact Details */}
              <div className="space-y-4 relative z-10">
                {contactInfoItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={index}
                      href={item.href || '#'}
                      className="flex items-center gap-4 p-4 transition-all hover:scale-[1.02] group"
                      style={{
                        backgroundColor: `${theme.textColor}5`,
                        borderRadius: radius,
                        border: `1px solid ${theme.textColor}10`,
                      }}
                    >
                      <div
                        className="p-3 transition-colors group-hover:scale-110"
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
            </div>

            {/* Social Links */}
            {data.socials && data.socials.length > 0 && (
              <div
                className="p-6 relative overflow-hidden"
                style={{
                  backgroundColor: theme.backgroundColor,
                  borderRadius: radius,
                  border: `1px solid ${theme.textColor}10`,
                }}
              >
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: theme.textColor }}>
                  Follow Me
                </h4>
                <div className="flex flex-wrap gap-3">
                  {data.socials.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 transition-all hover:scale-110 hover:shadow-lg"
                      style={{
                        backgroundColor: `${theme.textColor}10`,
                        borderRadius: radius,
                        color: theme.textColor,
                        border: `1px solid ${theme.textColor}20`,
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
              className="p-8 relative overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
              style={{
                backgroundColor: theme.backgroundColor,
                borderRadius: radius,
                border: `1px solid ${theme.textColor}10`,
              }}
            >
              {/* Card Glow */}
              <div
                className="absolute -top-40 -right-40 w-80 h-80 opacity-10 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${theme.accentColor} 0%, transparent 60%)`,
                }}
              />

              <h3 className="text-xl font-bold mb-6 flex items-center gap-3 relative z-10" style={{ color: theme.textColor }}>
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accentColor}20, ${theme.primaryColor}20)`,
                  }}
                >
                  <Send className="w-6 h-6" style={{ color: theme.accentColor }} />
                </div>
                Send a Message
              </h3>
              <form className="space-y-5 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm mb-2" style={{ color: `${theme.textColor}80` }}>
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 transition-all"
                    style={{
                      borderRadius: radius,
                      color: theme.textColor,
                      backgroundColor: `${theme.textColor}5`,
                      border: `1px solid ${theme.textColor}10`,
                      outline: 'none',
                    }}
                    placeholder="Your name"
                    value={data.name || ''}
                    readOnly={!isEditing}
                    onChange={() => {}}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: `${theme.textColor}80` }}>
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 transition-all"
                    style={{
                      borderRadius: radius,
                      color: theme.textColor,
                      backgroundColor: `${theme.textColor}5`,
                      border: `1px solid ${theme.textColor}10`,
                      outline: 'none',
                    }}
                    placeholder="your.email@example.com"
                    value={data.email || ''}
                    readOnly={!isEditing}
                    onChange={() => {}}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: `${theme.textColor}80` }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 transition-all"
                    style={{
                      borderRadius: radius,
                      color: theme.textColor,
                      backgroundColor: `${theme.textColor}5`,
                      border: `1px solid ${theme.textColor}10`,
                      outline: 'none',
                    }}
                    placeholder="What's this about?"
                    value={data.formSubject || ''}
                    readOnly={!isEditing}
                    onChange={() => {}}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: `${theme.textColor}80` }}>
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 transition-all resize-none"
                    style={{
                      borderRadius: radius,
                      color: theme.textColor,
                      backgroundColor: `${theme.textColor}5`,
                      border: `1px solid ${theme.textColor}10`,
                      outline: 'none',
                    }}
                    placeholder="Your message..."
                    value={data.formMessage || ''}
                    readOnly={!isEditing}
                    onChange={() => {}}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 font-semibold transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: '#000',
                    borderRadius: radius,
                  }}
                >
                  <span>Send Message</span>
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
