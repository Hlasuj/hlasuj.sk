'use client';
import { useState } from 'react';

const FAQS = [
  {
    q: 'Ako funguje hlasovanie?',
    a: 'Vyberte vek a pohlavie, potom odpovedzte na aktívne otázky a odošlite. Celý proces trvá menej ako minútu. Žiadna registrácia ani inštalácia.',
  },
  {
    q: 'Je hlasovanie anonymné?',
    a: 'Áno, úplne. Nezbierame IP adresy ani cookies. Zaznamenávame len vek, pohlavie, krajinu (odvodenú zo servera bez uloženia IP) a typ zariadenia — bez možnosti identifikácie konkrétnej osoby.',
  },
  {
    q: 'Môžem hlasovať viackrát?',
    a: 'Každá anketa umožňuje jeden hlas na odoslanie. Keďže nepoužívame cookies, opakované hlasovanie nie je technicky zablokované, ale výsledky berieme ako orientačné.',
  },
  {
    q: 'Kto vidí výsledky?',
    a: 'Výsledky vidí iba administrátor. Po spracovaní ich môžeme zverejniť formou prehľadov alebo infografík na sociálnych sieťach.',
  },
  {
    q: 'Ako často sa ankety menia?',
    a: 'Zvyčajne každý jeden až dva týždne podľa aktuálnych tém. Každá anketa má definovaný začiatok a koniec — po vypršaní sa automaticky zobrazí nová.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div
      id="faq"
      style={{
        borderTop: '1px solid #E5E7EB',
        padding: '48px 24px 72px',
        maxWidth: 680,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase' as const,
          color: '#6B7280',
          marginBottom: 24,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Časté otázky
      </div>
      {FAQS.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #E5E7EB' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%',
              textAlign: 'left' as const,
              background: 'none',
              border: 'none',
              padding: '18px 0',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15,
                fontWeight: 500,
                color: '#374151',
              }}
            >
              {item.q}
            </span>
            <span
              style={{
                fontSize: 18,
                color: '#9CA3AF',
                flexShrink: 0,
                display: 'inline-block',
                transform: open === i ? 'rotate(45deg)' : 'none',
                transition: 'transform 0.2s ease',
                lineHeight: 1,
              }}
            >
              +
            </span>
          </button>
          {open === i && (
            <div
              style={{
                paddingBottom: 20,
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 14,
                color: '#6B7280',
                lineHeight: 1.75,
              }}
            >
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
