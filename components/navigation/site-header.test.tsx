import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  it('provides keyboard navigation and the verified GitHub link', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const menu = screen.getByRole('button', { name: 'Menu' });
    menu.focus();
    await user.keyboard('{Enter}');
    expect(menu).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Mobile primary' })).toBeVisible();
    expect(screen.getAllByRole('link', { name: /GitHub/ })[0]).toHaveAttribute(
      'href',
      'https://github.com/atahandevelopment/amiral-ai',
    );
  });
});
