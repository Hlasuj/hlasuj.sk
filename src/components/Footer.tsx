import Link from 'next/link';

const NAV = [
  { label: 'O projekte', href: '/o-projekte' },
  { label: 'Ochrana súkromia', href: '/ochrana-sukromia' },
  { label: 'Kontakt', href: '/kontakt' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Predchádzajúce ankety', href: '/predchadzajuce-ankety' },
];

export default function Footer() {
  return (
    <footer style={{ background: '#0F2044', padding: '40px 24px 48px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <nav
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 0',
            marginBottom: 20,
          }}
        >
          {NAV.map((l, i) => (
            <span
              key={l.href}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              {i > 0 && (
                <span
                  style={{
                    color: '#1e3a6e',
                    margin: '0 10px',
                    userSelect: 'none',
                  }}
                >
                  ·
                </span>
              )}
              <Link
                href={l.href}
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: '#6B8CB8',
                  textDecoration: 'none',
                }}
              >
                {l.label}
              </Link>
            </span>
          ))}
        </nav>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 12,
            color: '#6B8CB8',
            margin: 0,
          }}
        >
          © 2025 Hlasuj.sk
        </p>
      </div>
    </footer>
  );
}
