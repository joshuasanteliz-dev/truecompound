import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LanguageProvider, useT } from '@/i18n';

const About = lazy(() => import('@/pages/About'));
const LandingMissingLayer = lazy(() => import('@/pages/LandingMissingLayer'));
const Inflation = lazy(() => import('@/modes/Inflation'));
const DCA = lazy(() => import('@/modes/DCA'));
const Debt = lazy(() => import('@/modes/Debt'));
const Tax = lazy(() => import('@/modes/Tax'));
const MonteCarlo = lazy(() => import('@/modes/MonteCarlo'));
const Privacy = lazy(() => import('@/pages/legal/Privacy'));
const Terms = lazy(() => import('@/pages/legal/Terms'));
const Cookies = lazy(() => import('@/pages/legal/Cookies'));
const Imprint = lazy(() => import('@/pages/legal/Imprint'));

function ModeLoader() {
  const t = useT();
  return (
    <div className="flex items-center justify-center py-24 text-muted text-sm">
      <span className="animate-pulse">{t.common.loading}</span>
    </div>
  );
}

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<ModeLoader />}>{node}</Suspense>;
}

function NotFound() {
  const t = useT();
  return (
    <div className="py-24 text-center">
      <div className="label mb-2 text-emerald">404</div>
      <h1 className="display-tight text-3xl sm:text-4xl text-ink">
        {t.common.backHome}
      </h1>
      <Link to="/" className="mt-4 inline-block text-emerald hover:text-emerald-light text-sm font-semibold">
        ← {t.common.backHome}
      </Link>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: withSuspense(<LandingMissingLayer />) },
      { path: 'about', element: withSuspense(<About />) },
      { path: 'inflation', element: withSuspense(<Inflation />) },
      { path: 'dca', element: withSuspense(<DCA />) },
      { path: 'debt', element: withSuspense(<Debt />) },
      { path: 'tax', element: withSuspense(<Tax />) },
      { path: 'monte-carlo', element: withSuspense(<MonteCarlo />) },
      { path: 'privacy', element: withSuspense(<Privacy />) },
      { path: 'terms', element: withSuspense(<Terms />) },
      { path: 'cookies', element: withSuspense(<Cookies />) },
      { path: 'legal', element: withSuspense(<Imprint />) },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <LanguageProvider>
      <RouterProvider router={router} />
    </LanguageProvider>
  );
}
