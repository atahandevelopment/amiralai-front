import React from 'react';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './theme-toggle';

function mockColorScheme(matches: boolean) {
  let listener: ((event: MediaQueryListEvent) => void) | undefined;
  const query = {
    matches,
    addEventListener: vi.fn((_name, callback) => {
      listener = callback;
    }),
    removeEventListener: vi.fn(),
  };
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => query),
  );
  return { query, change: (dark: boolean) => listener?.({ matches: dark } as MediaQueryListEvent) };
}

describe('ThemeToggle', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('starts in system light mode and follows live system changes', async () => {
    const media = mockColorScheme(false);
    const { unmount } = render(<ThemeToggle />);
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('light'));
    act(() => media.change(true));
    expect(document.documentElement.dataset.theme).toBe('dark');
    unmount();
    expect(media.query.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('honors a saved preference without subscribing to system changes', async () => {
    localStorage.setItem('amiral-theme', 'light');
    const media = mockColorScheme(true);
    render(<ThemeToggle />);
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('light'));
    expect(media.query.addEventListener).not.toHaveBeenCalled();
  });

  it('persists a keyboard-selected theme', async () => {
    mockColorScheme(true);
    render(<ThemeToggle />);
    await userEvent.click(await screen.findByRole('button', { name: 'Switch to light mode' }));
    expect(localStorage.getItem('amiral-theme')).toBe('light');
  });

  it('keeps an explicit in-session choice when the system theme changes', async () => {
    const media = mockColorScheme(false);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<ThemeToggle />);
    await userEvent.click(await screen.findByRole('button', { name: 'Switch to dark mode' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(media.query.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    act(() => media.change(false));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('still changes theme when storage access fails', async () => {
    mockColorScheme(false);
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<ThemeToggle />);
    await userEvent.click(await screen.findByRole('button', { name: 'Switch to dark mode' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
