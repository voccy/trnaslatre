import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LinguaAI — Meaning beyond words',
  description: 'A context-aware Indonesian–Malay translator that spots false friends, ambiguity, register and cultural nuance.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
