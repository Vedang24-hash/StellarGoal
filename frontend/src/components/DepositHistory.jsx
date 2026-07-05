import React, { useState, useEffect } from 'react';
import { formatXLM } from '../utils/stellar';

/**
 * Deposit History Component
 * Displays deposit history for a goal
 */
const DepositHistory = ({ goalId, onClose }) => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeposits = () => {
      try {
        const history = JSON.parse(
          localStorage.getItem(`stellargoal_deposits_${goalId}`) || '[]'
        );
        setDeposits(history.reverse()); // Show newest first
      } catch (err) {
        console.error('Error loading deposit history:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDeposits();
  }, [goalId]);

  if (loading) {
    return (
      <div className="deposit-history">
        <div className="deposit-history-header">
          <h4>Deposit History</h4>
          <button onClick={onClose} className="button button-icon-only">✕</button>
        </div>
        <div className="deposit-history-body">
          <div className="loading-spinner-small"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="deposit-history">
      <div className="deposit-history-header">
        <h4>📜 Deposit History</h4>
        <button onClick={onClose} className="button button-icon-only">✕</button>
      </div>
      <div className="deposit-history-body">
        {deposits.length === 0 ? (
          <p className="empty-state">No deposits yet</p>
        ) : (
          <div className="deposit-list">
            {deposits.map((deposit) => (
              <div key={deposit.id} className="deposit-item">
                <div className="deposit-item-amount">
                  <span className="deposit-icon">💰</span>
                  <span className="deposit-value">{formatXLM(deposit.amount)} XLM</span>
                </div>
                <div className="deposit-item-date">
                  {new Date(deposit.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositHistory;
