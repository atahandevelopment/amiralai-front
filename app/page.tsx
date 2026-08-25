import Link from 'next/link';

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-24">
      <p className="mono mb-5 text-sm text-cyan-300">AI AGENT ORCHESTRATION</p>
      <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">
        Your AI Development Team.
        <br />
        <span className="text-slate-500">One Command Structure.</span>
      </h1>
      <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-400">
        Amiral coordinates specialized agents through dependency-aware plans, structured results,
        review, and QA gates.
      </p>
      <div className="mt-10 flex gap-3">
        <Link
          className="rounded bg-cyan-300 px-5 py-3 font-semibold text-slate-950"
          href="/docs/task-graph"
        >
          Explore the task graph
        </Link>
        <Link className="rounded border border-slate-700 px-5 py-3" href="/architecture">
          Architecture
        </Link>
      </div>
      <div className="mt-16 border-y border-slate-800 bg-slate-950 p-6">
        <p className="mono text-xs text-slate-500">CLI</p>
        <p className="mt-2 text-slate-300">
          Install the public{' '}
          <a
            className="text-cyan-300 underline"
            href="https://www.npmjs.com/package/amiral-ai"
            target="_blank"
            rel="noreferrer"
          >
            amiral-ai package<span className="sr-only"> (opens in a new tab)</span>
          </a>
          , or review commands in the{' '}
          <Link className="text-cyan-300 underline" href="/docs/cli">
            CLI guide
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
