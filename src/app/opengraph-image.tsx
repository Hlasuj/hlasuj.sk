import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'hlasuj.sk — Anonymné ankety pre Slovákov';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0F1E',
        padding: '80px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 700,
            color: '#0A0F1E',
          }}
        >
          H
        </div>
        <div
          style={{
            fontSize: '56px',
            fontWeight: 700,
            color: '#F8FAFC',
            letterSpacing: '-1px',
          }}
        >
          hlasuj.sk
        </div>
      </div>
      <div
        style={{
          fontSize: '30px',
          color: '#94A3B8',
          textAlign: 'center',
          maxWidth: '800px',
          lineHeight: 1.4,
        }}
      >
        Anonymné ankety pre Slovákov
      </div>
      <div
        style={{
          display: 'flex',
          gap: '32px',
          marginTop: '40px',
        }}
      >
        {['Žiadna registrácia', 'Žiadne cookies', '100% anonymné'].map(
          (tag) => (
            <div
              key={tag}
              style={{
                fontSize: '18px',
                color: '#475569',
                backgroundColor: '#1E293B',
                padding: '8px 20px',
                borderRadius: '100px',
              }}
            >
              {tag}
            </div>
          )
        )}
      </div>
    </div>,
    { ...size }
  );
}
