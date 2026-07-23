import React, { useState, useEffect } from 'react';
import { getTransactionUrl, shortenAddress, formatXLM } from '../utils/stellar';

/**
 * Transaction Proof Component
 * Displays all blockchain transactions for mentor verification
 * Shows wallet address and all transaction hashes with links to Stellar Expert
 */
const TransactionProof = ({ walletAddress }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = () => {
      try {
        // Get all goals for this user
        const goals = JSON.parse(localStorage.getItem('stellargoal_goals') || '[]');
        const userGoals = goals.filter(g => g.owner === walletAddress);

        // Collect all deposits with transaction hashes
        const allTransactions = [];
        userGoals.forEach(goal => {
          if (goal.deposits && goal.deposits.length > 0) {
            goal.deposits.forEach(deposit => {
              if (deposit.txHash) {
                allTransactions.push({
                  ...deposit,
                  goalTitle: goal.title,
                  goalId: goal.id
                });
              }
            });
          }
        });

        // Sort by timestamp (newest first)
        allTransactions.sort((a, b) => b.timestamp - a.timestamp);
        setTransactions(allTransactions);
      } catch (err) {
        console.error('Error loading transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, [walletAddress]);

  if (loading) {
    return (
      <div className="transaction-proof loading">
        <div className="loading-spinner-small"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-proof empty">
        <div className="empty-state-icon">🔍</div>
        <h4>No Blockchain Transactions Yet</h4>
        <p>Make your first deposit to see verified transaction hashes here.</p>
      </div>
    );
  }

  const totalDeposited = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="transaction-proof">
      <div className="proof-header">
        <h3>🔐 Blockchain Transaction Proof</h3>
        <p className="proof-subtitle">
          All transactions are verifiable on the Stellar blockchain
        </p>
      </div>

      <div className="proof-summary">
        <div className="summary-item">
          <span className="summary-label">Wallet Address</span>
          <a
            href={`https://stellar.expert/explorer/testnet/account/${walletAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="summary-value wallet-link"
            title="View on Stellar Expert"
          >
            {shortenAddress(walletAddress, 12)}
          </a>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Transactions</span>
          <span className="summary-value">{transactions.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Total Deposited</span>
          <span className="summary-value">{formatXLM(totalDeposited)} XLM</span>
        </div>
      </div>

      <div className="proof-transactions">
        <div className="proof-transactions-header">
          <h4>📜 All Verified Transactions</h4>
        </div>
        <div className="proof-transactions-list">
          {transactions.map((tx, index) => (
            <div key={tx.id} className="proof-transaction-item">
              <div className="proof-tx-number">#{transactions.length - index}</div>
              <div className="proof-tx-details">
                <div className="proof-tx-goal">
                  <span className="proof-tx-label">Goal:</span>
                  <span className="proof-tx-value">{tx.goalTitle}</span>
                </div>
                <div className="proof-tx-amount">
                  <span className="proof-tx-label">Amount:</span>
                  <span className="proof-tx-value">{formatXLM(tx.amount)} XLM</span>
                </div>
                <div className="proof-tx-date">
                  <span className="proof-tx-label">Date:</span>
                  <span className="proof-tx-value">
                    {new Date(tx.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="proof-tx-hash">
                  <span className="proof-tx-label">Transaction Hash:</span>
                  <a
                    href={getTransactionUrl(tx.txHash, 'TESTNET')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proof-tx-hash-link"
                    title="View on Stellar Expert"
                  >
                    <span className="hash-full">{tx.txHash}</span>
                    <span className="hash-short">{shortenAddress(tx.txHash, 10)}</span>
                    <span className="external-icon">↗</span>
                  </a>
                </div>
                {tx.ledger && (
                  <div className="proof-tx-ledger">
                    <span className="proof-tx-label">Ledger:</span>
                    <span className="proof-tx-value">#{tx.ledger}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="proof-footer">
        <p>
          <strong>For Mentors:</strong> Click any transaction hash to verify on Stellar Expert.
          All transactions are permanently recorded on the Stellar blockchain.
        </p>
      </div>
    </div>
  );
};

export default TransactionProof;
