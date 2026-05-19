import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

type Setter<T> = (patch: Partial<T>) => void;
type Numerizer<T> = { [K in keyof T]?: 'number' | 'int' | 'string' };

/**
 * On first mount only, read query-params and apply them via `setter` to hydrate
 * the store with a shared scenario. Subsequent navigation does not re-read.
 */
export function useUrlHydrate<T extends Record<string, unknown>>(
  setter: Setter<T>,
  shape: Numerizer<T>,
) {
  const { search } = useLocation();
  const hydrated = useRef(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    if (!search) return;

    const sp = new URLSearchParams(search);
    const patch: Record<string, unknown> = {};
    for (const [key, kind] of Object.entries(shape)) {
      const raw = sp.get(key);
      if (raw === null) continue;
      if (kind === 'number') {
        const n = Number(raw);
        if (Number.isFinite(n)) patch[key] = n;
      } else if (kind === 'int') {
        const n = parseInt(raw, 10);
        if (Number.isFinite(n)) patch[key] = n;
      } else {
        patch[key] = raw;
      }
    }
    if (Object.keys(patch).length) setter(patch as Partial<T>);
  }, [search, setter, shape]);
}
