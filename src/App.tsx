import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import Landing from '@/pages/Landing';

const About = lazy(() => import('@/pages/About'));
const Inflation = lazy(() => import('@/modes/Inflation'));
const DCA = lazy(() => import('@/modes/DCA'));
const Debt = lazy(() => import('@/modes/Debt'));
const Tax = lazy(() => import('@/modes/Tax'));
const MonteCarlo = lazy(() => import('@/modes/MonteCarlo'));

function ModeLoader() {
  return (
    <div className="flex items-center justify-center py-24 text-muted text-sm">
      <span className="animate-pulse">Loading…</span>
    </div>
  );
}

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<ModeLoader />}>{node}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'about', element: withSuspense(<About />) },
      { path: 'inflation', element: withSuspense(<Inflation />) },
      { path: 'dca', element: withSuspense(<DCA />) },
      { path: 'debt', element: withSuspense(<Debt />) },
      { path: 'tax', element: withSuspense(<Tax />) },
      { path: 'monte-carlo', element: withSuspense(<MonteCarlo />) },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

function NotFound() {
  return (
    <div className="py-24 text-center">
      <div className="label mb-2">404</div>
      <h1 className="text-3xl font-semibold tracking-tight">That page isn't part of the suite.</h1>
      <a href="/" className="mt-4 inline-block text-emerald hover:text-emerald-dark text-sm font-medium">
        ← Back home
      </a>
    </div>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}
