import Link from 'next/link';

export default function Examples() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-20">
      <p className="mono text-sm text-cyan-300">VERIFIED COMMAND FLOWS</p>
      <h1 className="mt-4 text-5xl font-semibold">Examples</h1>
      <div className="mt-10 space-y-5">
        <section className="doc-card">
          <h2 className="text-xl font-semibold">Review before execution</h2>
          <pre className="command mt-4">
            <code>
              amiral plan &quot;Add authentication&quot; --type feature{`\n`}amiral run --plan
              feature-ab12cd34
            </code>
          </pre>
          <p className="mt-3 text-slate-400">
            The first command creates and validates a reusable plan. The second consumes an approved
            plan ID.
          </p>
        </section>
        <section className="doc-card">
          <h2 className="text-xl font-semibold">Plan and execute together</h2>
          <pre className="command mt-4">
            <code>amiral run &quot;Repair duplicate invoice creation&quot; --type bugfix</code>
          </pre>
          <p className="mt-3 text-slate-400">
            Run plans first, then creates and executes a persisted workflow. It returns at
            completion or a safe pause condition; it is not a daemon.
          </p>
        </section>
        <section className="doc-card">
          <h2 className="text-xl font-semibold">Inspect and resume</h2>
          <pre className="command mt-4">
            <code>
              amiral status --workflow &lt;id&gt; --json{`\n`}amiral workflow history &lt;id&gt;
              --limit 50{`\n`}amiral run --workflow &lt;id&gt;
            </code>
          </pre>
          <p className="mt-3 text-slate-400">
            Resume uses persisted state and does not re-plan. Inspect the reported reason: only{' '}
            <code>completed</code> means both gates passed.
          </p>
        </section>
        <section className="doc-card">
          <h2 className="text-xl font-semibold">Recover a failed task</h2>
          <pre className="command mt-4">
            <code>
              amiral retry &lt;task-id&gt; --workflow &lt;id&gt;{`\n`}amiral run --workflow
              &lt;id&gt;
            </code>
          </pre>
          <p className="mt-3 text-slate-400">
            Retry resets state but does not execute the task. Diagnose the failure before resetting
            it.
          </p>
        </section>
      </div>
      <div className="mt-8 flex gap-4">
        <Link className="text-cyan-300" href="/docs/cli">
          Full CLI guide →
        </Link>
        <Link className="text-cyan-300" href="/docs/task-graph">
          Interactive task graph →
        </Link>
      </div>
    </main>
  );
}
