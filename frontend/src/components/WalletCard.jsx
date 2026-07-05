import React from 'react';
import { shortenAddress } from '../utils/stellar';

/**
 * Wallet Card Component
 * Displays wallet connection status and controls
 */
const WalletCard = ({ wallet }) => {
  const { address, network, networkOk, installed, connecting, error, connect, disconnect } = wallet;

  // Wallet not installed state
  if (installed === false) {
    return (
      <div className="wallet-card">
        <div className="wallet-card-header">
          <h3>🔗 Connect Wallet</h3>
        </div>
        <div className="wallet-card-body">
          <div className="alert alert-warning">
            <p><strong>Freighter Extension Not Found</strong></p>
            <p>Please install the Freighter wallet extension to continue.</p>
            <a 
              href="https://www.freighter.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="button button-secondary"
            >
              Install Freighter
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Wallet checking state
  if (installed === null) {
    return (
      <div className="wallet-card">
        <div className="wallet-card-body">
          <div className="loading-spinner"></div>
          <p>Detecting Freighter wallet...</p>
        </div>
      </div>
    );
  }

  // Connected state
  if (address) {
    return (
      <div className="wallet-card wallet-connected">
        <div className="wallet-card-header">
          <h3>✅ Wallet Connected</h3>
          <button 
            onClick={disconnect} 
            className="button button-small button-danger"
            title="Disconnect wallet"
          >
            Disconnect
          </button>
        </div>
        <div className="wallet-card-body">
          <div className="wallet-info">
            <div className="wallet-info-row">
              <span className="wallet-label">Address:</span>
              <span className="wallet-address" title={address}>
                {shortenAddress(address, 8)}
              </span>
            </div>
            <div className="wallet-info-row">
              <span className="wallet-label">Network:</span>
              <span className={`wallet-network ${networkOk ? 'network-valid' : 'network-invalid'}`}>
                {network || 'Unknown'}
                {networkOk ? ' ✓' : ' ✗'}
              </span>
            </div>
          </div>
          {!networkOk && (
            <div className="alert alert-error">
              <p>⚠️ Please switch to Stellar Testnet in Freighter</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Disconnected state - show connect buttons
  return (
    <div className="wallet-card">
      <div className="wallet-card-header">
        <h3>🔗 Connect Wallet</h3>
      </div>
      <div className="wallet-card-body">
        <p className="wallet-description">
          Connect your Stellar wallet to start tracking your savings goals
        </p>
        
        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
        )}

        <div className="wallet-connect-buttons">
          <button 
            onClick={() => connect('freighter')} 
            disabled={connecting}
            className="button button-primary button-large"
          >
            {connecting ? (
              <>
                <span className="loading-spinner-small"></span>
                Connecting...
              </>
            ) : (
              <>
                <span className="button-icon">🚀</span>
                Connect Freighter
              </>
            )}
          </button>

          <button 
            onClick={() => connect('demo')} 
            disabled={connecting}
            className="button button-secondary button-large"
          >
            <span className="button-icon">🎮</span>
            Try Demo Mode
          </button>
        </div>

        <p className="wallet-note">
          Demo mode uses a simulated wallet for testing purposes.
        </p>
      </div>
    </div>
  );
};

export default WalletCard;
