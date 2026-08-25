'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import Image from 'next/image';
import AmiralLogo from '@/public/images/amiral-ai.png';

const links = [
  ['Docs', '/docs'],
  ['Architecture', '/architecture'],
  ['Agents', '/docs/agents'],
  ['Workflow', '/docs/workflow'],
  ['CLI', '/docs/cli'],
  ['Examples', '/examples'],
] as const;
const githubUrl = 'https://github.com/atahandevelopment/amiral-ai';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const navigation = links.map(([label, href]) => (
    <li key={href}>
      <Link href={href} className="block rounded px-3 py-2">
        {label}
      </Link>
    </li>
  ));
  return (
    <header className="site-header sticky top-0 z-20 border-b backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
        <Link href="/" className="mr-auto font-bold">
          <Image src={AmiralLogo} alt="Amiral AI" width={200} height={100} />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-3 text-sm lg:flex">
          <ul className="flex items-center">{navigation}</ul>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
        <ThemeToggle />
        <Link
          href="/docs/get-started"
          className="rounded-md bg-cyan-300 px-3 py-2 text-sm font-semibold text-slate-950"
        >
          Get Started
        </Link>
        <div className="relative lg:hidden">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="rounded border border-slate-600 px-3 py-2 text-sm"
          >
            Menu
          </button>
          {open && (
            <nav
              id="mobile-navigation"
              aria-label="Mobile primary"
              className="absolute right-0 top-12 w-56 border border-slate-700 bg-slate-950 p-3 shadow-xl"
            >
              <ul>
                {navigation}
                <li>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded px-3 py-2"
                  >
                    GitHub<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
