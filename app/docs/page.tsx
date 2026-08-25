import React from 'react';
import Link from 'next/link';
import { DocsSidebar } from '@/components/docs/docs-sidebar';

const sections = [
  [
    'Get started',
    'Install the CLI, initialize repository configuration, and verify prerequisites.',
    '/docs/get-started',
  ],
  [
    'CLI',
    'Choose between planning, execution, resume, inspection, gates, and cleanup.',
    '/docs/cli',
  ],
  [
    'Configuration',
    'Understand every team.yaml section: Git isolation, execution, providers, agents, and workflows.',
    '/docs/configuration',
  ],
  [
    'Task graph',
    'Understand dependency readiness, ownership, retries, and configured parallelism.',
    '/docs/task-graph',
  ],
  [
    'Agents',
    'See the boundaries between orchestration, planning, implementation, review, and QA.',
    '/docs/agents',
  ],
  [
    'Workflow',
    'Follow a non-trivial change from requirement analysis through independent quality gates.',
    '/docs/workflow',
  ],
  [
    'Architecture',
    'Understand persisted plans, workflow state, worktrees, contracts, and configuration.',
    '/architecture',
  ],
] as const;

export default function Docs() {
  return (
    <main className="mx-auto max-w-5xl px-5 pb-20">
      <DocsSidebar />
      <div className="pt-16">
        <p className="page-kicker">AMIRAL DOCUMENTATION</p>
        <h1 className="page-title">Build from a validated task graph</h1>
        <p className="page-intro">
          Amiral plans dependency-aware work, routes tasks to configured specialists, integrates
          isolated results, and requires Reviewer and QA gates. These guides reflect this
          repository’s orchestration files and the published CLI documentation.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {sections.map(([title, description, href]) => (
            <Link key={href} href={href} className="doc-card">
              <h2 className="card-title">{title}</h2>
              <p className="body-copy">{description}</p>
              <span className="text-link mt-4 inline-block">Read guide →</span>
            </Link>
          ))}
        </div>
        <aside className="doc-card mt-10">
          <h2 className="card-title">Safe first run</h2>
          <pre className="command mt-4">
            <code>
              amiral init --minimal{`\n`}amiral doctor{`\n`}amiral config validate{`\n`}amiral plan
              &quot;Describe the change&quot;
            </code>
          </pre>
          <p className="body-copy">
            Planning writes a reusable plan and does not implement it. Review the graph before
            running it.
          </p>
        </aside>
      </div>
    </main>
  );
}
