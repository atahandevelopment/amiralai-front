import { describe, expect, it } from 'vitest';
import {
  demoSteps,
  exampleGraph,
  createExecutionPlan,
  getExecutionWaves,
  getRunnableTasks,
  getTaskAvailability,
  validateGraph,
  type TaskGraph,
} from './task-graph';

describe('task graph', () => {
  it('finds root, blocked, parallel, failed, retry, and completed states', () => {
    expect(getTaskAvailability(demoSteps[0][0], demoSteps[0]).status).toBe('runnable');
    expect(getTaskAvailability(demoSteps[0][1], demoSteps[0]).status).toBe('blocked');
    expect(
      demoSteps[3]
        .filter((task) => getTaskAvailability(task, demoSteps[3]).status === 'active')
        .map((task) => task.id),
    ).toEqual(['TASK-003', 'TASK-004']);
    expect(getTaskAvailability(demoSteps[4][2], demoSteps[4]).status).toBe('awaiting_action');
    expect(getTaskAvailability(demoSteps[4][4], demoSteps[4]).status).toBe('blocked');
    expect(getTaskAvailability(demoSteps[5][2], demoSteps[5]).status).toBe('runnable');
    expect(getTaskAvailability(demoSteps[8][4], demoSteps[8]).status).toBe('terminal');
  });
  it('waits for retry time and dependencies and rejects exhausted retries', () => {
    const retry = { ...demoSteps[5][2], retryNotBefore: '2030-01-01T00:00:00.000Z' };
    expect(getTaskAvailability(retry, demoSteps[5], new Date('2029-01-01')).status).toBe('waiting');
    expect(
      getTaskAvailability({ ...retry, attempts: 3 }, demoSteps[5], new Date('2031-01-01')).reason,
    ).toContain('exhausted');
    const unresolved = demoSteps[5].map((task) =>
      task.id === 'TASK-002' ? { ...task, state: 'pending' as const } : task,
    );
    expect(getTaskAvailability(retry, unresolved, new Date('2031-01-01')).status).toBe('blocked');
  });
  it('validates the example and rejects missing references and cycles', () => {
    expect(validateGraph(exampleGraph).valid).toBe(true);
    const missing: TaskGraph = {
      tasks: [{ ...exampleGraph.tasks[0], dependencies: ['TASK-99'] }],
      edges: [],
    };
    expect(validateGraph(missing).errors[0]).toContain('missing');
    const cycle: TaskGraph = {
      tasks: [
        { ...exampleGraph.tasks[0], dependencies: ['TASK-002'] },
        { ...exampleGraph.tasks[1], dependencies: ['TASK-001'] },
      ],
      edges: [],
    };
    expect(validateGraph(cycle).errors.join(' ')).toContain('cycle');
    const duplicate: TaskGraph = {
      tasks: [exampleGraph.tasks[0], exampleGraph.tasks[0]],
      edges: [],
    };
    expect(validateGraph(duplicate).errors.join(' ')).toContain('unique');
    expect(validateGraph({ ...exampleGraph, edges: [] }).errors.join(' ')).toContain(
      'Missing dependency edge',
    );
    expect(
      validateGraph({
        ...exampleGraph,
        edges: [...exampleGraph.edges, { from: 'TASK-001', to: 'TASK-005' }],
      }).errors.join(' '),
    ).toContain('Unexpected dependency edge');
  });

  it('creates stable dependency waves and no partial plan for malformed graphs', () => {
    expect(getExecutionWaves(exampleGraph)).toEqual([
      ['TASK-001'],
      ['TASK-002'],
      ['TASK-003', 'TASK-004'],
      ['TASK-005'],
    ]);
    const malformed = { ...exampleGraph, edges: [] };
    expect(createExecutionPlan(malformed)).toMatchObject({ valid: false, waves: [] });
  });

  it('reports every edge consistency error explicitly', () => {
    const duplicateEdge = [...exampleGraph.edges, exampleGraph.edges[0]];
    expect(validateGraph({ ...exampleGraph, edges: duplicateEdge }).errors.join(' ')).toContain(
      'Duplicate dependency edge TASK-001->TASK-002',
    );
    const self = { ...exampleGraph.tasks[0], dependencies: ['TASK-001'] as const };
    expect(
      validateGraph({ tasks: [self], edges: [{ from: 'TASK-001', to: 'TASK-001' }] }).errors.join(
        ' ',
      ),
    ).toContain('cannot depend on itself');
  });

  it('selects runnable work deterministically within available concurrency', () => {
    expect(getRunnableTasks(exampleGraph, { concurrencyLimit: 1 }).map((task) => task.id)).toEqual([
      'TASK-001',
    ]);
    const parallel = { ...exampleGraph, tasks: demoSteps[3] };
    expect(getRunnableTasks(parallel, { concurrencyLimit: 2 })).toEqual([]);
    expect(
      getRunnableTasks({ ...exampleGraph, tasks: demoSteps[6] }, { concurrencyLimit: 1 }).map(
        (task) => task.id,
      ),
    ).toEqual(['TASK-005']);
  });
});
