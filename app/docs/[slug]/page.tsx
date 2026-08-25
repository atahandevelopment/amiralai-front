import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DocsSidebar } from '@/components/docs/docs-sidebar';

const npmUrl = 'https://www.npmjs.com/package/amiral-ai';
function CliGuide({ gettingStarted = false }: { gettingStarted?: boolean }) {
  return (
    <>
      <p className="page-kicker">{gettingStarted ? 'GET STARTED' : 'CLI REFERENCE'}</p>
      <h1 className="page-title">
        {gettingStarted ? 'Install and initialize Amiral' : 'Amiral CLI'}
      </h1>
      <p className="page-intro">
        The public{' '}
        <a className="text-link" href={npmUrl} target="_blank" rel="noreferrer">
          amiral-ai npm package<span className="sr-only"> (opens in a new tab)</span>
        </a>{' '}
        is a dependency-aware multi-agent workflow CLI. It requires Node.js 20 or newer. Check npm
        for the current published version.
      </p>
      <h2 className="document-heading">Install or run</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="doc-card">
          <strong>Global</strong>
          <pre className="command mt-3">
            <code>npm install --global amiral-ai{`\n`}amiral --help</code>
          </pre>
        </div>
        <div className="doc-card">
          <strong>Project local</strong>
          <pre className="command mt-3">
            <code>npm install --save-dev amiral-ai{`\n`}npx amiral --version</code>
          </pre>
        </div>
        <div className="doc-card">
          <strong>No install</strong>
          <pre className="command mt-3">
            <code>npx --yes amiral-ai init --minimal</code>
          </pre>
        </div>
      </div>
      <h2 className="document-heading">Initialize and verify</h2>
      <pre className="command mt-4">
        <code>
          git init # only when needed{`\n`}amiral init --minimal{`\n`}amiral doctor{`\n`}amiral
          config validate
        </code>
      </pre>
      <p className="body-copy">
        <code>init</code> does not initialize Git. Doctor diagnoses readiness; for automation
        inspect its JSON checks rather than relying only on its exit code.
      </p>
      <h2 className="document-heading">Plan is not run</h2>
      <p className="body-copy">
        <code>plan</code> validates and saves a reusable graph, then exits without implementation.{' '}
        <code>run</code> executes a request, an approved plan, or a persisted workflow.
      </p>
      <pre className="command mt-4">
        <code>
          amiral plan &quot;Add authentication&quot; --type feature{`\n`}amiral run --plan
          feature-ab12cd34{`\n`}amiral run &quot;Add authentication&quot; --type feature
        </code>
      </pre>
      <h2 className="document-heading">Operate a workflow</h2>
      <pre className="command mt-4">
        <code>
          amiral status --json{`\n`}amiral workflow list{`\n`}amiral workflow show &lt;id&gt; --json
          {`\n`}amiral retry --failed --workflow &lt;id&gt;{`\n`}amiral run --workflow &lt;id&gt;
          {`\n`}amiral review --workflow &lt;id&gt;{`\n`}amiral qa --workflow &lt;id&gt;{`\n`}amiral
          clean --workflow &lt;id&gt; --dry-run
        </code>
      </pre>
      <p className="body-copy">
        Retry resets selected tasks but does not execute them. Review and QA run standalone gates.
        Clean is conservative by default; preview before selecting removal flags.
      </p>
    </>
  );
}

function ConceptGuide({ kind }: { kind: 'agents' | 'workflow' }) {
  const agents = [
    [
      'Lead',
      'Selects the workflow, delegates planning and implementation, validates integration, and controls recovery.',
    ],
    [
      'Planner',
      'Inspects the repository and produces tasks with owners, dependencies, and acceptance criteria; it does not modify source code.',
    ],
    [
      'Specialists',
      'Frontend, Backend, Database, and DevOps read relevant policies and implement only their assigned task.',
    ],
    [
      'Reviewer and QA',
      'Reviewer checks correctness, architecture, security, maintainability, and tests. QA runs appropriate validation after blocking review findings are resolved.',
    ],
  ];
  const phases = [
    [
      'Analyze and plan',
      'Capture the complete request and constraints, inspect the repository, then create a repository-specific dependency graph.',
    ],
    [
      'Schedule and implement',
      'Dispatch only dependency-ready tasks. Independent work may be eligible together, subject to conflict safety and configured capacity.',
    ],
    [
      'Integrate and review',
      'Check contracts, types, validation, error handling, and configuration. CHANGES_REQUESTED creates another fix-and-review cycle.',
    ],
    [
      'Validate and complete',
      'QA runs tests, lint, type checking, build, and relevant functional checks. Completion requires all work, integration, review, and QA to pass.',
    ],
  ];
  const content = kind === 'agents' ? agents : phases;
  return (
    <main className="mx-auto max-w-5xl px-5 pb-20">
      <DocsSidebar />
      <div className="pt-16">
        <p className="page-kicker">ORCHESTRATION</p>
        <h1 className="page-title">
          {kind === 'agents' ? 'Agents and boundaries' : 'Feature workflow'}
        </h1>
        <p className="page-intro">
          {kind === 'agents'
            ? 'Responsibilities are intentionally separated: the Lead orchestrates, the Planner decomposes, specialists implement, and independent quality agents gate completion.'
            : 'Non-trivial work follows the repository’s feature workflow from requirement analysis through a validated graph, integration, review, and QA.'}
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {content.map(([title, text]) => (
            <section className="doc-card" key={title}>
              <h2 className="card-title">{title}</h2>
              <p className="body-copy">{text}</p>
            </section>
          ))}
        </div>
        <aside className="doc-card mt-8">
          <h2 className="card-title">Operational constraints</h2>
          <p className="body-copy">
            No dependent task starts early. A failed dependency blocks descendants. Blocking review
            findings must be fixed before QA, and blocking QA failures must be resolved before
            completion is reported.
          </p>
        </aside>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/docs/task-graph" className="text-link">
            Explore task readiness →
          </Link>
          <Link href="/docs/cli" className="text-link">
            Run and inspect workflows →
          </Link>
        </div>
      </div>
    </main>
  );
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === 'cli' || slug === 'get-started')
    return (
      <main className="mx-auto max-w-5xl px-5 pb-16">
        <DocsSidebar />
        <div className="pt-16">
          <CliGuide gettingStarted={slug === 'get-started'} />
        </div>
      </main>
    );
  if (slug === 'agents' || slug === 'workflow') return <ConceptGuide kind={slug} />;
  notFound();
}
