import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Docs from './page';

describe('Docs landing page', () => {
  it('links to the configuration guide', () => {
    render(<Docs />);
    expect(screen.getByRole('link', { name: /Configuration/ })).toHaveAttribute(
      'href',
      '/docs/configuration',
    );
  });
});
