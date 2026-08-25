'use client';

import React, { useState } from 'react';
import {
  Ban,
  Circle,
  CircleCheck,
  CircleX,
  Clock3,
  OctagonAlert,
  Play,
  type LucideIcon,
} from 'lucide-react';
import {
  demoSteps,
  exampleGraph,
  getExecutionWaves,
  getRunnableTasks,
  getTaskAvailability,
  taskEdges,
  type TaskId,
} from '@/lib/task-graph';

const stateIcon: Record<(typeof demoSteps)[number][number]['state'], LucideIcon> = {
  pending: Circle,
  in_progress: Play,
  retry_wait: Clock3,
  completed: CircleCheck,
  failed: OctagonAlert,
  blocked: Ban,
  cancelled: CircleX,
};

export function InteractiveTaskGraph() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<TaskId>('TASK-001');
  const tasks = demoSteps[step];
  const task = tasks.find((item) => item.id === selected) ?? tasks[0];
  const availability = getTaskAvailability(task, tasks);
  const graph = { ...exampleGraph, tasks };
  const waves = getExecutionWaves(graph);
  // The demo deliberately mirrors this repository's single-agent concurrency setting.
  const runnable = getRunnableTasks(graph, { concurrencyLimit: 1 });
  const reset = () => {
    setStep(0);
    setSelected('TASK-001');
  };
  return (
    <section aria-label="Interactive task graph" className="task-graph my-8 p-4 sm:p-7">
      <div className="graph-divider flex flex-wrap items-center justify-between gap-4 border-b pb-5">
        <div>
          <p className="metadata mono">
            SIMULATION · STEP {step + 1}/{demoSteps.length}
          </p>
          <p className="mt-2" role="status" aria-live="polite" aria-atomic="true">
            <span className="body-muted">Runnable now:</span>{' '}
            {runnable.length ? runnable.map((item) => item.id).join(', ') : 'none'}
            <span className="sr-only">. One task maximum under the configured concurrency.</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="button button-compact disabled:opacity-40"
            onClick={reset}
            disabled={step === 0}
          >
            Reset demo
          </button>
          <button
            type="button"
            className="button button-primary disabled:opacity-40"
            onClick={() => setStep((value) => Math.min(value + 1, demoSteps.length - 1))}
            disabled={step === demoSteps.length - 1}
          >
            Next step
          </button>
        </div>
      </div>
      <div className="my-8 grid gap-3 lg:grid-cols-4" aria-label="Execution waves">
        {waves.map((wave, index) => (
          <section key={wave.join('-')} aria-labelledby={`wave-${index + 1}`}>
            <h3 id={`wave-${index + 1}`} className="metadata mono mb-2">
              WAVE {index + 1}
            </h3>
            <ul className="space-y-3" aria-label={`Wave ${index + 1} tasks`}>
              {wave.map((id) => {
                const item = tasks.find((candidate) => candidate.id === id);
                if (!item) return null;
                const status = getTaskAvailability(item, tasks);
                const StateIcon = stateIcon[item.state];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-pressed={item.id === selected}
                      onClick={() => setSelected(item.id)}
                      className={`task-node min-h-32 w-full p-4 text-left transition ${item.id === selected ? 'selected' : ''} ${item.state === 'failed' ? 'failed' : ''}`}
                    >
                      <span className="body-muted mono flex items-center gap-1.5 text-xs">
                        <StateIcon aria-hidden="true" className="size-3.5" /> {item.id} ·{' '}
                        {status.status}
                      </span>
                      <strong className="mt-3 block">
                        {item.title}
                        {item.id === selected && <span className="sr-only"> (selected)</span>}
                      </strong>
                      <span className="body-muted mt-2 block text-sm">Owner: {item.owner}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <div className="graph-divider grid gap-6 border-t pt-6 lg:grid-cols-2">
        <div aria-live="polite" aria-atomic="true">
          <h3>
            Selected task: <span className="technical-label">{task.id}</span>
          </h3>
          <dl className="mt-3 grid grid-cols-[7rem_1fr] gap-2 text-sm">
            <dt>State</dt>
            <dd className="flex items-center gap-1.5">
              {React.createElement(stateIcon[task.state], {
                'aria-hidden': true,
                className: 'size-4',
              })}{' '}
              {task.state}
            </dd>
            <dt>Owner</dt>
            <dd>{task.owner}</dd>
            <dt>Dependencies</dt>
            <dd>{task.dependencies.join(', ') || 'None'}</dd>
            <dt>Scheduling</dt>
            <dd>
              {availability.status}: {availability.reason}
            </dd>
            <dt>Attempts</dt>
            <dd>
              {task.attempts} / {task.maxAttempts}
            </dd>
          </dl>
        </div>
        <div>
          <h3 id="dependency-connections">Dependency connections</h3>
          <p className="body-muted mt-2 text-sm">
            Each connection runs from prerequisite to dependent task.
          </p>
          <ul
            aria-labelledby="dependency-connections"
            className="body-muted mono mt-3 space-y-2 text-sm"
          >
            {taskEdges.map((edge) => (
              <li key={`${edge.from}-${edge.to}`}>
                {edge.from} → {edge.to}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="graph-divider mt-6 border-t pt-6">
        <h3>Recovery scenarios</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-[8rem_1fr]">
          <dt>Failed / blocked</dt>
          <dd>Lead action is required; dependent tasks remain blocked.</dd>
          <dt>Retry wait</dt>
          <dd>
            A retry is runnable only when its scheduled time arrives and dependencies are complete.
          </dd>
          <dt>Exhausted</dt>
          <dd>
            After 3 attempts, the retry limit is exhausted and the task is no longer runnable.
          </dd>
        </dl>
      </div>
    </section>
  );
}
