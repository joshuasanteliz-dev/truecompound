import { LegalPage } from './LegalPage';
import { useT } from '@/i18n';

export default function Terms() {
  const t = useT();
  const p = t.legal.terms;
  return <LegalPage title={p.title} lastUpdated={p.lastUpdated} sections={p.sections} />;
}
