import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit, Tiro_Devanagari_Hindi } from 'next/font/google';
import './globals.css';
import { APP } from '@/lib/constants';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
  display: 'swap',
});

const tiro = Tiro_Devanagari_Hindi({
  subsets: ['devanagari'],
  weight: ['400'],
  variable: '--font-tiro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: APP.name, template: `%s — ${APP.name}` },
  description: APP.description,
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1B5E1B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable} ${tiro.variable}`}>
      <body className="font-body bg-cream-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
