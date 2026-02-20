'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { usePortfolioStore } from '@/store/portfolioStore';
import { useLocaleStore } from '@/store/localeStore';
import { api } from '@/lib/api';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

function localizeAuthError(error: string, t: (key: string) => string) {
  const normalized = error.toLowerCase();

  if (normalized.includes('invalid') && normalized.includes('credential')) {
    return t('auth.errors.invalidCredentials');
  }
  if (normalized.includes('unauthorized')) {
    return t('auth.errors.unauthorized');
  }
  if (normalized.includes('already') && (normalized.includes('exist') || normalized.includes('taken'))) {
    return t('auth.errors.userExists');
  }
  if (normalized.includes('email') && normalized.includes('invalid')) {
    return t('auth.errors.invalidEmail');
  }
  if (
    normalized.includes('password') &&
    (normalized.includes('at least') || normalized.includes('minimum') || normalized.includes('6'))
  ) {
    return t('auth.errors.passwordMin');
  }
  if (normalized.includes('network') || normalized.includes('failed to fetch')) {
    return t('auth.errors.network');
  }

  return error || t('auth.errors.default');
}

export function AuthModal({ isOpen, onClose, className = '' }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const { login, register, isLoading, error, clearError } = useAuthStore();
  const { loadPortfolio, resetPortfolio } = usePortfolioStore();
  const { t } = useLocaleStore();

  if (!isOpen) return null;

  const fetchAndLoadUserPortfolio = async () => {
    // Ensure we never keep stale data from previous account
    resetPortfolio();

    const result = await api.getPortfolios();
    if (result.data && result.data.length > 0) {
      // Load the most recent portfolio
      const latestPortfolio = result.data[0];
      loadPortfolio({
        id: latestPortfolio.id,
        name: latestPortfolio.name,
        slug: latestPortfolio.slug,
        published: latestPortfolio.published,
        theme: latestPortfolio.theme as unknown as import('@/types/portfolio').PortfolioTheme,
        sections: latestPortfolio.sections as unknown as import('@/types/portfolio').Section[],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let success = false;
    if (mode === 'login') {
      success = await login(email, password);
    } else {
      success = await register(email, password, name);
    }

    if (success) {
      // Fetch user's portfolios after successful login
      await fetchAndLoadUserPortfolio();
      
      onClose();
      setEmail('');
      setPassword('');
      setName('');
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    clearError();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 ${className}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[92dvh] overflow-y-auto glass rounded-2xl p-5 sm:p-8 animate-in fade-in zoom-in duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {mode === 'login' ? t('auth.welcomeBack') : t('auth.createAccount')}
          </h2>
          <p className="text-fog/60 mt-2 text-sm">
            {mode === 'login' 
              ? t('auth.signInToAccess')
              : t('auth.startBuilding')}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {localizeAuthError(error, t)}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-fog/70 text-sm mb-2">{t('auth.name')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fog/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('auth.namePlaceholder')}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-cloud placeholder-fog/30"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-fog/70 text-sm mb-2">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fog/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('auth.emailPlaceholder')}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-cloud placeholder-fog/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-fog/70 text-sm mb-2">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-fog/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-cloud placeholder-fog/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary text-black rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t('auth.pleaseWait')}</span>
            </>
          ) : (
            <span>{mode === 'login' ? t('auth.signIn') : t('auth.createAccountAction')}</span>
          )}
        </button>
        </form>

        {/* Switch mode */}
        <div className="mt-6 text-center text-sm">
          <span className="text-fog/60">
            {mode === 'login' ? `${t('auth.dontHaveAccount')} ` : `${t('auth.alreadyHaveAccount')} `}
          </span>
          <button
            onClick={switchMode}
            className="text-primary hover:underline font-medium"
          >
            {mode === 'login' ? t('auth.signUp') : t('auth.signIn')}
          </button>
        </div>
      </div>
    </div>
  );
}
