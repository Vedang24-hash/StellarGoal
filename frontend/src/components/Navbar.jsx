import React from 'react';
import { shortenAddress } from '../utils/stellar';

/**
 * Navbar Component
 * Top navigation bar with branding and wallet connection
 */
const Navbar = ({ wallet, onSendClick }) => {
  const { address, network, networkOk, connecting, connect, disconnect } = wallet;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <span className="navbar-logo">⭐</span>
          <span className="navbar-title">StellarGoal</span>
        </div>

        {/* Wallet Connection */}
        <div className="navbar-wallet">
          {address ? (
            <div className="navbar-wallet-connected">
              {/* Network Badge */}
              {networkOk && (
                <div className="navbar-network-badge">
                  <span className="network-dot"></span>
                  <span className="network-text">{network}</span>
                </div>
              )}
              
              {/* Address Display */}
              <div className="navbar-address">
                <span className="address-icon">👤</span>
                <span className="address-text">{shortenAddress(address, 6)}</span>
              </div>

              {/* Send XLM Button */}
              {onSendClick && (
                <button 
                  onClick={onSendClick}
                  className="navbar-button navbar-button-send"
                  title="Send XLM"
                >
                  <span className="button-icon">💸</span>
                  <span className="button-text">Send XLM</span>
                </button>
              )}

              {/* Disconnect Button */}
              <button 
                onClick={disconnect}
                className="navbar-button navbar-button-disconnect"
                title="Disconnect wallet"
              >
                <span className="button-icon">🔌</span>
                <span className="button-text">Disconnect</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => connect('freighter')}
              disabled={connecting}
              className="navbar-button navbar-button-connect"
            >
              {connecting ? (
                <>
                  <span className="loading-spinner-small"></span>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <span className="button-icon">🔗</span>
                  <span>Connect Wallet</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
