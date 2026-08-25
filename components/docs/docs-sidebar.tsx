'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['Introduction', '/docs'],
  ['Configuration', '/docs/configuration'],
  ['Intelligent Task Graph', '/docs/task-graph'],
  ['Workflow', '/docs/workflow'],
  ['Agents', '/docs/agents'],
  ['CLI', '/docs/cli'],
] as const;

export function DocsSidebar() {
  const pathname = usePathname();
  return (
    <aside className="border-b border-slate-800 py-6 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r lg:pr-8">
      <nav aria-label="Documentation">
        <p className="mono mb-3 text-xs text-slate-500">CONCEPTS</p>
        <ul className="space-y-3 text-sm">
          {links.map(([label, href]) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  className={active ? 'text-cyan-300' : undefined}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
