import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { DocsSidebar } from '@/components/docs/docs-sidebar';

export const metadata: Metadata = {
  title: 'team.yaml Configuration',
  description: 'A visual, repository-backed guide to every setting in the Amiral team.yaml file.',
};

const agents = [
  [
    'lead',
    'orchestrator',
    '5',
    'general/orchestration, general/git, general/clean-code',
    'general/git, general/clean-code',
  ],
  [
    'planner',
    'planner',
    '5',
    'general/architecture, general/planning, general/task-decomposition',
    'general/architecture',
  ],
  [
    'frontend',
    'developer',
    '10',
    'frontend/typescript, frontend/react, frontend/nextjs, frontend/tailwind, frontend/storybook, frontend/tanstack-query, frontend/axios, frontend/astro, frontend/angular, frontend/vue, frontend/next-auth, frontend/next-i18next, frontend/next-seo, frontend/next-sitemap, frontend/next-pwa, frontend/shadcn, frontend/next-themes, frontend/material-ui, frontend/ant-design, frontend/accessibility',
    '—',
  ],
  [
    'backend',
    'developer',
    '10',
    'backend/typescript, backend/nodejs, backend/nestjs, backend/express, backend/fastify, backend/dotnet, backend/ef-core, backend/rest-api, backend/grpc, backend/graphql, backend/redis, backend/kafka, backend/rabbitmq, backend/docker, backend/kubernetes, backend/aws, backend/azure, backend/elasticsearch, backend/logging, backend/supabase, backend/stripe, backend/prisma, backend/typeorm, backend/mongodb, backend/mysql, backend/postgresql, backend/sqlite, backend/golang, backend/python, backend/java, backend/rust, backend/authentication',
    '—',
  ],
  [
    'database',
    'specialist',
    '20',
    'database/postgresql, database/sql, database/migrations, database/schema-design, database/indexing, database/optimization, database/query-analysis',
    '—',
  ],
  [
    'devops',
    'specialist',
    '10',
    'devops/docker, devops/ci, devops/cd, devops/github-actions, devops/deployment, devops/kubernetes, devops/azure, devops/aws',
    '—',
  ],
  [
    'reviewer',
    'reviewer',
    '10',
    'general/clean-code, general/security, review/code, review/architecture, review/security, review/performance',
    '—',
  ],
  [
    'qa',
    'tester',
    '10',
    'testing/unit, testing/integration, testing/e2e, testing/regression, testing/validation, testing/type-check, testing/build',
    '—',
  ],
] as const;

const Anchor = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-20">
    <a href={`#${id}`}>
      {children}{' '}
      <span aria-hidden="true" className="anchor-mark">
        #
      </span>
    </a>
  </h2>
);

const Setting = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <div className="doc-card">
    <dt>
      <code className="technical-label">{name}</code>
    </dt>
    <dd className="body-copy">{children}</dd>
  </div>
);

export default function ConfigurationPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[13rem_minmax(0,1fr)_11rem]">
      <DocsSidebar />
      <article className="prose min-w-0 py-12">
        <p className="page-kicker">REFERENCE / CONFIGURATION</p>
        <h1 className="page-title">
          Configure your team with <code>team.yaml</code>
        </h1>
        <p className="text-lg">
          This file connects repository isolation, execution limits, providers, agent routing, and
          workflow instructions. Values below are this repository’s{' '}
          <strong>current settings and examples</strong>—not undocumented defaults or an exhaustive
          list of accepted values.
        </p>

        <Anchor id="overview">Configuration map</Anchor>
        <pre className="command overflow-x-auto" aria-label="Annotated team.yaml structure">
          <code>{`team:       # Team identity
git:        # Worktree and cleanup policy
execution:  # Workflow-wide scheduling and leases
providers:  # Provider process, capacity, and retry policy
agents:     # Specialists available for routing
workflows:  # Request type → instruction file`}</code>
        </pre>

        <Anchor id="team">Team identity</Anchor>
        <dl>
          <Setting name="team.name">
            Human-readable team identifier. Current setting: <code>software-development-team</code>.
          </Setting>
        </dl>

        <Anchor id="git">Git worktrees and retention</Anchor>
        <pre className="command overflow-x-auto">
          <code>{`git:
  worktree_root: .amiral/worktrees
  cleanup_completed: true
  keep_failed: true
  keep_blocked: true
  keep_branches: true`}</code>
        </pre>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Setting name="git.worktree_root">
            Directory where isolated agent worktrees are created.
          </Setting>
          <Setting name="git.cleanup_completed">
            Remove worktrees after successful completion when <code>true</code>.
          </Setting>
          <Setting name="git.keep_failed">Retain failed worktrees for diagnosis.</Setting>
          <Setting name="git.keep_blocked">
            Retain blocked worktrees for inspection or recovery.
          </Setting>
          <Setting name="git.keep_branches">
            Keep worktree branches when cleaning their worktrees.
          </Setting>
        </dl>

        <Anchor id="execution">Execution</Anchor>
        <pre className="command overflow-x-auto">
          <code>{`execution:
  default_provider: opencode
  max_parallel_agents: 1
  lease_minutes: 30
  max_attempts: 3
  requests_directory: requests`}</code>
        </pre>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Setting name="execution.default_provider">
            Provider used when work does not select another one; currently <code>opencode</code>.
          </Setting>
          <Setting name="execution.max_parallel_agents">
            Workflow-wide ceiling for agents executing at once; currently <code>1</code>.
          </Setting>
          <Setting name="execution.lease_minutes">
            Current 30-minute ownership lease before work can be recovered.
          </Setting>
          <Setting name="execution.max_attempts">
            Current per-task attempt limit: <code>3</code>.
          </Setting>
          <Setting name="execution.requests_directory">
            Repository directory used for request files; currently <code>requests</code>.
          </Setting>
        </dl>
        <aside className="doc-card mt-5" aria-labelledby="limits-title">
          <h3 id="limits-title">Two different concurrency limits</h3>
          <p>
            <code>max_parallel_agents</code> limits active agents across execution.{' '}
            <code>providers.opencode.max_concurrency</code> limits simultaneous work sent
            specifically to OpenCode. Effective OpenCode parallelism cannot exceed either limit;
            both are currently 1.
          </p>
        </aside>

        <Anchor id="providers">OpenCode provider</Anchor>
        <pre className="command overflow-x-auto">
          <code>{`providers:
  opencode:
    enabled: true
    max_concurrency: 1
    binary: opencode
    auto_approve: false
    retry: { max_attempts: 3, base_delay_ms: 2000,
             max_delay_ms: 30000, jitter: true }`}</code>
        </pre>
        <dl className="grid gap-4 sm:grid-cols-2">
          <Setting name="providers.opencode.enabled">
            Whether the OpenCode provider can be used; currently <code>true</code>.
          </Setting>
          <Setting name="providers.opencode.max_concurrency">
            OpenCode-specific in-flight limit; currently <code>1</code>.
          </Setting>
          <Setting name="providers.opencode.binary">
            Executable invoked for this provider; currently <code>opencode</code>.
          </Setting>
          <Setting name="providers.opencode.auto_approve">
            Whether provider approval is automatic; currently <code>false</code>.
          </Setting>
          <Setting name="providers.opencode.retry.max_attempts">
            Provider-call attempt limit; currently <code>3</code>, separate from task attempts.
          </Setting>
          <Setting name="providers.opencode.retry.base_delay_ms">
            Initial retry delay example: <code>2000</code> ms.
          </Setting>
          <Setting name="providers.opencode.retry.max_delay_ms">
            Retry-delay ceiling example: <code>30000</code> ms.
          </Setting>
          <Setting name="providers.opencode.retry.jitter">
            Adds timing variation to retries; currently enabled.
          </Setting>
        </dl>

        <Anchor id="agents">Agents and routing</Anchor>
        <p>
          Each agent entry has a <code>role</code>, routing <code>capabilities</code>, optional{' '}
          <code>skills</code> loaded for its work, and a numeric <code>routing_priority</code>.
          These are the current repository entries:
        </p>
        <div className="grid gap-4 xl:grid-cols-2">
          {agents.map(([name, role, priority, capabilities, skills]) => (
            <section className="doc-card min-w-0" key={name} aria-labelledby={`agent-${name}`}>
              <h3 id={`agent-${name}`}>
                <code>{name}</code>{' '}
                <span className="metadata">
                  {role} · priority {priority}
                </span>
              </h3>
              <p className="break-words text-sm">
                <strong>Capabilities:</strong> {capabilities}
              </p>
              <p className="break-words text-sm">
                <strong>Skills:</strong> {skills === '—' ? 'not set (optional)' : skills}
              </p>
            </section>
          ))}
        </div>

        <Anchor id="workflows">Workflow files</Anchor>
        <pre className="command overflow-x-auto">
          <code>{`workflows:
  feature: { file: .opencode/workflows/feature.md }
  bugfix:  { file: .opencode/workflows/bugfix.md }
  refactor:{ file: .opencode/workflows/refactor.md }`}</code>
        </pre>
        <p>
          The <code>file</code> key maps each currently configured request type—<code>feature</code>
          , <code>bugfix</code>, and <code>refactor</code>—to its repository instruction file. These
          are current examples, not a claim about every supported workflow name.
        </p>
        <p>
          <Link href="/architecture" className="text-link">
            See how configuration fits the architecture →
          </Link>
        </p>
      </article>
      <aside className="hidden py-12 text-sm lg:block">
        <nav aria-label="On this page">
          <p className="metadata mono mb-3">ON THIS PAGE</p>
          <ul className="contents-links space-y-3">
            {[
              ['Overview', 'overview'],
              ['Team', 'team'],
              ['Git', 'git'],
              ['Execution', 'execution'],
              ['Providers', 'providers'],
              ['Agents', 'agents'],
              ['Workflows', 'workflows'],
            ].map(([label, id]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </main>
  );
}
