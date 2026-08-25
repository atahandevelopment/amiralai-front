export type TaskId = `TASK-${number}`;
export type TaskOwner = 'database' | 'backend' | 'frontend' | 'qa' | 'reviewer';
export type TaskState =
  'pending' | 'in_progress' | 'retry_wait' | 'completed' | 'failed' | 'blocked' | 'cancelled';

export interface GraphTask {
  readonly id: TaskId;
  readonly title: string;
  readonly owner: TaskOwner;
  readonly dependencies: readonly TaskId[];
  readonly state: TaskState;
  readonly attempts: number;
  readonly maxAttempts: number;
  readonly retryNotBefore: string | null;
}
export interface TaskEdge {
  readonly from: TaskId;
  readonly to: TaskId;
}
export interface TaskGraph {
  readonly tasks: readonly GraphTask[];
  readonly edges: readonly TaskEdge[];
}
export interface GraphValidation {
  readonly valid: boolean;
  readonly errors: readonly string[];
}
export interface ExecutionPlan extends GraphValidation {
  readonly waves: readonly (readonly TaskId[])[];
}
export interface RunnableTaskOptions {
  readonly now?: Date;
  /** Maximum total active and newly selected tasks. Omit for no limit. */
  readonly concurrencyLimit?: number;
}
export type TaskAvailability = {
  status: 'runnable' | 'blocked' | 'active' | 'terminal' | 'waiting' | 'awaiting_action';
  reason: string;
};

export function validateGraph(graph: TaskGraph): GraphValidation {
  const errors: string[] = [];
  const taskCounts = new Map<TaskId, number>();
  graph.tasks.forEach((task) => taskCounts.set(task.id, (taskCounts.get(task.id) ?? 0) + 1));
  const ids = new Set(taskCounts.keys());
  taskCounts.forEach((count, id) => {
    if (count > 1) errors.push(`Duplicate task ID ${id}; task IDs must be unique`);
  });
  for (const task of graph.tasks)
    for (const dependency of task.dependencies) {
      if (!ids.has(dependency))
        errors.push(`${task.id} references missing dependency ${dependency}`);
      if (dependency === task.id) errors.push(`${task.id} cannot depend on itself`);
    }
  const visiting = new Set<TaskId>();
  const visited = new Set<TaskId>();
  const cyclic = new Set<TaskId>();
  const visit = (id: TaskId): void => {
    if (visiting.has(id)) {
      cyclic.add(id);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    graph.tasks
      .find((task) => task.id === id)
      ?.dependencies.filter((dependency) => ids.has(dependency))
      .forEach(visit);
    visiting.delete(id);
    visited.add(id);
  };
  graph.tasks.forEach((task) => visit(task.id));
  cyclic.forEach((id) => errors.push(`Dependency cycle includes ${id}`));
  const expected = graph.tasks.flatMap((task) =>
    task.dependencies.map((from) => `${from}->${task.id}`),
  );
  const actual = graph.edges.map((edge) => `${edge.from}->${edge.to}`);
  expected.forEach((edge) => {
    if (!actual.includes(edge)) errors.push(`Missing dependency edge ${edge}`);
  });
  actual.forEach((edge) => {
    if (!expected.includes(edge)) errors.push(`Unexpected dependency edge ${edge}`);
  });
  const edgeCounts = new Map<string, number>();
  actual.forEach((edge) => edgeCounts.set(edge, (edgeCounts.get(edge) ?? 0) + 1));
  edgeCounts.forEach((count, edge) => {
    if (count > 1) errors.push(`Duplicate dependency edge ${edge}`);
  });
  return { valid: errors.length === 0, errors: [...new Set(errors)] };
}

/** Builds stable topological waves. An invalid graph always has an empty plan. */
export function createExecutionPlan(graph: TaskGraph): ExecutionPlan {
  const validation = validateGraph(graph);
  if (!validation.valid) return { ...validation, waves: [] };

  const remaining = new Set(graph.tasks.map((task) => task.id));
  const completed = new Set<TaskId>();
  const waves: TaskId[][] = [];
  while (remaining.size) {
    const wave = graph.tasks
      .filter(
        (task) =>
          remaining.has(task.id) &&
          task.dependencies.every((dependency) => completed.has(dependency)),
      )
      .map((task) => task.id);
    // Validation guarantees progress; retaining this guard prevents accidental partial plans.
    if (!wave.length)
      return { valid: false, errors: ['Unable to produce an execution plan'], waves: [] };
    waves.push(wave);
    wave.forEach((id) => {
      remaining.delete(id);
      completed.add(id);
    });
  }
  return { ...validation, waves };
}

export function getExecutionWaves(graph: TaskGraph): readonly (readonly TaskId[])[] {
  return createExecutionPlan(graph).waves;
}

export function getTaskAvailability(
  task: GraphTask,
  tasks: readonly GraphTask[],
  now = new Date(),
): TaskAvailability {
  if (task.state === 'in_progress')
    return { status: 'active', reason: 'The assigned agent is working on this task.' };
  if (task.state === 'completed' || task.state === 'cancelled')
    return { status: 'terminal', reason: `Task is ${task.state}.` };
  if (task.state === 'failed')
    return {
      status: 'awaiting_action',
      reason: 'Task failed and awaits Lead recovery, retry, replanning, or escalation.',
    };
  if (task.state === 'blocked')
    return {
      status: 'blocked',
      reason: 'Task is blocked and awaits Lead action to resolve or change the graph.',
    };
  const dependencies = task.dependencies.map((id) => tasks.find((item) => item.id === id));
  const missing = task.dependencies.filter((_, index) => !dependencies[index]);
  if (missing.length)
    return { status: 'blocked', reason: `Missing dependencies: ${missing.join(', ')}.` };
  const failed = dependencies.find(
    (dependency) => dependency && ['failed', 'blocked', 'cancelled'].includes(dependency.state),
  );
  if (failed)
    return {
      status: 'blocked',
      reason: `${failed.id} is ${failed.state} and must be resolved first.`,
    };
  const incomplete = dependencies.filter((dependency) => dependency?.state !== 'completed');
  if (incomplete.length)
    return {
      status: 'blocked',
      reason: `Waiting for ${incomplete.map((item) => item?.id).join(', ')}.`,
    };
  if (task.state === 'retry_wait') {
    if (task.attempts >= task.maxAttempts)
      return {
        status: 'terminal',
        reason: `Retry limit of ${task.maxAttempts} attempts is exhausted.`,
      };
    const retryTime = task.retryNotBefore ? new Date(task.retryNotBefore) : null;
    if (!retryTime || Number.isNaN(retryTime.getTime()) || retryTime > now)
      return {
        status: 'waiting',
        reason: task.retryNotBefore
          ? `Retry waits until ${task.retryNotBefore}.`
          : 'Retry readiness has not been scheduled.',
      };
    return {
      status: 'runnable',
      reason: `Retry attempt ${task.attempts + 1} of ${task.maxAttempts} is ready.`,
    };
  }
  return {
    status: 'runnable',
    reason: task.dependencies.length ? 'Every dependency is completed.' : 'No dependencies.',
  };
}

/** Selects runnable tasks in input order; active work consumes the optional concurrency limit. */
export function getRunnableTasks(
  graph: TaskGraph,
  options: RunnableTaskOptions = {},
): readonly GraphTask[] {
  if (!validateGraph(graph).valid) return [];
  const limit = options.concurrencyLimit;
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 0)) return [];
  const activeCount = graph.tasks.filter((task) => task.state === 'in_progress').length;
  const capacity =
    limit === undefined ? Number.POSITIVE_INFINITY : Math.max(0, limit - activeCount);
  return graph.tasks
    .filter(
      (task) =>
        getTaskAvailability(task, graph.tasks, options.now ?? new Date()).status === 'runnable',
    )
    .slice(0, capacity);
}

const base: readonly Omit<GraphTask, 'state' | 'attempts' | 'retryNotBefore'>[] = [
  {
    id: 'TASK-001',
    title: 'Define data model',
    owner: 'database',
    dependencies: [],
    maxAttempts: 3,
  },
  {
    id: 'TASK-002',
    title: 'Create API',
    owner: 'backend',
    dependencies: ['TASK-001'],
    maxAttempts: 3,
  },
  {
    id: 'TASK-003',
    title: 'Build interface',
    owner: 'frontend',
    dependencies: ['TASK-002'],
    maxAttempts: 3,
  },
  {
    id: 'TASK-004',
    title: 'Write integration tests',
    owner: 'qa',
    dependencies: ['TASK-002'],
    maxAttempts: 3,
  },
  {
    id: 'TASK-005',
    title: 'Review implementation',
    owner: 'reviewer',
    dependencies: ['TASK-003', 'TASK-004'],
    maxAttempts: 3,
  },
];
const states: readonly (readonly TaskState[])[] = [
  ['pending', 'pending', 'pending', 'pending', 'pending'],
  ['in_progress', 'pending', 'pending', 'pending', 'pending'],
  ['completed', 'in_progress', 'pending', 'pending', 'pending'],
  ['completed', 'completed', 'in_progress', 'in_progress', 'pending'],
  ['completed', 'completed', 'failed', 'completed', 'blocked'],
  ['completed', 'completed', 'retry_wait', 'completed', 'pending'],
  ['completed', 'completed', 'completed', 'completed', 'pending'],
  ['completed', 'completed', 'completed', 'completed', 'in_progress'],
  ['completed', 'completed', 'completed', 'completed', 'completed'],
];
export const demoSteps = states.map((step, stepIndex) =>
  base.map((task, index): GraphTask => ({
    ...task,
    state: step[index],
    attempts: stepIndex === 5 && index === 2 ? 1 : 0,
    retryNotBefore: stepIndex === 5 && index === 2 ? '2020-01-01T00:00:00.000Z' : null,
  })),
);
export const taskEdges: readonly TaskEdge[] = base.flatMap((task) =>
  task.dependencies.map((from) => ({ from, to: task.id })),
);
export const exampleGraph: TaskGraph = { tasks: demoSteps[0], edges: taskEdges };
