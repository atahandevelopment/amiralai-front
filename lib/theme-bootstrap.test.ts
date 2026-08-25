import { beforeEach, describe, expect, it, vi } from 'vitest';
import { themeScript } from './theme-bootstrap';

function runThemeScript() {
  // Execute exactly the source inlined by the root layout.
  Function(themeScript)();
}

describe('theme bootstrap script', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.style.colorScheme = '';
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('uses the system theme and applies it when storage access throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const matchMedia = vi.fn(() => ({ matches: true }));
    vi.stubGlobal('matchMedia', matchMedia);

    runThemeScript();

    expect(matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('applies a valid saved theme without querying the system', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('light');
    const matchMedia = vi.fn();
    vi.stubGlobal('matchMedia', matchMedia);

    runThemeScript();

    expect(matchMedia).not.toHaveBeenCalled();
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
  });
});
