import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Predchádzajúce ankety',
  description:
    'Výsledky ukončených slovenských ankiet. Pozrite si, ako Slováci hlasovali v minulých prieskumoch na hlasuj.sk.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
