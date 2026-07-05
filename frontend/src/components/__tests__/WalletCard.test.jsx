import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WalletCard from '../WalletCard';

describe('WalletCard', () => {
  it('renders wallet not installed state', () => {
    const wallet = {
      address: null,
      network: null,
      networkOk: false,
      installed: false,
      connecting: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn()
    };

    render(<WalletCard wallet={wallet} />);
    expect(screen.getByText(/Freighter Extension Not Found/i)).toBeTruthy();
  });

  it('renders connected state', () => {
    const wallet = {
      address: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      network: 'TESTNET',
      networkOk: true,
      installed: true,
      connecting: false,
      error: null,
      connect: vi.fn(),
      disconnect: vi.fn()
    };

    render(<WalletCard wallet={wallet} />);
    expect(screen.getByText(/Wallet Connected/i)).toBeTruthy();
    expect(screen.getByText(/TESTNET/i)).toBeTruthy();
  });

  it('calls connect when connect button clicked', () => {
    const connectFn = vi.fn();
    const wallet = {
      address: null,
      network: null,
      networkOk: false,
      installed: true,
      connecting: false,
      error: null,
      connect: connectFn,
      disconnect: vi.fn()
    };

    render(<WalletCard wallet={wallet} />);
    const connectButton = screen.getByText(/Connect Freighter/i);
    fireEvent.click(connectButton);
    
    expect(connectFn).toHaveBeenCalledWith('freighter');
  });

  it('calls disconnect when disconnect button clicked', () => {
    const disconnectFn = vi.fn();
    const wallet = {
      address: 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      network: 'TESTNET',
      networkOk: true,
      installed: true,
      connecting: false,
      error: null,
      connect: vi.fn(),
      disconnect: disconnectFn
    };

    render(<WalletCard wallet={wallet} />);
    const disconnectButton = screen.getByText(/Disconnect/i);
    fireEvent.click(disconnectButton);
    
    expect(disconnectFn).toHaveBeenCalled();
  });
});
