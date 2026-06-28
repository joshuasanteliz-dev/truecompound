import { useLang } from '@/i18n';

/**
 * Tiny EN/ES segmented toggle for the header. Two-letter labels keep the
 * footprint small on mobile.
 */
export function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex rounded-md border border-border bg-surface p-0.5 text-[11px] font-bold tracking-wider">
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`px-2 py-1 rounded transition-colors ${
          lang === 'en' ? 'bg-emerald text-canvas' : 'text-muted hover:text-ink'
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang('es')}
        aria-pressed={lang === 'es'}
        className={`px-2 py-1 rounded transition-colors ${
          lang === 'es' ? 'bg-emerald text-canvas' : 'text-muted hover:text-ink'
        }`}
      >
        ES
      </button>
    </div>
  );
}
