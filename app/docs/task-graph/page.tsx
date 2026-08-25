import type { Metadata } from 'next';
import { DocsSidebar } from '@/components/docs/docs-sidebar';
import { InteractiveTaskGraph } from '@/components/diagrams/task-graph';

export const metadata: Metadata = {
  title: 'Intelligent Task Graph',
  description:
    'Explore task dependencies, scheduling states, failure, retry, and dependency-aware parallelism in Amiral.',
};
const Anchor = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id}>
    <a href={`#${id}`} className="hover:text-cyan-300">
      {children}{' '}
      <span aria-hidden="true" className="text-slate-600">
        #
      </span>
    </a>
  </h2>
);

export default function TaskGraphPage() {
  return (
    <main className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[13rem_minmax(0,1fr)_11rem]">
      <DocsSidebar />
      <article className="prose min-w-0 py-12">
        <p className="mono text-sm text-cyan-300">CONCEPTS / TASK GRAPH</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Intelligent Task Graph
        </h1>
        <p className="text-lg">
          A plan is a directed graph: each task names an owner and dependencies. The Lead can
          dispatch a pending task only after every dependency completes.
        </p>
        <InteractiveTaskGraph />
        <Anchor id="scheduling">Scheduling, blocking, and ownership</Anchor>
        <p>
          Root tasks are immediately runnable. Pending descendants wait; a failed dependency blocks
          its descendants. Completion causes the Lead to recalculate readiness. Ownership routes
          each task to a configured specialist—it does not let that specialist orchestrate others.
        </p>
        <Anchor id="parallelism">Dependency-aware parallelism</Anchor>
        <p>
          When TASK-002 completes, TASK-003 and TASK-004 are both eligible: they are independent
          branches. This is conceptual graph parallelism, subject to conflict safety and provider
          limits. This repository currently configures{' '}
          <code className="mono">max_parallel_agents: 1</code> and OpenCode{' '}
          <code className="mono">max_concurrency: 1</code>, so eligible work is serialized in this
          setup rather than running simultaneously. The runnable summary therefore shows at most one
          dispatch candidate, even when an execution wave contains multiple eligible branches.
        </p>
        <Anchor id="failure">Failure and retry</Anchor>
        <p>
          A failed task is not terminal: it awaits Lead recovery, retry, replanning, or escalation,
          and does not release dependent work. A blocked task likewise awaits Lead action or a graph
          change. <code className="mono">max_attempts: 3</code> limits each task to three attempts;
          deterministic failures should not be retried blindly.
        </p>
        <Anchor id="lifecycle">Lifecycle</Anchor>
        <pre className="mono overflow-auto border-y border-slate-800 p-5 text-sm">
          <code>
            pending → in_progress → completed{`\n`} ↘ failed → retry_wait → in_progress{`\n`}pending
            → blocked | cancelled
          </code>
        </pre>
        <p>
          The authoritative workflow schema defines exactly seven task states: <code>pending</code>,{' '}
          <code>in_progress</code>, <code>retry_wait</code>, <code>completed</code>,{' '}
          <code>failed</code>, <code>blocked</code>, and <code>cancelled</code>. “Runnable” is
          derived scheduling information, not a stored state. A retry becomes runnable only after
          its dependencies complete, its retry time arrives, and its attempt limit is not exhausted.
        </p>
        <Anchor id="inspect">How to inspect it</Anchor>
        <p>
          The interactive example is a local teaching simulation, not live runtime telemetry. Select
          any task for its state, dependencies, owner, attempt count, and scheduling reason. The
          complete task list and connections remain available as structured controls and text for
          keyboard and screen-reader users.
        </p>
      </article>
      <aside className="hidden py-12 text-sm lg:block">
        <p className="mono mb-3 text-xs text-slate-500">ON THIS PAGE</p>
        <ul className="space-y-3 text-slate-400">
          <li>
            <a href="#scheduling">Scheduling</a>
          </li>
          <li>
            <a href="#parallelism">Parallelism</a>
          </li>
          <li>
            <a href="#failure">Failure & retry</a>
          </li>
          <li>
            <a href="#lifecycle">Lifecycle</a>
          </li>
          <li>
            <a href="#inspect">Inspection</a>
          </li>
        </ul>
      </aside>
    </main>
  );
}
