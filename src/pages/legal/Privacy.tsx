import { LegalPage } from './LegalPage';
import { useT } from '@/i18n';

export default function Privacy() {
  const t = useT();
  const p = t.legal.privacy;
  return <LegalPage title={p.title} lastUpdated={p.lastUpdated} sections={p.sections} />;
}
