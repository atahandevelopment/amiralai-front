import Link from 'next/link';
import React from 'react';

export default function Architecture() {
  return (
    <main className="editorial-page">
      <p className="page-kicker">SYSTEM DESIGN</p>
      <h1 className="page-title">Architecture</h1>
      <p className="page-intro">
        The Lead is the sole orchestration authority. It consumes a validated Planner graph,
        schedules dependency-ready tasks, integrates specialist results, and enforces independent
        review and QA.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <section className="doc-card">
          <h2 className="card-title">Configuration</h2>
          <p className="body-copy">
            <code>team.yaml</code> defines team identity, Git worktree retention, execution limits,
            provider capacity and retries, agents, and available workflows. <code>.opencode</code>{' '}
            contains role instructions, workflow definitions, policies, contracts, prompts, and
            schemas.
          </p>
        </section>
        <section className="doc-card">
          <h2 className="card-title">Persistence</h2>
          <p className="body-copy">
            Reusable planning artifacts live under <code>plans/</code>. Workflow graph, state,
            history, requests, and results use JSON under <code>tasks/</code>. Task and integration
            worktrees live under <code>.amiral/</code>.
          </p>
        </section>
        <section className="doc-card">
          <h2 className="card-title">Scheduling constraints</h2>
          <p className="body-copy">
            A task waits for every dependency. Independent branches are conceptually parallel, but
            effective execution is bounded by agent and provider capacity. This repository
            configures both limits to one.
          </p>
        </section>
        <section className="doc-card">
          <h2 className="card-title">Completion</h2>
          <p className="body-copy">
            Implementation alone is not completion. Integration must succeed, Reviewer must return
            PASS, QA must return PASS, and no critical issue may remain.
          </p>
        </section>
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link className="text-link" href="/docs/configuration">
          Explore configuration →
        </Link>
        <Link className="text-link" href="/docs/task-graph">
          Inspect scheduling →
        </Link>
        <Link className="text-link" href="/docs/cli">
          Operate with the CLI →
        </Link>
      </div>
    </main>
  );
}
