import React from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { SiteHeader } from './site-header';

afterEach(cleanup);

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

  it('includes the primary CTA in mobile navigation and closes after route activation', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const menu = screen.getByRole('button', { name: 'Menu' });
    await user.click(menu);
    const mobileNavigation = screen.getByRole('navigation', { name: 'Mobile primary' });
    expect(mobileNavigation).toContainElement(
      screen.getAllByRole('link', { name: 'Get Started' })[1],
    );
    const docsLink = within(mobileNavigation).getByRole('link', { name: 'Docs' });
    docsLink.addEventListener('click', (event) => event.preventDefault());
    await user.click(docsLink);
    expect(menu).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: 'Mobile primary' })).not.toBeInTheDocument();
  });

  it('dismisses with Escape and restores focus to the menu trigger', async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const menu = screen.getByRole('button', { name: 'Menu' });
    await user.click(menu);
    within(screen.getByRole('navigation', { name: 'Mobile primary' }))
      .getByRole('link', { name: 'Docs' })
      .focus();
    await user.keyboard('{Escape}');
    expect(menu).toHaveFocus();
    expect(menu).toHaveAttribute('aria-expanded', 'false');
  });
});
