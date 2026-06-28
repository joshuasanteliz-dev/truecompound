import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { dictionaries, type Lang, type Dictionary } from './translations';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dictionary;
}

const Ctx = createContext<LangCtx | null>(null);

const STORAGE_KEY = 'whatifmoney-lang';

function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    /* localStorage may throw in some sandboxes — fall through */
  }
  const browser = (navigator.language || 'en').toLowerCase();
  return browser.startsWith('es') ? 'es' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => detectInitialLang());

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = dictionaries[lang];

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useT() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useT must be used within a <LanguageProvider>');
  return ctx.t;
}

export function useLang() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used within a <LanguageProvider>');
  return { lang: ctx.lang, setLang: ctx.setLang };
}
