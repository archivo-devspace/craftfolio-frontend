'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { usePortfolioStore } from '@/store/portfolioStore';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import {
    HeroSection,
    AboutSection,
    ProjectsSection,
    SkillsSection,
    ExperienceSection,
    ContactSection,
} from '@/components/sections';
import { Section } from '@/types/portfolio';

export default function PreviewPage() {
    const params = useParams();
    const slug = params.slug as string;
    const name = params.name as string;
    console.log('PreviewPage mounted', { slug, name });
    // We ignore the name param as it's just for vanity/SEO, slug is the identifier
    const { loadPortfolio, portfolio } = usePortfolioStore();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('PreviewPage mounted', { slug, name });
        const fetchPortfolio = async () => {
            // if (!slug) return;

            // If we already have the portfolio in store and it matches the slug, use it
            // This is useful when coming from the builder


            try {
                const result = await api.getPublicPortfolio(slug, name);
                console.log('Portfolio fetched', result.data);
                if (result.data) {
                    loadPortfolio({
                        id: result.data.id,
                        name: result.data.name,
                        slug: result.data.slug,
                        published: result.data.published,
                        theme: result.data.theme as unknown as import('@/types/portfolio').PortfolioTheme,
                        sections: result.data.sections as unknown as import('@/types/portfolio').Section[],
                    });
                } else {
                    setError('Portfolio not found');
                }
            } catch (err: any) {
                console.error('API Error:', err);
                setError(err.message || 'Failed to load portfolio');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolio();
    }, [slug, loadPortfolio]);

    // Map border radius to actual values
    const borderRadiusMap = {
        none: '0px',
        small: '4px',
        medium: '8px',
        large: '16px',
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-obsidian">
                <Loader2 className="w-10 h-10 animate-spin text-electric-violet" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-obsidian text-fog">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Error</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    // Apply theme as CSS variables
    const themeStyles = {
        '--theme-primary': portfolio.theme.primaryColor,
        '--theme-secondary': portfolio.theme.secondaryColor,
        '--theme-accent': portfolio.theme.accentColor,
        '--theme-background': portfolio.theme.backgroundColor,
        '--theme-text': portfolio.theme.textColor,
        '--theme-radius': borderRadiusMap[portfolio.theme.borderRadius] || '8px',
        '--theme-font': portfolio.theme.fontFamily,
    } as React.CSSProperties;

    // Use a copy for sorting to avoid mutating state directly in strict mode
    const sortedSections = [...portfolio.sections].sort((a, b) => a.order - b.order);

    return (
        <main className="min-h-screen" style={themeStyles}>
            {sortedSections
                .filter((s) => s.visible)
                .map((section) => (
                    <SectionRenderer key={section.id} section={section} />
                ))}
            {/* Attribution footer */}
            <footer className="py-6 text-center text-sm opacity-50 absolute bottom-0 w-full pointer-events-none">
                <p>Built with CraftFolio</p>
            </footer>
        </main>
    );
}

function SectionRenderer({ section }: { section: Section }) {
    switch (section.type) {
        case 'hero':
            return <HeroSection section={section} isEditing={false} />;
        case 'about':
            return <AboutSection section={section} isEditing={false} />;
        case 'projects':
            return <ProjectsSection section={section} isEditing={false} />;
        case 'skills':
            return <SkillsSection section={section} isEditing={false} />;
        case 'experience':
            return <ExperienceSection section={section} isEditing={false} />;
        case 'contact':
            return <ContactSection section={section} isEditing={false} />;
        default:
            return null;
    }
}
