import { LegalPage } from './LegalPage';
import { useT } from '@/i18n';

export default function Imprint() {
  const t = useT();
  const p = t.legal.imprint;
  return <LegalPage title={p.title} lastUpdated={p.lastUpdated} sections={p.sections} />;
}
