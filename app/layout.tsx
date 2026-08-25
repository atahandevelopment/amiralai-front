import type { Metadata } from 'next';
import { SiteHeader } from '@/components/navigation/site-header';
import { themeScript } from '@/lib/theme-bootstrap';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Amiral Documentation', template: '%s · Amiral' },
  description: 'Technical documentation for Amiral AI agent orchestration.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* App Router root layout is the document-wide font loading boundary. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Elms+Sans:ital,wght@0,100..900;1,100..900&family=Funnel+Sans:ital,wght@0,300..800;1,300..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <SiteHeader />
        {children}
        <footer className="site-footer">Amiral documentation · Repository-backed examples</footer>
      </body>
    </html>
  );
}
