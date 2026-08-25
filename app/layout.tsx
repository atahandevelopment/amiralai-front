import type { Metadata } from 'next';
import { SiteHeader } from '@/components/navigation/site-header';
// @ts-expect-error Next.js processes global CSS imports at build time.
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: { default: 'Amiral Documentation', template: '%s · Amiral' },
  description: 'Technical documentation for Amiral AI agent orchestration.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* App Router root layout is the document-wide font loading boundary. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;700&family=Inter:wght@400;500&display=swap"
        />
      </head>
      <body>
        <Analytics />
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div>
            <strong>Amiral</strong>
            <span>Documentation for dependency-aware agent orchestration.</span>
          </div>
          <a href="https://github.com/atahandevelopment/amiral-ai" target="_blank" rel="noreferrer">
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </footer>
      </body>
    </html>
  );
}
