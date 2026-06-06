import Link from 'next/link';

export const metadata = { title: 'Ochrana súkromia – Hlasuj.sk' };

const S = {
  page: {
    minHeight: '100vh',
    background: '#0A0F1E',
    fontFamily: "'DM Sans', sans-serif",
  } as const,
  header: {
    borderBottom: '1px solid #1a1a2e',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as const,
  logo: { display: 'flex', alignItems: 'center', gap: 8 } as const,
  logoCircle: {
    width: 26,
    height: 26,
    background: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const,
  logoInner: {
    width: 9,
    height: 9,
    borderRadius: '50%',
    background: '#0F2044',
  } as const,
  logoText: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 17,
    fontWeight: 600,
    color: '#fff',
  } as const,
  back: {
    background: 'none',
    border: '1px solid #1a1a2e',
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
    color: '#fff',
    marginBottom: 32,
    lineHeight: 1.3,
  } as const,
  h2: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 600,
    color: '#6B8CB8',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    marginBottom: 10,
    marginTop: 36,
  },
  p: {
    fontSize: 15,
    color: '#8a9ab8',
    lineHeight: 1.8,
    marginBottom: 16,
  } as const,
  updated: { fontSize: 12, color: '#333', marginBottom: 40 } as const,
};

export default function OchranaSukromia() {
  return (
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
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
        <div style={S.label}>Právne informácie</div>
        <h1 style={S.h1}>Ochrana osobných údajov</h1>
        <p style={S.updated}>Posledná aktualizácia: jún 2025</p>

        <h2 style={S.h2}>Aké údaje zbierame</h2>
        <p style={S.p}>
          Pri každom hlasovaní zbierame nasledovné údaje, ktoré ste zadali
          dobrovoľne: veková skupina a pohlavie. Automaticky zo servera
          odvodzujeme: krajinu pôvodu (z IP adresy — IP adresa samotná sa
          neukladá), typ zariadenia a jazykové nastavenie prehliadača.
        </p>
        <p style={S.p}>
          Pre vybrané ankety môžeme požiadať o telefónne číslo. Toto je vždy
          nepovinné a je to jasne označené priamo pri otázke.
        </p>

        <h2 style={S.h2}>Čo nezbierame</h2>
        <p style={S.p}>
          Nezbierame IP adresy, cookies, identifikátory zariadení ani žiadne iné
          údaje umožňujúce identifikáciu konkrétnej osoby. Na stránke nie je
          žiadny sledovací kód tretích strán (Google Analytics a podobne).
        </p>

        <h2 style={S.h2}>Ako dlho údaje uchovávame</h2>
        <p style={S.p}>
          Anonymizované výsledky hlasovania (veková skupina, pohlavie, krajina,
          zariadenie) uchovávame bez časového obmedzenia na účely zobrazovania
          historických výsledkov.
        </p>
        <p style={S.p}>
          Telefónne čísla sú automaticky vymazané po uplynutí retenčnej doby
          nastavenej pre konkrétnu anketu (predvolene 30 dní od ukončenia
          ankety). Mazanie prebieha automaticky každú noc o 02:00 UTC.
        </p>

        <h2 style={S.h2}>Kto má prístup k údajom</h2>
        <p style={S.p}>
          Agregované výsledky (percentuálne rozloženie odpovedí, demografické
          štatistiky) sú verejne dostupné v archíve predchádzajúcich ankiet.
          Surové dáta vrátane demografického členenia sú prístupné iba
          administrátorovi projektu.
        </p>
        <p style={S.p}>
          Dáta sú uložené v databáze Supabase na serveroch v EÚ (Frankfurt, AWS
          eu-central-1), čím je zabezpečený súlad s nariadením GDPR.
        </p>

        <h2 style={S.h2}>Vaše práva</h2>
        <p style={S.p}>
          Keďže neuchovávame žiadne osobné identifikátory, nie je možné spojiť
          konkrétny hlas s konkrétnou osobou. Ak ste poskytli telefónne číslo a
          žiadate o jeho vymazanie pred uplynutím retenčnej doby, kontaktujte
          nás na adrese uvedenej nižšie.
        </p>

        <h2 style={S.h2}>Kontakt</h2>
        <p style={S.p}>
          Otázky týkajúce sa ochrany osobných údajov zasielajte na:{' '}
          <span style={{ color: '#6B8CB8' }}>info@hlasuj.sk</span>
        </p>
      </div>
    </div>
  );
}
