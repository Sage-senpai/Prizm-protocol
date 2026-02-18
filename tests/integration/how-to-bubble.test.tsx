import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import { HowToBubble } from '@/components/how-to-bubble';
import { WalletProvider } from '@/context/wallet-context';

describe('HowToBubble', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('renders the quick guide by default', async () => {
    render(
      <WalletProvider>
        <HowToBubble />
      </WalletProvider>,
    );

    expect(await screen.findByText('Welcome to Prizm.')).toBeInTheDocument();
    expect(screen.getByText('Start onboarding')).toBeInTheDocument();
  });

  it('can be dismissed and reopened', async () => {
    render(
      <WalletProvider>
        <HowToBubble />
      </WalletProvider>,
    );

    const dismiss = await screen.findByLabelText('Dismiss quick guide');
    fireEvent.click(dismiss);

    const reopen = await screen.findByLabelText('Open quick guide');
    fireEvent.click(reopen);

    expect(await screen.findByText('Welcome to Prizm.')).toBeInTheDocument();
  });
});
