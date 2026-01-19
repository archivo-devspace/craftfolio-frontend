'use client';

import { ContactSection as ContactSectionType } from '@/types/portfolio';
import { usePortfolioStore } from '@/store/portfolioStore';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Instagram
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
  const { portfolio } = usePortfolioStore();
  const { theme } = portfolio;

  // Map border radius to actual values
  const borderRadiusMap = {
    none: '0px',
    small: '4px',
    medium: '8px',
    large: '16px',
  };
  const radius = borderRadiusMap[theme.borderRadius] || '8px';
  const largeRadius = theme.borderRadius === 'none' ? '0px' : theme.borderRadius === 'small' ? '8px' : theme.borderRadius === 'medium' ? '16px' : '24px';

  const getSocialIcon = (platform: string) => {
    const Icon = socialIcons[platform.toLowerCase()] || Globe;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <section
      data-section-type="contact"
      className="py-24 px-4 relative overflow-hidden"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.primaryColor}15` }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full blur-3xl"
          style={{ backgroundColor: `${theme.accentColor}15` }}
        />
      </div>

      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${theme.textColor}30 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            {data.title || 'Get In Touch'}
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: `${theme.textColor}99` }}>
            {data.subtitle || "Let's work together on something great"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-cloud mb-6">Contact Information</h3>

            {/* Contact Details */}
            <div className="space-y-4">
              {data.email && (
                <a
                  href={`mailto:${data.email}`}
                  className="flex items-center gap-4 p-4 glass hover:bg-white/10 transition-colors group"
                  style={{ borderRadius: radius }}
                >
                  <div
                    className="p-3 transition-colors"
                    style={{
                      backgroundColor: `${theme.primaryColor}20`,
                      color: theme.primaryColor,
                      borderRadius: radius
                    }}
                  >
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: `${theme.textColor}80` }}>Email</p>
                    <p style={{ color: theme.textColor }}>{data.email}</p>
                  </div>
                </a>
              )}

              {data.phone && (
                <a
                  href={`tel:${data.phone}`}
                  className="flex items-center gap-4 p-4 glass hover:bg-white/10 transition-colors group"
                  style={{ borderRadius: radius }}
                >
                  <div
                    className="p-3 transition-colors"
                    style={{
                      backgroundColor: `${theme.accentColor}20`,
                      color: theme.accentColor,
                      borderRadius: radius
                    }}
                  >
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: `${theme.textColor}80` }}>Phone</p>
                    <p style={{ color: theme.textColor }}>{data.phone}</p>
                  </div>
                </a>
              )}

              {data.location && (
                <div className="flex items-center gap-4 p-4 glass" style={{ borderRadius: radius }}>
                  <div
                    className="p-3"
                    style={{
                      backgroundColor: `${theme.secondaryColor}20`,
                      color: theme.secondaryColor,
                      borderRadius: radius
                    }}
                  >
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: `${theme.textColor}80` }}>Location</p>
                    <p style={{ color: theme.textColor }}>{data.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            {data.socials && data.socials.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-cloud mb-4">Follow Me</h4>
                <div className="flex flex-wrap gap-3">
                  {data.socials.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 glass rounded-xl hover:bg-white/10 transition-all hover:scale-110"
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
              <div className="text-center py-8 glass rounded-2xl">
                <p className="text-fog/50">Add your contact information</p>
              </div>
            )}
          </div>

          {/* Contact Form */}
          {data.showForm && (
            <div className="glass p-8" style={{ borderRadius: largeRadius }}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: theme.textColor }}>Send a Message</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm mb-2" style={{ color: `${theme.textColor}aa` }}>Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{
                      borderRadius: radius,
                      color: theme.textColor,
                      outlineColor: theme.primaryColor
                    }}
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: `${theme.textColor}aa` }}>Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{
                      borderRadius: radius,
                      color: theme.textColor
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: `${theme.textColor}aa` }}>Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                    style={{
                      borderRadius: radius,
                      color: theme.textColor
                    }}
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2" style={{ color: `${theme.textColor}aa` }}>Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none"
                    style={{
                      borderRadius: radius,
                      color: theme.textColor
                    }}
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-white font-semibold hover:opacity-90 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
                  style={{
                    background: `linear-gradient(to right, ${theme.primaryColor}, ${theme.accentColor})`,
                    borderRadius: radius
                  }}
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
