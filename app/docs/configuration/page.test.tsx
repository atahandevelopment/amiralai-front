import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { vi, describe, expect, it } from 'vitest';
import ConfigurationPage from './page';

vi.mock('next/navigation', () => ({ usePathname: () => '/docs/configuration' }));

const configurationFixture = {
  keyPaths: [
    'team.name',
    'git.worktree_root',
    'git.cleanup_completed',
    'git.keep_failed',
    'git.keep_blocked',
    'git.keep_branches',
    'execution.default_provider',
    'execution.max_parallel_agents',
    'execution.lease_minutes',
    'execution.max_attempts',
    'execution.requests_directory',
    'providers.opencode.enabled',
    'providers.opencode.max_concurrency',
    'providers.opencode.binary',
    'providers.opencode.auto_approve',
    'providers.opencode.retry.max_attempts',
    'providers.opencode.retry.base_delay_ms',
    'providers.opencode.retry.max_delay_ms',
    'providers.opencode.retry.jitter',
  ],
  agents: {
    lead: {
      capabilities: 'general/orchestration, general/git, general/clean-code',
      skills: 'general/git, general/clean-code',
    },
    planner: {
      capabilities: 'general/architecture, general/planning, general/task-decomposition',
      skills: 'general/architecture',
    },
    frontend: {
      capabilities:
        'frontend/typescript, frontend/react, frontend/nextjs, frontend/tailwind, frontend/storybook, frontend/tanstack-query, frontend/axios, frontend/astro, frontend/angular, frontend/vue, frontend/next-auth, frontend/next-i18next, frontend/next-seo, frontend/next-sitemap, frontend/next-pwa, frontend/shadcn, frontend/next-themes, frontend/material-ui, frontend/ant-design, frontend/accessibility',
      skills: 'not set (optional)',
    },
    backend: {
      capabilities:
        'backend/typescript, backend/nodejs, backend/nestjs, backend/express, backend/fastify, backend/dotnet, backend/ef-core, backend/rest-api, backend/grpc, backend/graphql, backend/redis, backend/kafka, backend/rabbitmq, backend/docker, backend/kubernetes, backend/aws, backend/azure, backend/elasticsearch, backend/logging, backend/supabase, backend/stripe, backend/prisma, backend/typeorm, backend/mongodb, backend/mysql, backend/postgresql, backend/sqlite, backend/golang, backend/python, backend/java, backend/rust, backend/authentication',
      skills: 'not set (optional)',
    },
    database: {
      capabilities:
        'database/postgresql, database/sql, database/migrations, database/schema-design, database/indexing, database/optimization, database/query-analysis',
      skills: 'not set (optional)',
    },
    devops: {
      capabilities:
        'devops/docker, devops/ci, devops/cd, devops/github-actions, devops/deployment, devops/kubernetes, devops/azure, devops/aws',
      skills: 'not set (optional)',
    },
    reviewer: {
      capabilities:
        'general/clean-code, general/security, review/code, review/architecture, review/security, review/performance',
      skills: 'not set (optional)',
    },
    qa: {
      capabilities:
        'testing/unit, testing/integration, testing/e2e, testing/regression, testing/validation, testing/type-check, testing/build',
      skills: 'not set (optional)',
    },
  },
  workflows: [
    '.opencode/workflows/feature.md',
    '.opencode/workflows/bugfix.md',
    '.opencode/workflows/refactor.md',
  ],
} as const;

describe('ConfigurationPage', () => {
  it('documents the repository configuration with accessible navigation', () => {
    render(<ConfigurationPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /Configure your team/ }),
    ).toBeInTheDocument();
    for (const keyPath of configurationFixture.keyPaths) {
      expect(screen.getAllByText(keyPath, { exact: true }).length).toBeGreaterThan(0);
    }
    expect(screen.getByText(/Two different concurrency limits/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /frontend/ })).toBeInTheDocument();
    for (const workflow of configurationFixture.workflows) {
      expect(screen.getByText(new RegExp(workflow.replaceAll('.', '\\.')))).toBeInTheDocument();
    }
    expect(screen.getByRole('link', { name: /fits the architecture/ })).toHaveAttribute(
      'href',
      '/architecture',
    );

    const contents = screen.getByRole('navigation', { name: 'On this page' });
    expect(within(contents).getByRole('link', { name: 'Agents' })).toHaveAttribute(
      'href',
      '#agents',
    );
  });

  it('shows every capability and skill identifier without abbreviating prefixes', () => {
    const { container } = render(<ConfigurationPage />);

    for (const [agent, expected] of Object.entries(configurationFixture.agents)) {
      const card = container.querySelector(`#agent-${agent}`)?.closest('section');
      expect(card).not.toBeNull();
      const [capabilities, skills] = card!.querySelectorAll('p');
      expect(capabilities).toHaveTextContent(`Capabilities: ${expected.capabilities}`);
      expect(skills).toHaveTextContent(`Skills: ${expected.skills}`);
    }
  });
});
