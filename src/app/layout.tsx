import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const BASE_URL = 'https://hlasuj-sk.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'hlasuj.sk — Hovorte, čo si myslíte',
    template: '%s | hlasuj.sk',
  },
  description:
    'Hlasujte v anonymných slovenských anketách. Žiadna registrácia, žiadne cookies, žiadne sledovanie IP. Váš hlas je skutočne anonymný.',
  authors: [{ name: 'hlasuj.sk' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'sk_SK',
    url: BASE_URL,
    siteName: 'hlasuj.sk',
    title: 'hlasuj.sk — Hovorte, čo si myslíte',
    description:
      'Hlasujte v anonymných slovenských anketách. Žiadna registrácia, žiadne cookies, žiadne sledovanie.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'hlasuj.sk — Anonymné ankety pre Slovákov',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hlasuj.sk — Hovorte, čo si myslíte',
    description:
      'Hlasujte v anonymných slovenských anketách. Žiadna registrácia, žiadne cookies.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sk"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
