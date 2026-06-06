import Link from 'next/link';

export const metadata = { title: 'Kontakt – Hlasuj.sk' };

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
  body: { maxWidth: 560, margin: '0 auto', padding: '56px 24px 80px' } as const,
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
    marginBottom: 12,
    lineHeight: 1.3,
  } as const,
  sub: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 1.7,
    marginBottom: 40,
  } as const,
  fieldLabel: {
    display: 'block',
    fontSize: 11,
    color: '#444',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    marginBottom: 8,
    fontFamily: "'DM Sans', sans-serif",
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: '#F0F2F5',
    border: '1px solid #D1D9E6',
    color: '#2D3748',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
    marginBottom: 20,
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    background: '#F0F2F5',
    border: '1px solid #D1D9E6',
    color: '#2D3748',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box' as const,
    resize: 'vertical' as const,
    minHeight: 140,
    marginBottom: 24,
  },
  btn: {
    background: '#2563EB',
    border: 'none',
    color: '#fff',
    padding: '12px 28px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  } as const,
  emailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
    padding: '16px 20px',
    border: '1px solid #D1D9E6',
    background: '#F0F2F5',
  } as const,
};

export default function Kontakt() {
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
        <div style={S.label}>Kontakt</div>
        <h1 style={S.h1}>Máte otázky alebo návrhy?</h1>
        <p style={S.sub}>
          Napíšte nám. Snažíme sa odpovedať do 2 pracovných dní.
        </p>

        <div style={S.emailRow}>
          <span style={{ fontSize: 16 }}>✉</span>
          <span
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              color: '#2563EB',
            }}
          >
            info@hlasuj.sk
          </span>
        </div>

        <form>
          <div>
            <label style={S.fieldLabel}>Meno</label>
            <input type="text" placeholder="Ján Novák" style={S.input} />
          </div>
          <div>
            <label style={S.fieldLabel}>E-mail</label>
            <input type="email" placeholder="jan@example.sk" style={S.input} />
          </div>
          <div>
            <label style={S.fieldLabel}>Správa</label>
            <textarea placeholder="Vaša správa..." style={S.textarea} />
          </div>
          <button type="submit" style={S.btn}>
            Odoslať správu
          </button>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: '#333',
              marginTop: 12,
            }}
          >
            Formulár je momentálne nefunkčný — používajte priamy e-mail vyššie.
          </p>
        </form>
      </div>
    </div>
  );
}
