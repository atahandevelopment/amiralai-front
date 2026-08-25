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
    <section
      aria-label="Interactive task graph"
      className="my-8 border border-slate-700 bg-[#0c111b] p-4 sm:p-7"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <p className="mono text-xs text-slate-500">
            SIMULATION · STEP {step + 1}/{demoSteps.length}
          </p>
          <p className="mt-2" role="status" aria-live="polite" aria-atomic="true">
            <span className="text-slate-400">Runnable now:</span>{' '}
            {runnable.length ? runnable.map((item) => item.id).join(', ') : 'none'}
            <span className="sr-only">. One task maximum under the configured concurrency.</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded border border-slate-600 px-3 py-2 disabled:opacity-40"
            onClick={reset}
            disabled={step === 0}
          >
            Reset demo
          </button>
          <button
            type="button"
            className="rounded bg-cyan-300 px-3 py-2 font-semibold text-slate-950 disabled:opacity-40"
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
            <h3 id={`wave-${index + 1}`} className="mono mb-2 text-xs text-slate-500">
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
                      className={`min-h-32 w-full border p-4 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 ${item.id === selected ? 'border-cyan-300' : 'border-slate-700'} ${item.state === 'failed' ? 'border-dashed' : ''}`}
                    >
                      <span className="mono flex items-center gap-1.5 text-xs text-slate-400">
                        <StateIcon aria-hidden="true" className="size-3.5" /> {item.id} ·{' '}
                        {status.status}
                      </span>
                      <strong className="mt-3 block">{item.title}</strong>
                      <span className="mt-2 block text-sm text-slate-400">Owner: {item.owner}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
      <div className="grid gap-6 border-t border-slate-800 pt-6 lg:grid-cols-2">
        <div aria-live="polite" aria-atomic="true">
          <h3 className="font-semibold">
            Selected task: <span className="mono text-cyan-300">{task.id}</span>
          </h3>
          <dl className="mt-3 grid grid-cols-[7rem_1fr] gap-2 text-sm">
            <dt className="text-slate-500">State</dt>
            <dd className="flex items-center gap-1.5">
              {React.createElement(stateIcon[task.state], {
                'aria-hidden': true,
                className: 'size-4',
              })}{' '}
              {task.state}
            </dd>
            <dt className="text-slate-500">Owner</dt>
            <dd>{task.owner}</dd>
            <dt className="text-slate-500">Dependencies</dt>
            <dd>{task.dependencies.join(', ') || 'None'}</dd>
            <dt className="text-slate-500">Scheduling</dt>
            <dd>
              {availability.status}: {availability.reason}
            </dd>
            <dt className="text-slate-500">Attempts</dt>
            <dd>
              {task.attempts} / {task.maxAttempts}
            </dd>
          </dl>
        </div>
        <div>
          <h3 id="dependency-connections" className="font-semibold">
            Dependency connections
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Each connection runs from prerequisite to dependent task.
          </p>
          <ul
            aria-labelledby="dependency-connections"
            className="mono mt-3 space-y-2 text-sm text-slate-400"
          >
            {taskEdges.map((edge) => (
              <li key={`${edge.from}-${edge.to}`}>
                {edge.from} → {edge.to}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-6 border-t border-slate-800 pt-6">
        <h3 className="font-semibold">Recovery scenarios</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-[8rem_1fr]">
          <dt className="text-slate-400">Failed / blocked</dt>
          <dd>Lead action is required; dependent tasks remain blocked.</dd>
          <dt className="text-slate-400">Retry wait</dt>
          <dd>
            A retry is runnable only when its scheduled time arrives and dependencies are complete.
          </dd>
          <dt className="text-slate-400">Exhausted</dt>
          <dd>
            After 3 attempts, the retry limit is exhausted and the task is no longer runnable.
          </dd>
        </dl>
      </div>
    </section>
  );
}
