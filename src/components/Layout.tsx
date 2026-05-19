import { Link, NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/inflation', label: 'Inflation' },
  { to: '/dca', label: 'DCA' },
  { to: '/debt', label: 'Debt' },
  { to: '/tax', label: 'Tax' },
  { to: '/monte-carlo', label: 'Monte Carlo' },
];

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <header className="border-b border-gray-200 bg-canvas/90 backdrop-blur sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo />
            <span className="font-semibold tracking-tight text-lg">WhatIfMoney</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive ? 'text-emerald bg-emerald/5' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Link to="/about" className="text-sm text-muted hover:text-ink hidden sm:inline">
            About
          </Link>
        </div>
        <nav className="md:hidden border-t border-gray-200 overflow-x-auto">
          <div className="mx-auto max-w-6xl flex gap-1 px-4 py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap ${
                    isActive ? 'text-emerald bg-emerald/5' : 'text-muted'
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
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
          <p>
            Not financial advice. Built by{' '}
            <a
              href="https://github.com/jsantelizf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-emerald"
            >
              Joshua Santeliz
            </a>
            .
          </p>
          <Link to="/about" className="hover:text-ink">
            About this project
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="12" fill="#0F766E" />
      <path
        d="M10 48 L22 30 L32 38 L54 16"
        stroke="#FAFAF7"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="54" cy="16" r="3.5" fill="#FAFAF7" />
    </svg>
  );
}
