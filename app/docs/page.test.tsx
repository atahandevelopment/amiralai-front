import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Docs from './page';

describe('Docs landing page', () => {
  it('links to the configuration guide', () => {
    render(<Docs />);
    expect(
      screen
        .getAllByRole('link', { name: /Configuration/ })
        .every((link) => link.getAttribute('href') === '/docs/configuration'),
    ).toBe(true);
  });
});
