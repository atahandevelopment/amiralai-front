import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { InteractiveTaskGraph } from './task-graph';

afterEach(cleanup);

describe('InteractiveTaskGraph', () => {
  it('supports selection, progression, keyboard activation, and reset', async () => {
    const user = userEvent.setup();
    render(<InteractiveTaskGraph />);
    expect(screen.getByRole('button', { name: /TASK-001/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await user.click(screen.getByRole('button', { name: /TASK-002/ }));
    expect(screen.getByRole('button', { name: /TASK-002/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText(/Waiting for TASK-001/)).toBeVisible();
    const next = screen.getByRole('button', { name: 'Next step' });
    next.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText(/STEP 2\/9/)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Reset demo' }));
    expect(screen.getByText(/STEP 1\/9/)).toBeVisible();
    expect(screen.getByRole('button', { name: /TASK-001/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('exposes waves, dependencies, runnable status, and recovery explanations', () => {
    render(<InteractiveTaskGraph />);
    expect(screen.getByRole('heading', { name: 'WAVE 3' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Runnable now: TASK-001');
    expect(screen.getByRole('list', { name: 'Dependency connections' })).toHaveTextContent(
      'TASK-003 → TASK-005',
    );
    expect(screen.getByText(/retry limit is exhausted/i)).toBeVisible();
  });

  it('shows failure, blocking, and retry explanations during deterministic progression', async () => {
    const user = userEvent.setup();
    render(<InteractiveTaskGraph />);
    const next = screen.getByRole('button', { name: 'Next step' });
    for (let step = 0; step < 4; step += 1) await user.click(next);
    await user.click(screen.getByRole('button', { name: /TASK-003/ }));
    expect(screen.getByText(/awaits Lead recovery/i)).toBeVisible();
    await user.click(screen.getByRole('button', { name: /TASK-005/ }));
    expect(screen.getByText(/blocked and awaits Lead action/i)).toBeVisible();
    await user.click(next);
    await user.click(screen.getByRole('button', { name: /TASK-003/ }));
    expect(screen.getByText(/Retry attempt 2 of 3 is ready/i)).toBeVisible();
  });
});
