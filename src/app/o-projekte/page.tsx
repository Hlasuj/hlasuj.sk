import Link from 'next/link';

export const metadata = {
  title: 'O projekte',
  description:
    'Hlasuj.sk je anonymná platforma pre slovenské ankety. Zistite, prečo vznikla a ako funguje ochrana vášho súkromia.',
};

const S = {
  page: {
    minHeight: '100vh',
    background: '#FAFBFC',
    fontFamily: "'DM Sans', sans-serif",
  } as const,
  header: {
    borderBottom: '1px solid #D1D9E6',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as const,
  logo: { display: 'flex', alignItems: 'center', gap: 8 } as const,
  logoCircle: {
    width: 26,
    height: 26,
    background: '#0F2044',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const,
  logoInner: {
    width: 9,
    height: 9,
    borderRadius: '50%',
    background: '#FAFBFC',
  } as const,
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 17,
    fontWeight: 600,
    color: '#0F2044',
  } as const,
  back: {
    background: 'none',
    border: '1px solid #D1D9E6',
    color: '#555',
    padding: '6px 16px',
    fontSize: 12,
    textDecoration: 'none',
    display: 'inline-block',
  } as const,
  body: { maxWidth: 640, margin: '0 auto', padding: '56px 24px 80px' } as const,
  label: {
    fontSize: 11,
    color: '#444',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginBottom: 12,
    fontFamily: "'DM Sans', sans-serif",
  } as const,
  h1: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32,
    fontWeight: 600,
    color: '#0F2044',
    marginBottom: 32,
    lineHeight: 1.3,
  } as const,
  p: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 1.8,
    marginBottom: 20,
  } as const,
};

export default function OProjekte() {
  return (
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');`}</style>
      <header style={S.header}>
        <div style={S.logo}>
          <div style={S.logoCircle}>
            <div style={S.logoInner} />
          </div>
          <span style={S.logoText}>hlasuj.sk</span>
        </div>
        <Link href="/" style={S.back}>
          ← Späť
        </Link>
      </header>
      <div style={S.body}>
        <div style={S.label}>O projekte</div>
        <h1 style={S.h1}>Anonymná platforma pre slovenské ankety</h1>
        <p style={S.p}>
          Hlasuj.sk je nezávislá platforma, ktorá dáva Slovákom priestor
          vyjadriť svoj názor — bez registrácie, bez sledovania, bez politickej
          agendy. Každá anketa je anonymná a výsledky sú agregované tak, aby
          nebolo možné identifikovať konkrétneho respondenta.
        </p>
        <p style={S.p}>
          Cieľom projektu je zachytiť, čo si Slováci naozaj myslia o aktuálnych
          témach — ekonomike, politike, každodennom živote — a výsledky zdieľať
          verejne. Nie ako záväzný prieskum, ale ako úprimný odraz nálady v
          spoločnosti.
        </p>
        <p style={S.p}>
          Platforma nezboiera IP adresy ani cookies. Zaznamenávame len vekovú
          skupinu, pohlavie, krajinu (odvodenú zo servera bez uloženia IP) a typ