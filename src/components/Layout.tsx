import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useT } from '@/i18n';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ScrollToTop } from '@/components/ScrollToTop';
import { CookieNotice } from '@/components/CookieNotice';

const OWNER = 'Joshua Santeliz';
const GITHUB = 'https://github.com/joshuasanteliz-dev';

// Subtle context-change cue on route change: the routed page fades in while
// settling up a few pixels. Keyed by pathname so it replays per navigation,
// not on unrelated re-renders. Easing matches the recalculation feedback.
const pageTransitionStyles = `
@keyframes pageEnter {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-transition {
  animation: pageEnter 150ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

@media (prefers-reduced-motion: reduce) {
  .page-transition {
    animation: none;
  }
}
`;

export function Layout() {
  const t = useT();
  const { pathname } = useLocation();

  // On the landing page the logo links to the route we are already on, so React
  // Router does nothing. Intercept that case and smoothly return to the top instead.
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') return;
    e.preventDefault();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: prefersReducedMotion ? ('instant' as ScrollBehavior) : 'smooth' });
  };

  const navItems = [
    { to: '/inflation', label: t.nav.inflation },
    { to: '/dca', label: t.nav.dca },
    { to: '/debt', label: t.nav.debt },
    { to: '/tax', label: t.nav.tax },
    { to: '/monte-carlo', label: t.nav.monteCarlo },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <style>{pageTransitionStyles}</style>
      <ScrollToTop />
      <header className="border-b border-border bg-canvas/85 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 gap-3">
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 group shrink-0">
            <Logo />
            <span className="display text-lg text-ink hidden sm:inline">{t.common.appName}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-semibold tracking-tight transition-colors ${
                    isActive ? 'text-emerald bg-emerald/10' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/about" className="text-sm text-muted hover:text-ink hidden sm:inline">
              {t.nav.about}
            </Link>
            <LanguageToggle />
          </div>
        </div>
        <nav className="md:hidden border-t border-border overflow-x-auto">
          <div className="mx-auto max-w-6xl flex gap-1 px-4 py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-semibold whitespace-nowrap transition-colors ${
                    isActive ? 'text-emerald bg-emerald/10' : 'text-muted'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div key={pathname} className="page-transition">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-3 text-sm text-muted">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>
              {t.common.notFinancialAdvice} {t.common.builtBy}{' '}
              <a
                href={GITHUB}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink hover:text-emerald"
              >
                {OWNER}
              </a>
              .
            </p>
            <Link to="/about" className="hover:text-ink">
              {t.common.aboutThisProject}
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-3 text-xs">
            <Link to="/privacy" className="hover:text-ink">{t.nav.privacy}</Link>
            <Link to="/terms" className="hover:text-ink">{t.nav.terms}</Link>
            <Link to="/cookies" className="hover:text-ink">{t.nav.cookies}</Link>
            <Link to="/legal" className="hover:text-ink">{t.nav.legal}</Link>
          </div>
        </div>
      </footer>

      <CookieNotice />
    </div>
  );
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="12" fill="#22C55E" />
      <path
        d="M10 48 L22 30 L32 38 L54 16"
        stroke="#0B0E14"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="54" cy="16" r="3.5" fill="#0B0E14" />
    </svg>
  );
}
