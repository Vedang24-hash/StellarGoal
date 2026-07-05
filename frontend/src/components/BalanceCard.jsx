import React, { useState, useEffect } from 'react';
import { getBalance, formatXLM } from '../utils/stellar';

/**
 * Balance Card Component
 * Displays current XLM balance with auto-refresh
 */
const BalanceCard = ({ address }) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch balance
  const fetchBalance = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const bal = await getBalance(address);
      setBalance(bal);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load and auto-refresh every 15 seconds
  useEffect(() => {
    if (!address) return;
    
    fetchBalance();
    const interval = setInterval(() => fetchBalance(), 15000);
    
    return () => clearInterval(interval);
  }, [address]);

  // Manual refresh handler
  const handleRefresh = () => {
    fetchBalance(true);
  };

  if (loading) {
    return (
      <div className="balance-card">
        <div className="balance-card-body">
          <div className="loading-spinner"></div>
          <p>Loading balance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="balance-card">
        <div className="balance-card-header">
          <h3>💰 XLM Balance</h3>
        </div>
        <div className="balance-card-body">
          <div className="alert alert-error">
            <p>{error}</p>
          </div>
          <button onClick={handleRefresh} className="button button-secondary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="balance-card">
      <div className="balance-card-header">
        <h3>💰 XLM Balance</h3>
        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="button button-icon-only"
          title="Refresh balance"
        >
          {refreshing ? '⟳' : '↻'}
        </button>
      </div>
      <div className="balance-card-body">
        <div className="balance-amount">
          <span className="balance-value">{formatXLM(balance)}</span>
          <span className="balance-currency">XLM</span>
        </div>
        {parseFloat(balance) === 0 && (
          <div className="alert alert-info">
            <p>💡 Your account needs to be funded with XLM to start using StellarGoal.</p>
            <p>Visit <a href="https://laboratory.stellar.org/#account-creator?network=test" target="_blank" rel="noopener noreferrer">Stellar Laboratory</a> to fund your testnet account.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceCard;
