import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Predchádzajúce ankety',
  description:
    'Výsledky ukončených slovenských ankiet. Pozrite si, ako Slováci hlasovali v minulých prieskumoch na hlasuj.sk.',
  alternates: { canonical: '/predchadzajuce-ankety' },
  openGraph: {
    title: 'Predchádzajúce ankety | hlasuj.sk',
    description:
      'Výsledky ukončených slovenských ankiet. Pozrite si, ako Slováci hlasovali v minulých prieskumoch na hlasuj.sk.',
    url: '/predchadzajuce-ankety',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
