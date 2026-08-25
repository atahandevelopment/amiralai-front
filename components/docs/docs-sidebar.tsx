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
    <div className="docs-nav">
      <nav aria-label="Documentation">
        <p className="mono docs-nav-label">DOCUMENTATION</p>
        <ul>
          {links.map(([label, href]) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  className={active ? 'active' : undefined}
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
    </div>
  );
}
