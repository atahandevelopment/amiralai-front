import Link from 'next/link';

const resources = [
  ['Documentation', 'Start with installation, concepts, and the complete CLI reference.', '/docs'],
  [
    'Architecture',
    'See how plans, isolated work, integration, review, and QA fit together.',
    '/architecture',
  ],
  [
    'Examples',
    'Follow verified command flows for planning, execution, inspection, and recovery.',
    '/examples',
  ],
  ['Configuration', 'Explore the repository-backed team.yaml reference.', '/docs/configuration'],
] as const;

function Terminal({ children }: { children: React.ReactNode }) {
  return (
    <div className="home-terminal">
      <div className="terminal-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

export default function Home() {
  return (
    <main className="home">
      <section className="home-hero">
        <p className="eyebrow">AI AGENT ORCHESTRATION</p>
        <h1>
          Your AI development team,
          <br />
          under one command structure.
        </h1>
        <p>
          Amiral coordinates specialized agents through dependency-aware plans, structured results,
          review, and QA gates.
        </p>
        <div className="actions">
          <Link className="button button-primary" href="/docs/get-started">
            Get started
          </Link>
          <Link className="button button-ghost" href="/architecture">
            Explore architecture
          </Link>
        </div>
      </section>

      <section className="product-grid" aria-label="Amiral workflow">
        <article className="product-card">
          <div>
            <p className="eyebrow">PLAN</p>
            <h2>Turn a request into a validated graph.</h2>
            <p>
              Tasks carry owners, dependencies, and acceptance criteria before implementation
              begins.
            </p>
          </div>
          <Terminal>{`amiral plan "Add authentication" --type feature\n# saved as a reusable plan`}</Terminal>
        </article>
        <article className="product-card">
          <div>
            <p className="eyebrow">EXECUTE</p>
            <h2>Run only dependency-ready work.</h2>
            <p>
              Persisted state supports inspection, safe pauses, retries, and resume without
              re-planning.
            </p>
          </div>
          <Terminal>{`amiral run --plan feature-ab12cd34\namiral status --json`}</Terminal>
        </article>
      </section>

      <section className="feature-split">
        <div>
          <p className="eyebrow">ONE WORKFLOW · CLEAR BOUNDARIES</p>
          <h2>
            Specialists implement.
            <br />
            The Lead orchestrates.
          </h2>
          <p>
            Planning, implementation, integration, review, and QA remain separate responsibilities.
            Dependent work waits, and completion requires independent quality gates.
          </p>
          <Link href="/docs/agents">Meet the agents →</Link>
        </div>
        <div className="cream-panel">
          <ol>
            <li>
              <span>01</span>Analyze and plan
            </li>
            <li>
              <span>02</span>Schedule and implement
            </li>
            <li>
              <span>03</span>Integrate and review
            </li>
            <li>
              <span>04</span>Validate and complete
            </li>
          </ol>
        </div>
      </section>

      <section className="resource-section">
        <div className="section-heading">
          <p className="eyebrow">EXPLORE AMIRAL</p>
          <h2>Technical resources</h2>
        </div>
        <div className="resource-grid">
          {resources.map(([title, text, href]) => (
            <Link href={href} key={href}>
              <span className="mono">GUIDE</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="closing-cta">
        <div>
          <p className="eyebrow">START WITH A SAFE FIRST RUN</p>
          <h2>
            Plan first.
            <br />
            Execute when ready.
          </h2>
        </div>
        <div>
          <p>
            Initialize the repository configuration, verify prerequisites, and inspect the generated
            task graph before running it.
          </p>
          <div className="actions">
            <Link className="button button-primary" href="/docs/get-started">
              Read the guide
            </Link>
            <a
              className="button button-ghost"
              href="https://www.npmjs.com/package/amiral-ai"
              target="_blank"
              rel="noreferrer"
            >
              View npm<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
