import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Architecture from './page';

describe('Architecture page', () => {
  it('links to the configuration reference', () => {
    render(<Architecture />);

    expect(screen.getByRole('link', { name: /Explore configuration/ })).toHaveAttribute(
      'href',
      '/docs/configuration',
    );
  });
});
