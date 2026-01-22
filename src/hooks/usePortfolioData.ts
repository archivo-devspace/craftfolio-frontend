'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useAuthStore } from '@/store/authStore';
import { Portfolio, PortfolioTheme, Section } from '@/types/portfolio';

interface UsePortfolioDataReturn {
  isLoading: boolean;
  error: string | null;
  loadPortfolio: () => Promise<void>;
  refreshPortfolio: () => Promise<void>;
}

export function usePortfolioData(): UsePortfolioDataReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { loadPortfolio: setPortfolio } = usePortfolioStore();

  const loadPortfolio = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await api.getPortfolios();
      if (result.error) {
        setError(result.error);
      } else if (result.data && result.data.length > 0) {
        const latestPortfolio = result.data[0];
        setPortfolio({
          id: latestPortfolio.id,
          name: latestPortfolio.name,
          slug: latestPortfolio.slug,
          published: latestPortfolio.published,
          theme: latestPortfolio.theme as unknown as PortfolioTheme,
          sections: latestPortfolio.sections as unknown as Section[],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPortfolio = async () => {
    await loadPortfolio();
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  return { isLoading, error, loadPortfolio, refreshPortfolio };
}

interface UsePublicPortfolioParams {
  slug: string;
  name: string;
}

export function usePublicPortfolio({ slug, name }: UsePublicPortfolioParams) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { loadPortfolio } = usePortfolioStore();

  useEffect(() => {
    const fetchPortfolio = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await api.getPublicPortfolio(slug, name);
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          loadPortfolio({
            id: result.data.id,
            name: result.data.name,
            slug: result.data.slug,
            published: result.data.published,
            theme: result.data.theme as unknown as PortfolioTheme,
            sections: result.data.sections as unknown as Section[],
          });
        } else {
          setError('Portfolio not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug, name, loadPortfolio]);

  return { isLoading, error };
}

export function useAuthCheck() {
  const { checkAuth, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsInitialized(true);
    };
    initAuth();
  }, [checkAuth]);

  return { isAuthenticated, isLoading: authLoading || !isInitialized };
}

export function usePortfolioSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { portfolio, loadPortfolio } = usePortfolioStore();
  const { isAuthenticated } = useAuthStore();

  const save = async () => {
    if (!isAuthenticated) return { success: false, error: 'Not authenticated' };

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const portfolioData = {
        name: portfolio.name,
        slug: portfolio.slug,
        published: portfolio.published,
        theme: JSON.parse(JSON.stringify(portfolio.theme)) as Record<string, unknown>,
        sections: JSON.parse(JSON.stringify(portfolio.sections)) as unknown[],
      };

      let result;
      if (portfolio.id) {
        result = await api.updatePortfolio(portfolio.id, portfolioData);
      } else {
        result = await api.createPortfolio(portfolioData);
        if (result.data) {
          loadPortfolio({ ...portfolio, id: result.data.id });
        }
      }

      if (result.error) {
        setSaveStatus('error');
        return { success: false, error: result.error };
      }

      setSaveStatus('success');
      return { success: true };
    } catch (err) {
      setSaveStatus('error');
      return { success: false, error: err instanceof Error ? err.message : 'Save failed' };
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const resetSaveStatus = () => setSaveStatus('idle');

  return { isSaving, saveStatus, save, resetSaveStatus };
}
