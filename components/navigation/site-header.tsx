'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
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
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [open]);

  const closeMenu = () => setOpen(false);
  const navigation = links.map(([label, href]) => (
    <li key={href}>
      <Link href={href} className="nav-link block px-3 py-2" onClick={closeMenu}>
        {label}
      </Link>
    </li>
  ));
  return (
    <header className="site-header sticky top-0 z-20">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-5">
        <Link href="/" className="mr-auto flex items-center" aria-label="Amiral home">
          <Image
            src={AmiralLogo}
            alt=""
            width={116}
            height={58}
            priority
            className="h-auto w-[116px] object-contain"
          />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-3 text-sm lg:flex">
          <ul className="flex items-center">{navigation}</ul>
          <a className="nav-link px-3 py-2" href={githubUrl} target="_blank" rel="noreferrer">
            GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
        <Link href="/docs/get-started" className="button button-primary hidden sm:inline-flex">
          Get Started
        </Link>
        <div className="relative lg:hidden">
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="button button-compact"
          >
            Menu
          </button>
          {open && (
            <nav
              id="mobile-navigation"
              aria-label="Mobile primary"
              className="mobile-menu absolute right-0 top-12 w-64 p-3"
            >
              <ul>
                {navigation}
                <li>
                  <Link
                    href="/docs/get-started"
                    className="button button-primary mobile-cta"
                    onClick={closeMenu}
                  >
                    Get Started
                  </Link>
                </li>
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
