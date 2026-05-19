import { useState } from 'react';

interface Props {
  /** A record of query-param-friendly key/value pairs encoding the current scenario. */
  params: Record<string, string | number>;
}

export function ShareButton({ params }: Props) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) sp.set(k, String(v));
    const url = `${window.location.origin}${window.location.pathname}?${sp.toString()}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.history.replaceState(null, '', `?${sp.toString()}`);
    }
  };

  return (
    <button type="button" onClick={share} className="btn-secondary">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-1.5">
        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      {copied ? 'Copied!' : 'Share scenario'}
    </button>
  );
}
