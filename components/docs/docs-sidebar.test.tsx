import React from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DocsSidebar } from './docs-sidebar';

let pathname = '/docs/configuration';
vi.mock('next/navigation', () => ({ usePathname: () => pathname }));

describe('DocsSidebar', () => {
  beforeEach(() => {
    pathname = '/docs/configuration';
  });

  it('discovers Configuration and marks only the current route', () => {
    render(<DocsSidebar />);
    expect(screen.getByRole('link', { name: 'Configuration' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Intelligent Task Graph' })).not.toHaveAttribute(
      'aria-current',
    );
  });
});
